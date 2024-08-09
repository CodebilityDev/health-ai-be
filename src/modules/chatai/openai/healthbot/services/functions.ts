import axios from "axios";
import { CONFIG } from "~/common/env";

const CMS_API = CONFIG.CMS_MARKETPLACE_API;

async function get_counties_by_zip({
  zipcode,
  year = 2024,
  apikey = CMS_API,
}: {
  zipcode: any;
  year?: number;
  apikey?: string;
}) {
  const url = `https://marketplace.api.healthcare.gov/api/v1/counties/by/zip/${zipcode}`;

  const headers = { accept: "application/json" };

  const params = { year: year, apikey: CMS_API };

  const response = await axios.get(url, { headers: headers, params: params });

  return response.data;
}

async function get_counties_by_fips({
  countyfips,
  year = 2024,
  apikey = CMS_API,
}: {
  countyfips: any;
  year?: number;
  apikey?: string;
}) {
  const url = `https://marketplace.api.healthcare.gov/api/v1/counties/${countyfips}`;

  const headers = { accept: "application/json" };

  const params = { year: year, apikey: CMS_API };

  const response = await axios.get(url, { headers: headers, params: params });

  return response.data;
}

async function get_states({
  year = 2024,
  apikey = CMS_API,
}: {
  year?: number;
  apikey?: string;
}) {
  const url = "https://marketplace.api.healthcare.gov/api/v1/states";

  const headers = { accept: "application/json" };

  const params = { year: year, apikey: CMS_API };

  const response = await axios.get(url, { headers: headers, params: params });

  return response.data;
}

async function get_state_details_by_abbrev({
  state_abbr,
  year = 2024,
  apikey = CMS_API,
}: {
  state_abbr: any;
  year?: number;
  apikey?: string;
}) {
  const url = `https://marketplace.api.healthcare.gov/api/v1/states/${state_abbr}`;

  const headers = { accept: "application/json" };

  const params = { year: year, apikey: CMS_API };

  const response = await axios.get(url, { headers: headers, params: params });

  return response.data;
}

async function get_states_medicaid_by_abbrev({
  state_abbr,
  quarter = 2,
  year = 2019,
  apikey = CMS_API,
}: {
  state_abbr: any;
  quarter?: number;
  year?: number;
  apikey?: string;
}) {
  const url = `https://marketplace.api.healthcare.gov/api/v1/states/${state_abbr}/medicaid`;

  const headers = { accept: "application/json" };

  const params = { quarter: quarter, year: year, apikey: CMS_API };

  const response = await axios.get(url, { headers: headers, params: params });

  return response.data;
}

async function get_poverty_guidelines_by_state_abbrev({
  state_abbr,
  year = 2024,
  apikey = CMS_API,
}: {
  state_abbr: any;
  year?: number;
  apikey?: string;
}) {
  const url = `https://marketplace.api.healthcare.gov/api/v1/states/${state_abbr}/poverty-guidelines`;

  const headers = { accept: "application/json" };

  const params = { year: year, apikey: CMS_API };

  const response = await axios.get(url, { headers: headers, params: params });

  return response.data;
}

async function get_rate_areas({
  zipcode,
  fips,
  state,
  year = 2024,
  market = "Individual",
  apikey = CMS_API,
}: {
  zipcode: any;
  fips: any;
  state: any;
  year?: number;
  market?: string;
  apikey?: string;
}) {
  const url = "https://marketplace.api.healthcare.gov/api/v1/rate-areas";

  const headers = { accept: "application/json" };

  const params = {
    year: year,
    market: market,
    zipcode: zipcode,
    fips: fips,
    state: state,
    apikey: CMS_API,
  };

  const response = await axios.get(url, { headers: headers, params: params });

  return response.data;
}

async function drugs_autocomplete({
  query,
  year = 2024,
  apikey = CMS_API,
}: {
  query: any;
  year?: number;
  apikey?: string;
}) {
  const url =
    "https://marketplace.api.healthcare.gov/api/v1/drugs/autocomplete";

  const headers = { accept: "application/json" };

  const params = { q: query, year: year, apikey: CMS_API };

  const response = await axios.get(url, { headers: headers, params: params });

  return response.data;
}

async function drugs_search({
  query,
  year = 2024,
  apikey = CMS_API,
}: {
  query: any;
  year?: number;
  apikey?: string;
}) {
  const url = "https://marketplace.api.healthcare.gov/api/v1/drugs/search";

  const headers = { accept: "application/json" };

  const params = { q: query, year: year, apikey: CMS_API };

  const response = await axios.get(url, { headers: headers, params: params });

  return response.data;
}

