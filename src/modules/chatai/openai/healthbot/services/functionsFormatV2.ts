export const functionsFormat = [
  {
    name: "getIssuers",
    description: "Get list of insurance issuers for a given state.",
    parameters: {
      type: "object",
      properties: {
        state: {
          type: "string",
          description: "The state for which to retrieve issuers.",
        },
      },
      required: ["state"],
    },
  },
  {
    name: "getLocationByZipCode",
    description: "Get location details based on the provided zip code.",
    parameters: {
      type: "object",
      properties: {
        zipcode: {
          type: "string",
          description: "The zip code for which to retrieve location details.",
        },
        showOptions: {
          type: "boolean",
          description: "Flag to show multiple location options if available.",
        },
      },
      required: ["zipcode"],
    },
  },
  {
    name: "getPlanRecommendation",
    description:
      "Search for plan recommendations based on the given filters. You can inquire immediately once you've got the user's location.",
    parameters: {
      type: "object",
      properties: {
        place: {
          type: "object",
          properties: {
            countyFips: {
              type: "string",
              description: "FIPS code of the county.",
            },
            state: {
              type: "string",
              description: "State code.",
            },
            zipcode: {
              type: "string",
              description: "Zip code.",
            },
          },
          required: ["countyFips", "state", "zipcode"],
        },
        market: {
          type: "string",
          description: "Market type, either 'Individual' or 'SHOP'.",
        },
        issuers: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of issuer names.",
        },
        metal_levels: {
          type: "array",
          items: {
            type: "string",
            enum: ["Bronze", "Silver", "Gold", "Platinum"],
          },
          description: "List of metal levels.",
        },
        drugs: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of drug names.",
        },
      },
      required: ["place"],
    },
  },
  {
    name: "searchDrugs",
    description: "Autocomplete search for drugs based on the query.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The search query for drug names.",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "checkDrugIDAndPlanIDCoverage",
    description: "Check if a drug is covered under a specific plan.",
    parameters: {
      type: "object",
      properties: {
        drugID: {
          type: "string",
          description: "The ID of the drug.",
        },
        planID: {
          type: "string",
          description: "The ID of the plan.",
        },
      },
      required: ["drugID", "planID"],
    },
  },
  {
    name: "searchProviders",
    description:
      "Autocomplete search for providers (doctors or facilities) based on the query.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The search query for provider names.",
        },
        zipcode: {
          type: "string",
          description: "The zip code to filter providers.",
        },
        type: {
          type: "string",
          enum: ["Individual", "Facility", "Group"],
          description: "The type of provider.",
        },
      },
      required: ["query", "zipcode", "type"],
    },
  },
  {
    name: "checkProviderIDAndPlanIDCoverage",
    description: "Check if a provider is covered under a specific plan.",
    parameters: {
      type: "object",
      properties: {
        providerID: {
          type: "string",
          description: "The ID of the provider.",
        },
        planID: {
          type: "string",
          description: "The ID of the plan.",
        },
      },
      required: ["providerID", "planID"],
    },
  },
  {
    name: "checkEligibility",
    description: "Check discount eligibility for given members in a county.",
    parameters: {
      type: "object",
      properties: {
        income: {
          type: "number",
          description: "Household income.",
        },
        people: {
          type: "array",
          items: {
            type: "object",
            properties: {
              dob: {
                type: "string",
                description: "Date of birth in YYYY-MM-DD format.",
              },
              age: {
                type: "number",
                description: "Age in years (if dob is not provided).",
              },
              aptc_eligible: {
                type: "boolean",
                description: "Flag indicating if the person is APTC eligible.",
              },
              gender: {
                type: "string",
                enum: ["Male", "Female"],
                description: "Gender of the person.",
              },
              uses_tobacco: {
                type: "boolean",
                description: "Flag indicating if the person uses tobacco.",
              },
            },
            required: ["gender", "uses_tobacco"],
          },
          description: "List of people in the household.",
        },
        marketplace: {
          type: "string",
          enum: ["Individual", "SHOP"],
          description: "Marketplace type.",
        },
        place: {
          type: "object",
          properties: {
            countyfips: {
              type: "string",
              description: "FIPS code of the county.",
            },
            state: {
              type: "string",
              description: "State code.",
            },
            zipcode: {
              type: "string",
              description: "Zip code.",
            },
          },
          required: ["countyfips", "state", "zipcode"],
        },
      },
      required: ["income", "people", "marketplace", "place"],
    },
  },
];
