import { CONFIG } from "~/common/env";

const CMS_MARKETPLACE_API = CONFIG.CMS_MARKETPLACE_API;

async function marketplaceRequester(args: {
  resource: string;
  queryList?: Record<string, string>;
  method: string;
  body?: any;
}) {
  let _q = {
    apikey: CMS_MARKETPLACE_API,
    year: new Date().getFullYear().toString(),
    ...(args.queryList || {}),
  };
  let url = `https://marketplace.api.healthcare.gov/api/v1${args.resource}`;

  if (Object.keys(_q).length > 0) {
    url += "?";
    for (const [key, value] of Object.entries(_q)) {
      url += `${key}=${value}&`;
    }
    url = url.slice(0, -1);
  }

  const response = await fetch(url, {
    method: args.method,
    headers: {
      "Content-Type": "application/json",
    },
    body: args.body ? JSON.stringify(args.body) : undefined,
  });

  return await response.json();
}

export const available_functions = {
  // get list of insurance issuers
  getIssuers: async (args: { state: string }) => {
    const res = await marketplaceRequester({
      resource: "/issuers",
      queryList: {
        state: args.state,
      },
      method: "GET",
    });

    if (!res.issuers || res.issuers.length === 0) {
      return {
        error: "No issuers found on the given state",
        state: args.state,
      };
    }

    return {
      state: args.state,
      data: res.issuers.map((d: any) => ({
        id: d.id,
        name: d.name,
        state: d.state,
        shop_url: d.shop_url,
        toll_free: d.toll_free,
      })),
    };
  },
  // get location (if zip code is provided)
  getLocationByZipCode: async (args: {
    zipcode: string;
    showOptions?: boolean;
  }) => {
    const res = await marketplaceRequester({
      resource: `/counties/by/zip/${args.zipcode}`,
      method: "GET",
    });

    if (!res.counties || res.counties.length === 0) {
      return {
        error:
          "The provided zip is not valid. We can only provide information if you reside in the US.",
        zipcode: args.zipcode,
      };
    }

    if (!args.showOptions) {
      return {
        zipcode: args.zipcode,
        data: {
          fips: res.counties[0].fips,
          name: res.counties[0].name,
          state: res.counties[0].state,
          zipcode: res.counties[0].zipcode,
        },
      };
    }

    return {
      zipcode: args.zipcode,
      data: res.counties.map((d: any) => ({
        fips: d.fips,
        name: d.name,
        state: d.state,
        zipcode: d.zipcode,
      })),
    };
  },
  // search plan recommendation based on the given filters
  getPlanRecommendation: async (args: {
    place: { countyFips: string; state: string; zipcode: string };
    market?: "Individual" | "SHOP" | string; // Individual, SHOP
    issuers?: string[]; // Issuer name
    metal_levels?: ("Bronze" | "Silver" | "Gold" | "Platinum" | string)[]; // Bronze, Silver, Gold, Platinum
    drugs?: string[]; // Drug name
  }) => {
    const searchFilter: any = {};
    if (args.issuers) searchFilter["issuers"] = args.issuers;
    if (args.metal_levels) searchFilter["metal_levels"] = args.metal_levels;
    if (args.drugs) searchFilter["drugs"] = args.drugs;

    const searchBody: any = {
      filter: Object.keys(searchFilter).length > 0 ? searchFilter : undefined,
      place: args.place,
      market: args.market ?? "Individual",
    };

    const res = await marketplaceRequester({
      resource: `/plans/search`,
      method: "POST",
      body: searchBody,
    });

    // console.log(res)

    if (!res.plans || res.plans.length === 0) {
      if (res.message.includes("valid")) {
        return {
          botFlag: "LocationDataUnavailable",
          error:
            "Unfortunately, we do not have any plans available for the given location.",
        };
      }
      return {
        error: "No plans are found with the given filters",
      };
    }

    return {
      planRecommendation: res.plans,
      // true: true
    };
  },
  // drug autocomplete
  searchDrugs: async (args: { query: string }) => {
    const res = await marketplaceRequester({
      resource: `/drugs/autocomplete`,
      method: "GET",
      queryList: {
        q: args.query,
      },
    });

    // console.log(res)

    if (res.message || res.length === 0) {
      return {
        error: "No drugs found with the given query",
      };
    }

    return {
      drugs: res,
    };
  },
  // drug covered
  checkDrugIDAndPlanIDCoverage: async (args: {
    drugID: string;
    planID: string;
  }) => {
    const res = await marketplaceRequester({
      resource: `/drugs/covered`,
      method: "GET",
      queryList: {
        drugs: args.drugID,
        planids: args.planID,
      },
    });

    console.log(res);

    if (!res.coverage) {
      return {
        error: "No coverage found for the given drug and plan",
      };
    }

    return {
      coverage: res.coverage,
    };
  },
  // provider (doctor or facility) autocomplete
  searchProviders: async (args: {
    query: string;
    zipcode: string;
    type: "Individual" | "Facility" | "Group" | string;
  }) => {
    const res = await marketplaceRequester({
      resource: `/providers/autocomplete`,
      method: "GET",
      queryList: {
        q: args.query,
        zipcode: args.zipcode,
        type: args.type,
      },
    });

    // console.log(res)

    if (res.message || res.length === 0) {
      return {
        error: "No providers found with the given query",
      };
    }

    return {
      providers: res,
    };
  },
  // provider (doctor or facility) covered
  checkProviderIDAndPlanIDCoverage: async (args: {
    providerID: string;
    planID: string;
  }) => {
    const res = await marketplaceRequester({
      resource: `/providers/covered`,
      method: "GET",
      queryList: {
        providerids: args.providerID,
        planids: args.planID,
      },
    });

    // console.log(res)

    if (!res.coverage) {
      return {
        error: "No coverage found for the given provider and plan",
      };
    }

    return {
      coverage: res.coverage,
    };
  },
  // Check Discount Eligibility for Given Members in a County
  checkEligibility: async (args: {
    income: number;
    people: {
      dob?: string; // YYYY-MM-DD or use age instead
      age?: number; // age in years (if dob is not provided)
      aptc_eligible?: boolean; // default: true
      gender: "Male" | "Female" | string;
      uses_tobacco: boolean;
    }[];
    marketplace: "Individual" | "SHOP" | boolean;
    place: {
      countyfips: string;
      state: string;
      zipcode: string;
    };
  }) => {
    const res = await marketplaceRequester({
      resource: `/households/eligibility/estimates`,
      method: "POST",
      body: {
        household: {
          income: args.income,
          people: args.people.map((p) => ({
            ...p,
            aptc_eligible: p.aptc_eligible || true,
          })),
        },
        marketplace: args.marketplace,
        place: args.place,
      },
    });

    console.log(res);

    if (res.message) {
      return {
        error: "No eligibility found for the given filters",
      };
    }

    return {
      estimates: res.estimates,
    };
  },
};