async function drugs_covered({
  planids,
  drugs_rxcui,
  year = 2024,
  apikey = CMS_API,
}: {
  planids: any;
  drugs_rxcui: any;
  year?: number;
  apikey?: string;
}) {
  const url = "https://marketplace.api.healthcare.gov/api/v1/drugs/covered";

  const headers = { accept: "application/json" };

  const params = {
    planids: planids,
    drugs: drugs_rxcui,
    year: year,
    apikey: CMS_API,
  };

  const response = await axios.get(url, { headers: headers, params: params });

  return response.data;
}

async function drugs_coverage_stats({ apikey = CMS_API }: { apikey?: string }) {
  const url = "https://marketplace.api.healthcare.gov/api/v1/coverage/stats";

  const headers = { accept: "application/json" };

  const params = { apikey: CMS_API };

  const response = await axios.get(url, { headers: headers, params: params });

  return response.data;
}

async function drugs_coverage_search({
  zipcode,
  query,
  apikey = CMS_API,
}: {
  zipcode: any;
  query: any;
  apikey?: string;
}) {
  const url = "https://marketplace.api.healthcare.gov/api/v1/coverage/search";

  const headers = { accept: "application/json" };

  const params = { zipcode: zipcode, q: query, apikey: CMS_API };

  const response = await axios.get(url, { headers: headers, params: params });

  return response.data;
}

async function drugs_providers_autocomplete({
  type,
  zipcode,
  query,
  apikey = CMS_API,
}: {
  type: any;
  zipcode: any;
  query: any;
  apikey?: string;
}) {
  const url =
    "https://marketplace.api.healthcare.gov/api/v1/providers/autocomplete";

  const headers = { accept: "application/json" };

  const params = { type: type, zipcode: zipcode, q: query, apikey: CMS_API };

  const response = await axios.get(url, { headers: headers, params: params });

  return response.data;
}

async function drugs_providers_search({
  type,
  zipcode,
  query,
  specialty = "",
  year = 2024,
  apikey = CMS_API,
}: {
  type: any;
  zipcode: any;
  query: any;
  specialty?: string;
  year?: number;
  apikey?: string;
}) {
  const url = "https://marketplace.api.healthcare.gov/api/v1/providers/search";

  const headers = { accept: "application/json" };

  const params = {
    specialty: specialty,
    type: type,
    zipcode: zipcode,
    q: query,
    year: year,
    apikey: CMS_API,
  };

  const response = await axios.get(url, { headers: headers, params: params });

  return response.data;
}

async function drugs_providers_covered({
  planids,
  providerids,
  year = 2024,
  apikey = CMS_API,
}: {
  planids: any;
  providerids: any;
  year?: number;
  apikey?: string;
}) {
  const url = "https://marketplace.api.healthcare.gov/api/v1/providers/covered";

  const headers = { accept: "application/json" };

  const params = {
    year: year,
    planids: planids,
    providerids: providerids,
    apikey: CMS_API,
  };

  const response = await axios.get(url, { headers: headers, params: params });

  return response.data;
}

async function households_eligibility_estimates({
  countyfips,
  state,
  zipcode,
  income = 52000,
  dob = "1992-01-01",
  aptc_eligible = true,
  gender = "Male",
  uses_tobacco = false,
  market = "Individual",
  household_year = 2024,
  api_year = 2024,
  apikey = CMS_API,
}: {
  countyfips: any;
  state: any;
  zipcode: any;
  income?: number;
  dob?: string;
  aptc_eligible?: boolean;
  gender?: string;
  uses_tobacco?: boolean;
  market?: string;
  household_year?: number;
  api_year?: number;
  apikey?: string;
}) {
  const url =
    "https://marketplace.api.healthcare.gov/api/v1/households/eligibility/estimates";

  const payload = {
    household: {
      income: income,
      people: [
        {
          dob: dob,
          aptc_eligible: aptc_eligible,
          gender: gender,
          uses_tobacco: uses_tobacco,
        },
      ],
    },
    market: market,
    place: {
      countyfips: countyfips,
      state: state,
      zipcode: zipcode,
    },
    year: household_year,
  };

  const headers = {
    accept: "application/json",
    "content-type": "application/json",
  };

  const params = { year: api_year, apikey: CMS_API };

  const response = await axios.post(url, payload, {
    headers: headers,
    params: params,
  });

  return response.data;
}

async function households_ichra({
  countyfips,
  state,
  zipcode,
  income = 40000,
  dob = "1992-01-01",
  aptc_eligible = true,
  gender = "Male",
  uses_tobacco = false,
  market = "Individual",
  hra = 500,
  household_year = 2024,
  api_year = 2024,
  apikey = CMS_API,
}: {
  countyfips: any;
  state: any;
  zipcode: any;
  income?: number;
  dob?: string;
  aptc_eligible?: boolean;
  gender?: string;
  uses_tobacco?: boolean;
  market?: string;
  hra?: number;
  household_year?: number;
  api_year?: number;
  apikey?: string;
}) {
  const url = "https://marketplace.api.healthcare.gov/api/v1/households/ichra";

  const payload = {
    household: {
      income: income,
      people: [
        {
          dob: dob,
          aptc_eligible: aptc_eligible,
          gender: gender,
          uses_tobacco: uses_tobacco,
        },
      ],
    },
    market: market,
    place: {
      countyfips: countyfips,
      state: state,
      zipcode: zipcode,
    },
    hra: hra,
    year: household_year,
  };

  const headers = {
    accept: "application/json",
    "content-type": "application/json",
  };

  const params = { year: api_year, apikey: CMS_API };

  const response = await axios.post(url, payload, {
    headers: headers,
    params: params,
  });

  return response.data;
}

async function households_lcbp({
  countyfips,
  state,
  zipcode,
  income = 60000,
  dob = "1992-01-01",
  aptc_eligible = true,
  gender = "Male",
  uses_tobacco = false,
  market = "Individual",
  household_year = 2024,
  api_year = 2024,
  apikey = CMS_API,
}: {
  countyfips: any;
  state: any;
  zipcode: any;
  income?: number;
  dob?: string;
  aptc_eligible?: boolean;
  gender?: string;
  uses_tobacco?: boolean;
  market?: string;
  household_year?: number;
  api_year?: number;
  apikey?: string;
}) {
  const url = "https://marketplace.api.healthcare.gov/api/v1/households/lcbp";

  const payload = {
    household: {
      income: income,
      people: [
        {
          dob: dob,
          aptc_eligible: aptc_eligible,
          gender: gender,
          uses_tobacco: uses_tobacco,
        },
      ],
    },
    market: market,
    place: {
      countyfips: countyfips,
      state: state,
      zipcode: zipcode,
    },
    year: household_year,
  };

  const headers = {
    accept: "application/json",
    "content-type": "application/json",
  };

  const params = { year: api_year, apikey: CMS_API };

  const response = await axios.post(url, payload, {
    headers: headers,
    params: params,
  });

  return response.data;
}

async function households_slcsp({
  countyfips,
  state,
  zipcode,
  income = 80000,
  dob = "1992-01-01",
  aptc_eligible = true,
  gender = "Male",
  uses_tobacco = false,
  market = "Individual",
  household_year = 2024,
  api_year = 2024,
  apikey = CMS_API,
}: {
  countyfips: any;
  state: any;
  zipcode: any;
  income?: number;
  dob?: string;
  aptc_eligible?: boolean;
  gender?: string;
  uses_tobacco?: boolean;
  market?: string;
  household_year?: number;
  api_year?: number;
  apikey?: string;
}) {
  const url = "https://marketplace.api.healthcare.gov/api/v1/households/slcsp";

  const payload = {
    household: {
      income: income,
      people: [
        {
          dob: dob,
          aptc_eligible: aptc_eligible,
          gender: gender,
          uses_tobacco: uses_tobacco,
        },
      ],
    },
    market: market,
    place: {
      countyfips: countyfips,
      state: state,
      zipcode: zipcode,
    },
    year: household_year,
  };

  const headers = {
    accept: "application/json",
    "content-type": "application/json",
  };

  const params = { year: api_year, apikey: CMS_API };

  const response = await axios.post(url, payload, {
    headers: headers,
    params: params,
  });

  return response.data;
}

async function households_lcsp({
  countyfips,
  state,
  zipcode,
  income = 80000,
  dob = "1992-01-01",
  aptc_eligible = true,
  gender = "Male",
  uses_tobacco = false,
  market = "Individual",
  household_year = 2024,
  api_year = 2024,
  apikey = CMS_API,
}: {
  countyfips: any;
  state: any;
  zipcode: any;
  income?: number;
  dob?: string;
  aptc_eligible?: boolean;
  gender?: string;
  uses_tobacco?: boolean;
  market?: string;
  household_year?: number;
  api_year?: number;
  apikey?: string;
}) {
  const url = "https://marketplace.api.healthcare.gov/api/v1/households/lcsp";

  const payload = {
    household: {
      income: income,
      people: [
        {
          dob: dob,
          aptc_eligible: aptc_eligible,
          gender: gender,
          uses_tobacco: uses_tobacco,
        },
      ],
    },
    market: market,
    place: {
      countyfips: countyfips,
      state: state,
      zipcode: zipcode,
    },
    year: household_year,
  };

  const headers = {
    accept: "application/json",
    "content-type": "application/json",
  };

  const params = { year: api_year, apikey: CMS_API };

  const response = await axios.post(url, payload, {
    headers: headers,
    params: params,
  });

  return response.data;
}

async function households_pcfpl({
  income,
  size,
  state,
  year = 2024,
  apikey = CMS_API,
}: {
  income: any;
  size: any;
  state: any;
  year?: number;
  apikey?: string;
}) {
  const url = "https://marketplace.api.healthcare.gov/api/v1/households/pcfpl";

  const headers = { accept: "application/json" };

  const params = {
    income: income,
    size: size,
    state: state,
    year: year,
    apikey: CMS_API,
  };

  const response = await axios.get(url, { headers: headers, params: params });

  return response.data;
}

async function last_year_plans_crosswalk({
  fips,
  zipcode,
  state,
  plan_id,
  year = 2024,
  apikey = CMS_API,
}: {
  fips: any;
  zipcode: any;
  state: any;
  plan_id: any;
  year?: number;
  apikey?: string;
}) {
  const url = "https://marketplace.api.healthcare.gov/api/v1/crosswalk";

  const headers = { accept: "application/json" };

  const params = {
    fips: fips,
    zipcode: zipcode,
    state: state,
    plan_id: plan_id,
    year: year,
    apikey: CMS_API,
  };

  const response = await axios.get(url, { headers: headers, params: params });

  return response.data;
}

async function get_healthcare_plans({
  countyfips,
  state,
  zipcode,
  plan_ids,
  year,
  api_year = 2024,
  apikey = CMS_API,
}: {
  countyfips: any;
  state: any;
  zipcode: any;
  plan_ids: any;
  year: any;
  api_year?: number;
  apikey?: string;
}) {
  const url = "https://marketplace.api.healthcare.gov/api/v1/plans";

  const payload = {
    place: {
      countyfips: countyfips,
      state: state,
      zipcode: zipcode,
    },
    plan_ids: plan_ids,
    year: year,
  };

  const headers = {
    accept: "application/json",
    "content-type": "application/json",
  };

  const params = { year: api_year, apikey: CMS_API };

  const response = await axios.post(url, payload, {
    headers: headers,
    params: params,
  });

  return response.data;
}

async function search_plans({
  countyfips,
  state,
  zipcode,
  market = "Individual",
  year = 2024,
  api_year = 2024,
  apikey = CMS_API,
}: {
  countyfips: any;
  state: any;
  zipcode: any;
  market?: string;
  year?: number;
  api_year?: number;
  apikey?: string;
}) {
  const url = "https://marketplace.api.healthcare.gov/api/v1/plans/search";

  const payload = {
    market: market,
    place: {
      countyfips: countyfips,
      state: state,
      zipcode: zipcode,
    },
    year: year,
  };

  const headers = {
    accept: "application/json",
    "content-type": "application/json",
  };

  const params = { year: api_year, apikey: CMS_API };

  const response = await axios.post(url, payload, {
    headers: headers,
    params: params,
  });

  return response.data;
}

async function plans_search_stats({
  countyfips,
  state,
  zipcode,
  income = 20000,
  dob = "1992-01-01",
  aptc_eligible = true,
  gender = "Male",
  uses_tobacco = false,
  market = "Individual",
  household_year = 2024,
  api_year = 2024,
  apikey = CMS_API,
}: {
  countyfips: any;
  state: any;
  zipcode: any;
  income?: number;
  dob?: string;
  aptc_eligible?: boolean;
  gender?: string;
  uses_tobacco?: boolean;
  market?: string;
  household_year?: number;
  api_year?: number;
  apikey?: string;
}) {
  const url =
    "https://marketplace.api.healthcare.gov/api/v1/plans/search/stats";

  const payload = {
    household: {
      income: income,
      people: [
        {
          dob: dob,
          aptc_eligible: aptc_eligible,
          gender: gender,
          uses_tobacco: uses_tobacco,
        },
      ],
    },
    market: market,
    place: {
      countyfips: countyfips,
      state: state,
      zipcode: zipcode,
    },
    year: household_year,
  };

  const headers = {
    accept: "application/json",
    "content-type": "application/json",
  };

  const params = { year: api_year, apikey: CMS_API };

  const response = await axios.post(url, payload, {
    headers: headers,
    params: params,
  });

  return response.data;
}

async function get_plans_by_planID({
  plan_id,
  year = 2014,
  apikey = CMS_API,
}: {
  plan_id: any;
  year?: number;
  apikey?: string;
}) {
  const url = `https://marketplace.api.healthcare.gov/api/v1/plans/${plan_id}`;

  const headers = { accept: "application/json" };

  const params = { year: year, apikey: CMS_API };

  const response = await axios.get(url, { headers: headers, params: params });

  return response.data;
}

async function plans_quality_ratings_by_planID({
  plan_id,
  year = 2024,
  apikey = CMS_API,
}: {
  plan_id: any;
  year?: number;
  apikey?: string;
}) {
  const url = `https://marketplace.api.healthcare.gov/api/v1/plans/${plan_id}/quality-ratings`;

  const headers = { accept: "application/json" };

  const params = { year: year, apikey: CMS_API };

  const response = await axios.get(url, { headers: headers, params: params });

  return response.data;
}

async function list_issuers({
  state,
  offset = 0,
  limit = 25,
  year = 2024,
  apikey = CMS_API,
}: {
  state: any;
  offset?: number;
  limit?: number;
  year?: number;
  apikey?: string;
}) {
  const url = "https://marketplace.api.healthcare.gov/api/v1/issuers";

  const headers = { accept: "application/json" };

  const params = {
    offset: offset,
    limit: limit,
    state: state,
    year: year,
    apikey: CMS_API,
  };

  const response = await axios.get(url, { headers: headers, params: params });

  return response.data;
}

async function get_issuer_by_issuersID({
  issuer_id,
  year = 2024,
  apikey = CMS_API,
}: {
  issuer_id: any;
  year?: number;
  apikey?: string;
}) {
  const url = `https://marketplace.api.healthcare.gov/api/v1/issuers/${issuer_id}`;

  const headers = { accept: "application/json" };

  const params = { year: year, apikey: CMS_API };

  const response = await axios.get(url, { headers: headers, params: params });

  return response.data;
}

async function enrollment_validation({
  max_aptc,
  is_custom,
  division,
  enrollment_groups,
  enrollees,
  year = 2024,
  apikey = CMS_API,
}: {
  max_aptc: any;
  is_custom: any;
  division: any;
  enrollment_groups: any;
  enrollees: any;
  year?: number;
  apikey?: string;
}) {
  const url =
    "https://marketplace.api.healthcare.gov/api/v1/enrollment/validate";

  const payload = {
    maxAPTC: max_aptc,
    year: year,
    is_custom: is_custom,
    division: division,
    enrollment_groups: enrollment_groups,
    enrollees: enrollees,
  };

  const headers = {
    accept: "application/json",
    "content-type": "application/json",
  };

  const params = { apikey: CMS_API };

  const response = await axios.post(url, payload, {
    headers: headers,
    params: params,
  });

  return response.data;
}

async function api_version({ apikey = CMS_API }: { apikey?: string }) {
  const url = "https://marketplace.api.healthcare.gov/api/v1/versions";

  const headers = { accept: "application/json" };

  const params = { apikey: CMS_API };

  const response = await axios.get(url, { headers: headers, params: params });

  return response.data;
}

async function market_years({ apikey = CMS_API }: { apikey?: string }) {
  const url = "https://marketplace.api.healthcare.gov/api/v1/market-years";

  const headers = { accept: "application/json" };

  const params = { apikey: CMS_API };

  const response = await axios.get(url, { headers: headers, params: params });

  return response.data;
}

async function bulk_data_apt({
  year = 2024,
  apikey = CMS_API,
}: {
  year?: number;
  apikey?: string;
}) {
  const url = "https://marketplace.api.healthcare.gov/api/v1/data/apt";

  const headers = { accept: "application/json" };

  const params = { year: year, apikey: CMS_API };

  const response = await axios.get(url, { headers: headers, params: params });

  return response.data;
}

async function data_decile_mapping({
  year = 2024,
  apikey = CMS_API,
}: {
  year?: number;
  apikey?: string;
}) {
  const url =
    "https://marketplace.api.healthcare.gov/api/v1/data/decile-mapping";

  const headers = { accept: "application/json" };

  const params = { year: year, apikey: CMS_API };

  const response = await axios.get(url, { headers: headers, params: params });

  return response.data;
}

async function data_state_medicaid({
  year = 2024,
  apikey = CMS_API,
}: {
  year?: number;
  apikey?: string;
}) {
  const url =
    "https://marketplace.api.healthcare.gov/api/v1/data/state-medicaid";

  const headers = { accept: "application/json" };

  const params = { year: year, apikey: CMS_API };

  const response = await axios.get(url, { headers: headers, params: params });

  return response.data;
}

async function bulk_data_rate_areas({
  year = 2024,
  apikey = CMS_API,
}: {
  year?: number;
  apikey?: string;
}) {
  const url = "https://marketplace.api.healthcare.gov/api/v1/data/rate-areas";

  const headers = { accept: "application/json" };

  const params = { year: year, apikey: CMS_API };

  const response = await axios.get(url, { headers: headers, params: params });

  return response.data;
}

async function bulk_county_zips({
  year = 2024,
  apikey = CMS_API,
}: {
  year?: number;
  apikey?: string;
}) {
  const url = "https://marketplace.api.healthcare.gov/api/v1/data/county-zips";

  const headers = { accept: "application/json" };

  const params = { year: year, apikey: CMS_API };

  const response = await axios.get(url, { headers: headers, params: params });

  return response.data;
}

async function bulk_data_crosswalk({
  year = 2024,
  apikey = CMS_API,
}: {
  year?: number;
  apikey?: string;
}) {
  const url = "https://marketplace.api.healthcare.gov/api/v1/data/crosswalk";

  const headers = { accept: "application/json" };

  const params = { year: year, apikey: CMS_API };

  const response = await axios.get(url, { headers: headers, params: params });

  return response.data;
}

async function plans_with_premiums({
  plan_id,
  countyfips,
  state,
  zipcode,
  market = "Individual",
  income = 32000,
  age = 20,
  aptc_eligible = true,
  gender = "Male",
  uses_tobacco = false,
  year = 2024,
  apikey = CMS_API,
}: {
  plan_id: any;
  countyfips: any;
  state: any;
  zipcode: any;
  market?: string;
  income?: number;
  age?: number;
  aptc_eligible?: boolean;
  gender?: string;
  uses_tobacco?: boolean;
  year?: number;
  apikey?: string;
}) {
  const url = `https://marketplace.api.healthcare.gov/api/v1/plans/${plan_id}`;

  const payload = {
    household: {
      income: income,
      people: [
        {
          age: age,
          aptc_eligible: aptc_eligible,
          gender: gender,
          uses_tobacco: uses_tobacco,
        },
      ],
    },
    market: market,
    place: {
      countyfips: countyfips,
      state: state,
      zipcode: zipcode,
    },
    year: year,
  };

  const headers = {
    accept: "application/json",
    "content-type": "application/json",
  };

  const params = { apikey: CMS_API };

  const response = await axios.post(url, payload, {
    headers: headers,
    params: params,
  });

  return response.data;
}

export const available_functions = {
  get_plans_by_planID,
  plans_quality_ratings_by_planID,
  list_issuers,
  get_issuer_by_issuersID,
  enrollment_validation,
  api_version,
  market_years,
  bulk_data_apt,
  data_decile_mapping,
  data_state_medicaid,
  bulk_data_rate_areas,
  bulk_county_zips,
  bulk_data_crosswalk,
  plans_with_premiums,
  get_counties_by_zip,
  get_counties_by_fips,
  get_states,
  get_state_details_by_abbrev,
  get_states_medicaid_by_abbrev,
  get_poverty_guidelines_by_state_abbrev,
  get_rate_areas,
  drugs_autocomplete,
  drugs_search,
  drugs_covered,
  drugs_coverage_stats,
  drugs_coverage_search,
  drugs_providers_autocomplete,
  drugs_providers_search,
  drugs_providers_covered,
  households_eligibility_estimates,
  households_ichra,
  households_lcbp,
  households_slcsp,
  households_lcsp,
  households_pcfpl,
  last_year_plans_crosswalk,
  get_healthcare_plans,
  search_plans,
  plans_search_stats,
};
