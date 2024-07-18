export const functionsFormat = [
  {
    name: "get_healthcare_plans",
    description:
      "Retrieves healthcare plans for a given location (county fips, state abbreviation, zip code) and plan IDs.",
    parameters: {
      type: "object",
      properties: {
        countyfips: {
          type: "string",
          description: "The FIPS code of the county.",
        },
        state: {
          type: "string",
          description: "The state abbreviation.",
        },
        zipcode: {
          type: "string",
          description: "The ZIP code.",
        },
        plan_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "The list of plan IDs.",
        },
        year: {
          type: "integer",
          description: "The year of the plans.",
        },
        api_year: {
          type: "integer",
          description: "The API year parameter.",
        },
        apikey: {
          type: "string",
          description: "The API key for authentication.",
        },
      },
      required: ["countyfips", "state", "zipcode", "plan_ids", "year"],
    },
  },
  {
    name: "get_states",
    description: "Retrieves the list of states for a given year.",
    parameters: {
      type: "object",
      properties: {
        year: {
          type: "integer",
          description: "The year for which to retrieve the states.",
        },
        apikey: {
          type: "string",
          description: "The API key for authentication.",
        },
      },
      required: [],
    },
  },
  {
    name: "get_counties_by_zip",
    description: "Retrieves the counties for a given ZIP code and year.",
    parameters: {
      type: "object",
      properties: {
        zipcode: {
          type: "string",
          description: "The ZIP code to retrieve counties for.",
        },
        year: {
          type: "integer",
          description: "The year for which to retrieve the counties.",
        },
        apikey: {
          type: "string",
          description: "The API key for authentication.",
        },
      },
      required: ["zipcode"],
    },
  },
  {
    name: "search_plans",
    description:
      "Searches for healthcare plans based on market, location, and year.",
    parameters: {
      type: "object",
      properties: {
        market: {
          type: "string",
          description: "The market type (e.g., 'Individual').",
        },
        countyfips: {
          type: "string",
          description: "The FIPS code of the county.",
        },
        state: {
          type: "string",
          description: "The state abbreviation.",
        },
        zipcode: {
          type: "string",
          description: "The ZIP code.",
        },
        year: {
          type: "integer",
          description: "The year of the plans.",
        },
        api_year: {
          type: "integer",
          description: "The API year parameter.",
        },
        apikey: {
          type: "string",
          description: "The API key for authentication.",
        },
      },
      required: [
        "market",
        "countyfips",
        "state",
        "zipcode",
        "year",
        "api_year",
        "apikey",
      ],
    },
  },
  {
    name: "get_counties_by_fips",
    description: "Retrieves the details of a county for a given year.",
    parameters: {
      type: "object",
      properties: {
        countyfips: {
          type: "string",
          description: "The ID of the county. Which mostly called FIPS Code",
        },
        year: {
          type: "integer",
          description:
            "The year for which to retrieve the county details. Current Year if not provided.",
        },
      },
      required: ["countyfips"],
    },
  },
  {
    name: "get_state_details_by_abbrev",
    description: "Retrieves the details of a state for an abbreviation.",
    parameters: {
      type: "object",
      properties: {
        state_abbr: {
          type: "string",
          description: "The abbreviation of the state.",
        },
        year: {
          type: "integer",
          description: "The year for which to retrieve the state details.",
        },
        apikey: {
          type: "string",
          description: "The API key for authentication.",
        },
      },
      required: ["state_abbr"],
    },
  },
  {
    name: "get_states_medicaid_by_abbrev",
    description:
      "Retrieves Medicaid details for a given state abbreviation, quarter, and year.",
    parameters: {
      type: "object",
      properties: {
        state_abbr: {
          type: "string",
          description: "The abbreviation of the state.",
        },
        quarter: {
          type: "integer",
          description: "The quarter of the year.",
        },
        year: {
          type: "integer",
          description: "The year for which to retrieve Medicaid details.",
        },
        apikey: {
          type: "string",
          description: "The API key for authentication.",
        },
      },
      required: ["state_abbr"],
    },
  },
  {
    name: "get_poverty_guidelines_by_state_abbrev",
    description:
      "Retrieves the poverty guidelines for a given state abbreviation and year.",
    parameters: {
      type: "object",
      properties: {
        state_abbr: {
          type: "string",
          description: "The abbreviation of the state.",
        },
        year: {
          type: "integer",
          description: "The year for which to retrieve the poverty guidelines.",
        },
        apikey: {
          type: "string",
          description: "The API key for authentication.",
        },
      },
      required: ["state_abbr"],
    },
  },
  {
    name: "get_rate_areas",
    description:
      "Retrieves the rate areas for a given year, market, ZIP code, FIPS code, and state.",
    parameters: {
      type: "object",
      properties: {
        year: {
          type: "integer",
          description: "The year for which to retrieve the rate areas.",
        },
        market: {
          type: "string",
          description:
            "The market type (e.g., 'Individual', 'SHOP', 'Any', '--').",
        },
        zipcode: {
          type: "string",
          description: "The ZIP code to retrieve rate areas for.",
        },
        fips: {
          type: "string",
          description: "The FIPS code of the county.",
        },
        state: {
          type: "string",
          description: "The state abbreviation.",
        },
        apikey: {
          type: "string",
          description: "The API key for authentication.",
        },
      },
      required: ["zipcode", "fips", "state"],
    },
  },
  {
    name: "drugs_autocomplete",
    description:
      "Retrieves autocomplete suggestions for drugs based on a query.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description:
            "The query string to search for drug names. first three character will be enough",
        },
        year: {
          type: "integer",
          description:
            "The year for which to retrieve the autocomplete results.",
        },
        apikey: {
          type: "string",
          description: "The API key for authentication.",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "drugs_search",
    description: "Searches for drugs based on a query string.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description:
            "The query string to search for drug names. Search by Name.",
        },
        year: {
          type: "integer",
          description:
            "The year for which to retrieve the search results. Mostly 2024",
        },
        apikey: {
          type: "string",
          description: "The API key for authentication.",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "drugs_covered",
    description:
      "Retrieves information about drugs covered by specific plans for a given year.",
    parameters: {
      type: "object",
      properties: {
        planids: {
          type: "string",
          description:
            "The IDs of the plans. the Array of IDs like 11512NC0100031",
        },
        drugs_rxcui: {
          type: "string",
          description: "The IDs of the drugs. e.g. RxCUIs, 1049589",
        },
        year: {
          type: "integer",
          description:
            "The year for which to retrieve the covered drugs information.",
        },
        apikey: {
          type: "string",
          description: "The API key for authentication.",
        },
      },
      required: ["planids", "drugs", "year", "apikey"],
    },
  },
  {
    name: "drugs_coverage_stats",
    description: "Retrieves coverage statistics.",
    parameters: {
      type: "object",
      properties: {
        apikey: {
          type: "string",
          description:
            "The API key for authentication. public one is d687412e7b53146b2631dc01974ad0a4",
        },
      },
      required: [],
    },
  },
  {
    name: "drugs_coverage_search",
    description:
      "Searches for coverage information based on ZIP code and query string.",
    parameters: {
      type: "object",
      properties: {
        zipcode: {
          type: "string",
          description: "The ZIP code to search for coverage information.",
        },
        query: {
          type: "string",
          description:
            "The query string to search for coverage information. e.g. Hospital etc",
        },
        apikey: {
          type: "string",
          description: "The API key for authentication.",
        },
      },
      required: ["zipcode", "query"],
    },
  },
  {
    name: "drugs_providers_autocomplete",
    description:
      "Retrieves autocomplete suggestions for providers based on type, ZIP code, and query string.",
    parameters: {
      type: "object",
      properties: {
        type: {
          type: "string",
          description:
            "The type of provider (e.g., 'Facility', 'Individual', 'Group').",
        },
        zipcode: {
          type: "string",
          description: "The ZIP code to search for providers.",
        },
        query: {
          type: "string",
          description: "The query string to search for providers.",
        },
        apikey: {
          type: "string",
          description: "The API key for authentication.",
        },
      },
      required: ["type", "zipcode", "query"],
    },
  },
  {
    name: "drugs_providers_search",
    description:
      "Searches for providers based on specialty, type, ZIP code, query string, and year.",
    parameters: {
      type: "object",
      properties: {
        specialty: {
          type: "string",
          description: "The specialty of the providers.",
        },
        type: {
          type: "string",
          description: "The type of provider (e.g., 'Facility', 'Individual').",
        },
        zipcode: {
          type: "string",
          description: "The ZIP code to search for providers.",
        },
        query: {
          type: "string",
          description:
            "The query string to search for providers. (e.g., Hospital, Clinic)",
        },
        year: {
          type: "integer",
          description:
            "The year for which to retrieve the provider information.",
        },
        apikey: {
          type: "string",
          description: "The API key for authentication.",
        },
      },
      required: ["specialty", "type", "zipcode", "query", "year", "apikey"],
    },
  },
  {
    name: "drugs_providers_covered",
    description:
      "Retrieves information about providers covered by specific plans for a given year.",
    parameters: {
      type: "object",
      properties: {
        year: {
          type: "integer",
          description:
            "The year for which to retrieve the covered providers information.",
        },
        planids: {
          type: "string",
          description:
            "The IDs of the plans. ID of Plans (e.g. '83761GA0040002')",
        },
        providerids: {
          type: "string",
          description:
            "The IDs of the providers. Array of NPIs (e.g. '1407884893')",
        },
        apikey: {
          type: "string",
          description: "The API key for authentication.",
        },
      },
      required: ["planids", "providerids"],
    },
  },
  {
    name: "households_eligibility_estimates",
    description:
      "Estimates the eligibility of a household for healthcare plans based on household details, market, and location.",
    parameters: {
      type: "object",
      properties: {
        income: {
          type: "number",
          description: "Household income. Mostly 40000+",
        },
        dob: {
          type: "string",
          format: "date",
          description: "Date of birth of the person.",
        },
        aptc_eligible: {
          type: "boolean",
          description: "Whether the person is eligible for APTC. Mostly True",
        },
        gender: {
          type: "string",
          description: "Gender of the person. (e.g., 'Male', 'Female')",
        },
        uses_tobacco: {
          type: "boolean",
          description: "Whether the person uses tobacco. Mostly False",
        },
        market: {
          type: "string",
          description: "Market type (e.g., 'Individual', 'Family').",
        },
        countyfips: {
          type: "string",
          description: "FIPS code of the county.",
        },
        state: {
          type: "string",
          description: "State abbreviation. Two Capital Letters. (e.g., 'CA')",
        },
        zipcode: {
          type: "string",
          description: "ZIP code. 5 digit zipcdoe. (e.g., '94107')",
        },
        household_year: {
          type: "integer",
          description:
            "Year of the details. Current year If not available or provided",
        },
        api_year: {
          type: "integer",
          description:
            "The year for which to retrieve the eligibility estimates. Current year if not availabe or provided",
        },
        apikey: {
          type: "string",
          description:
            "The API key for authentication. public one is d687412e7b53146b2631dc01974ad0a4 if not provided.",
        },
      },
      required: ["market", "countyfips", "state", "zipcode"],
    },
  },
  {
    name: "households_ichra",
    description:
      "Estimates the ICHRA eligibility of a household based on household details, market, location, and HRA.",
    parameters: {
      type: "object",
      properties: {
        income: {
          type: "number",
          description: "Household income. any number from 1000 to 90000",
        },
        dob: {
          type: "string",
          format: "date",
          description:
            "Date of birth of the person. 1992-01-01 if not provided.",
        },
        aptc_eligible: {
          type: "boolean",
          description:
            "Whether the person is eligible for APTC. True by default if not provided.",
        },
        gender: {
          type: "string",
          description: "Gender of the person. (e.g. 'Male', 'Female')",
        },
        uses_tobacco: {
          type: "boolean",
          description:
            "Whether the person uses tobacco. False if not provided.",
        },
        market: {
          type: "string",
          description: "Market type (e.g., 'Individual').",
        },
        countyfips: {
          type: "string",
          description: "FIPS code of the county.",
        },
        state: {
          type: "string",
          description: "State abbreviation.",
        },
        zipcode: {
          type: "string",
          description: "ZIP code.",
        },
        hra: {
          type: "number",
          description:
            "Health Reimbursement Arrangement amount. from 100 to 500",
        },
        household_year: {
          type: "integer",
          description: "Year of the details. Current year",
        },
        api_year: {
          type: "integer",
          description:
            "The year for which to retrieve the ICHRA eligibility estimates. Current Year",
        },
        apikey: {
          type: "string",
          description: "The API key for authentication. Current year",
        },
      },
      required: ["market", "countyfips", "state", "zipcode"],
    },
  },
  {
    name: "households_lcbp",
    description:
      "Estimates the LCBP eligibility of a household based on household details, market, and location.",
    parameters: {
      type: "object",
      properties: {
        income: {
          type: "number",
          description: "Household income. Start from 1000 to 90000",
        },
        dob: {
          type: "string",
          format: "date",
          description: "Date of birth of the person. 1992-01-01",
        },
        aptc_eligible: {
          type: "boolean",
          description:
            "Whether the person is eligible for APTC. True if not provided.",
        },
        gender: {
          type: "string",
          description: "Gender of the person. (e.g. 'Male', 'Female')",
        },
        uses_tobacco: {
          type: "boolean",
          description:
            "Whether the person uses tobacco. False if not provided.",
        },
        market: {
          type: "string",
          description: "Market type (e.g., 'Individual').",
        },
        countyfips: {
          type: "string",
          description: "FIPS code of the county.",
        },
        state: {
          type: "string",
          description: "State abbreviation.",
        },
        zipcode: {
          type: "string",
          description: "ZIP code.",
        },
        household_year: {
          type: "integer",
          description: "Year of the details. Current year if not provided.",
        },
        api_year: {
          type: "integer",
          description:
            "The year for which to retrieve the LCBP eligibility estimates. Current year if not provided.",
        },
        apikey: {
          type: "string",
          description: "The API key for authentication.",
        },
      },
      required: ["market", "countyfips", "state", "zipcode"],
    },
  },
  {
    name: "households_slcsp",
    description:
      "Estimates the Second Lowest Cost Silver Plan (SLCSP) eligibility of a household based on household details, market, and location.",
    parameters: {
      type: "object",
      properties: {
        income: {
          type: "number",
          description: "Household income.",
        },
        dob: {
          type: "string",
          format: "date",
          description: "Date of birth of the person.",
        },
        aptc_eligible: {
          type: "boolean",
          description: "Whether the person is eligible for APTC.",
        },
        gender: {
          type: "string",
          description: "Gender of the person.",
        },
        uses_tobacco: {
          type: "boolean",
          description: "Whether the person uses tobacco.",
        },
        market: {
          type: "string",
          description: "Market type (e.g., 'Individual').",
        },
        countyfips: {
          type: "string",
          description: "FIPS code of the county.",
        },
        state: {
          type: "string",
          description: "State abbreviation.",
        },
        zipcode: {
          type: "string",
          description: "ZIP code.",
        },
        household_year: {
          type: "integer",
          description: "Year of the details.",
        },
        api_year: {
          type: "integer",
          description:
            "The year for which to retrieve the SLCSP eligibility estimates.",
        },
        apikey: {
          type: "string",
          description: "The API key for authentication.",
        },
      },
      required: [
        "income",
        "dob",
        "aptc_eligible",
        "gender",
        "uses_tobacco",
        "market",
        "countyfips",
        "state",
        "zipcode",
        "household_year",
        "api_year",
        "apikey",
      ],
    },
  },
  {
    name: "households_lcsp",
    description:
      "Estimates the Lowest Cost Silver Plan (LCSP) eligibility of a household based on household details, market, and location.",
    parameters: {
      type: "object",
      properties: {
        income: {
          type: "number",
          description: "Household income. Varies from 1000 to 90000",
        },
        dob: {
          type: "string",
          format: "date",
          description:
            "Date of birth of the person. 1992-01-01 if not provided.",
        },
        aptc_eligible: {
          type: "boolean",
          description:
            "Whether the person is eligible for APTC. True if not provided.",
        },
        gender: {
          type: "string",
          description: "Gender of the person. (e.g. 'Male', 'Female')",
        },
        uses_tobacco: {
          type: "boolean",
          description:
            "Whether the person uses tobacco. False if not provided.",
        },
        market: {
          type: "string",
          description: "Market type (e.g., 'Individual').",
        },
        countyfips: {
          type: "string",
          description: "FIPS code of the county.",
        },
        state: {
          type: "string",
          description: "State abbreviation.",
        },
        zipcode: {
          type: "string",
          description: "ZIP code.",
        },
        household_year: {
          type: "integer",
          description: "Year of the details. Current year if not provided.",
        },
        api_year: {
          type: "integer",
          description:
            "The year for which to retrieve the LCSP eligibility estimates. Current year if not provided.",
        },
        apikey: {
          type: "string",
          description: "The API key for authentication.",
        },
      },
      required: ["market", "countyfips", "state", "zipcode"],
    },
  },
  {
    name: "households_pcfpl",
    description:
      "Retrieves the Percentage of Federal Poverty Level (PCFPL) for a household based on income, size, and state.",
    parameters: {
      type: "object",
      properties: {
        income: {
          type: "number",
          description: "Household income. from 1000 to 90000",
        },
        size: {
          type: "integer",
          description: "Size of the household. e.g. 1 to 5.",
        },
        state: {
          type: "string",
          description: "State abbreviation.",
        },
        year: {
          type: "integer",
          description:
            "The year for which to retrieve the PCFPL. Current Year if not provided.",
        },
        apikey: {
          type: "string",
          description: "The API key for authentication.",
        },
      },
      required: ["income", "size", "state"],
    },
  },
  {
    name: "last_year_plans_crosswalk",
    description:
      "Retrieves the crosswalk information for last year's plans based on FIPS code, ZIP code, state, plan ID, and year.",
    parameters: {
      type: "object",
      properties: {
        fips: {
          type: "string",
          description: "The FIPS code of the county.",
        },
        zipcode: {
          type: "string",
          description: "The ZIP code.",
        },
        state: {
          type: "string",
          description: "State abbreviation.",
        },
        plan_id: {
          type: "string",
          description: "The plan ID. array of Plans IDs (e.g., 53882IL0040002)",
        },
        year: {
          type: "integer",
          description:
            "The year for which to retrieve the crosswalk information. current year if not provided.",
        },
        apikey: {
          type: "string",
          description: "The API key for authentication.",
        },
      },
      required: ["fips", "zipcode", "state", "plan_id"],
    },
  },
  {
    name: "plans_search_stats",
    description:
      "Retrieves statistics for plan search based on household details, market, and location.",
    parameters: {
      type: "object",
      properties: {
        income: {
          type: "number",
          description: "Household income. From 1000 to 90000",
        },
        dob: {
          type: "string",
          format: "date",
          description: "Date of birth of the person. 1992-01-01",
        },
        aptc_eligible: {
          type: "boolean",
          description:
            "Whether the person is eligible for APTC. True if not provided",
        },
        gender: {
          type: "string",
          description: "Gender of the person.",
        },
        uses_tobacco: {
          type: "boolean",
          description: "Whether the person uses tobacco. False if not provided",
        },
        market: {
          type: "string",
          description: "Market type (e.g., 'Individual').",
        },
        countyfips: {
          type: "string",
          description: "FIPS code of the county.",
        },
        state: {
          type: "string",
          description: "State abbreviation.",
        },
        zipcode: {
          type: "string",
          description: "ZIP code.",
        },
        household_year: {
          type: "integer",
          description: "Year of the details. Current year if not provided",
        },
        api_year: {
          type: "integer",
          description:
            "The year for which to retrieve the plan search statistics. Current year if not provided",
        },
        apikey: {
          type: "string",
          description: "The API key for authentication.",
        },
      },
      required: ["market", "countyfips", "state", "zipcode"],
    },
  },
  {
    name: "get_plans_by_planID",
    description:
      "Retrieves the details of a plan based on its plan ID and year.",
    parameters: {
      type: "object",
      properties: {
        plan_id: {
          type: "string",
          description: "The ID of the plan.",
        },
        year: {
          type: "integer",
          description: "The year for which to retrieve the plan details.",
        },
        apikey: {
          type: "string",
          description: "The API key for authentication.",
        },
      },
      required: ["plan_id", "year"],
    },
  },
  {
    name: "plans_quality_ratings_by_planID",
    description:
      "Retrieves the quality ratings of a plan based on its plan ID and year.",
    parameters: {
      type: "object",
      properties: {
        plan_id: {
          type: "string",
          description: "The ID of the plan. (e.g., 95185VA0530001)",
        },
        year: {
          type: "integer",
          description:
            "The year for which to retrieve the plan quality ratings. Current year if not provided.",
        },
        apikey: {
          type: "string",
          description: "The API key for authentication.",
        },
      },
      required: ["plan_id"],
    },
  },
  {
    name: "list_issuers",
    description: "Lists issuers based on offset, limit, state, and year.",
    parameters: {
      type: "object",
      properties: {
        offset: {
          type: "integer",
          description: "The offset for pagination.",
        },
        limit: {
          type: "integer",
          description:
            "The limit for the number of results. (e.g. 0 if not provided)",
        },
        state: {
          type: "string",
          description: "The state abbreviation. Two digit State",
        },
        year: {
          type: "integer",
          description:
            "The year for which to list the issuers. Current year if not provided.",
        },
        apikey: {
          type: "string",
          description: "The API key for authentication.",
        },
      },
      required: ["state"],
    },
  },
  {
    name: "get_issuer_by_issuersID",
    description: "Retrieves the details of an issuer based on its ID and year.",
    parameters: {
      type: "object",
      properties: {
        issuer_id: {
          type: "string",
          description:
            "The ID of the issuer. 5-digit HIOS issuer ID (e.g. 10191)",
        },
        year: {
          type: "integer",
          description:
            "The year for which to retrieve the issuer details. Current year if not provided",
        },
        apikey: {
          type: "string",
          description: "The API key for authentication.",
        },
      },
      required: ["issuer_id"],
    },
  },
  {
    name: "enrollment_validation",
    description: "Validates an enrollment based on provided details.",
    parameters: {
      type: "object",
      properties: {
        max_aptc: {
          type: "number",
          description: "Maximum APTC.",
        },
        year: {
          type: "integer",
          description: "The year for the enrollment validation.",
        },
        is_custom: {
          type: "boolean",
          description: "Indicates if the enrollment is custom.",
        },
        division: {
          type: "string",
          description: "The division of the enrollment.",
        },
        enrollment_groups: {
          type: "array",
          description: "Details of the enrollment groups.",
          items: {
            type: "object",
            properties: {
              id: {
                type: "string",
                description: "The ID of the enrollment group.",
              },
              effective_date: {
                type: "string",
                format: "date",
                description: "The effective date of the enrollment group.",
              },
              csr: {
                type: "string",
                description: "The CSR of the enrollment group.",
              },
              enrollees: {
                type: "array",
                description: "List of enrollees.",
                items: {
                  type: "string",
                },
              },
              subscriber_id: {
                type: "string",
                description: "The subscriber ID.",
              },
              relationships: {
                type: "array",
                description: "Relationships within the enrollment group.",
                items: {
                  type: "object",
                  properties: {
                    super_id: {
                      type: "string",
                      description: "The super ID in the relationship.",
                    },
                    sub_id: {
                      type: "string",
                      description: "The sub ID in the relationship.",
                    },
                    relationship: {
                      type: "string",
                      description: "The relationship type.",
                    },
                  },
                },
              },
            },
          },
        },
        enrollees: {
          type: "array",
          description: "Details of the enrollees.",
          items: {
            type: "object",
            properties: {
              id: {
                type: "string",
                description: "The ID of the enrollee.",
              },
              name: {
                type: "string",
                description: "The name of the enrollee.",
              },
              gender: {
                type: "string",
                description: "The gender of the enrollee.",
              },
              dob: {
                type: "string",
                format: "date",
                description: "The date of birth of the enrollee.",
              },
              location: {
                type: "object",
                description: "The location of the enrollee.",
                properties: {
                  city: {
                    type: "string",
                    description: "The city of the enrollee.",
                  },
                  state: {
                    type: "string",
                    description: "The state of the enrollee.",
                  },
                  street_1: {
                    type: "string",
                    description: "Street address 1.",
                  },
                  street_2: {
                    type: "string",
                    description: "Street address 2.",
                  },
                  zipcode: {
                    type: "string",
                    description: "The ZIP code.",
                  },
                  countyfips: {
                    type: "string",
                    description: "The county FIPS code.",
                  },
                },
              },
              csr: {
                type: "string",
                description: "The CSR of the enrollee.",
              },
              is_filer: {
                type: "boolean",
                description: "Indicates if the enrollee is a filer.",
              },
              has_hardship: {
                type: "boolean",
                description: "Indicates if the enrollee has a hardship.",
              },
              relationship: {
                type: "string",
                description: "The relationship of the enrollee.",
              },
              allowed_metal_levels: {
                type: "array",
                description: "Allowed metal levels for the enrollee.",
                items: {
                  type: "string",
                },
              },
              allowed_plan_ids: {
                type: "array",
                description: "Allowed plan IDs for the enrollee.",
                items: {
                  type: "string",
                },
              },
              current_enrollment: {
                type: "object",
                description: "Current enrollment details.",
                properties: {
                  plan_id: {
                    type: "string",
                    description: "The current plan ID.",
                  },
                  effective_date: {
                    type: "string",
                    format: "date",
                    description:
                      "The effective date of the current enrollment.",
                  },
                  is_smoker: {
                    type: "boolean",
                    description: "Indicates if the enrollee is a smoker.",
                  },
                },
              },
            },
          },
        },
        apikey: {
          type: "string",
          description: "The API key for authentication.",
        },
      },
      required: [
        "max_aptc",
        "is_custom",
        "division",
        "enrollment_groups",
        "enrollees",
      ],
    },
  },
  {
    name: "api_version",
    description: "Retrieves the API versions available.",
    parameters: {
      type: "object",
      properties: {
        apikey: {
          type: "string",
          description: "The API key for authentication.",
        },
      },
      required: [],
    },
  },
  {
    name: "market_years",
    description: "Retrieves the available market years.",
    parameters: {
      type: "object",
      properties: {
        apikey: {
          type: "string",
          description: "The API key for authentication.",
        },
      },
      required: [],
    },
  },
  {
    name: "bulk_data_apt",
    description:
      "Retrieves bulk data for Advanced Premium Tax (APT) for a given year.",
    parameters: {
      type: "object",
      properties: {
        year: {
          type: "integer",
          description:
            "The year for which to retrieve the bulk data. Current year if not provided.",
        },
        apikey: {
          type: "string",
          description: "The API key for authentication.",
        },
      },
      required: [],
    },
  },
  {
    name: "data_decile_mapping",
    description: "Retrieves decile mapping data for a given year.",
    parameters: {
      type: "object",
      properties: {
        year: {
          type: "integer",
          description:
            "The year for which to retrieve the decile mapping data. Current year if not provided.",
        },
        apikey: {
          type: "string",
          description: "The API key for authentication.",
        },
      },
      required: [],
    },
  },
  {
    name: "data_state_medicaid",
    description: "Retrieves state Medicaid data for a given year.",
    parameters: {
      type: "object",
      properties: {
        year: {
          type: "integer",
          description:
            "The year for which to retrieve the state Medicaid data.",
        },
        apikey: {
          type: "string",
          description: "The API key for authentication.",
        },
      },
      required: [],
    },
  },
  {
    name: "bulk_data_rate_areas",
    description: "Retrieves bulk data for rate areas for a given year.",
    parameters: {
      type: "object",
      properties: {
        year: {
          type: "integer",
          description:
            "The year for which to retrieve the bulk data. Current Year if not provided.",
        },
        apikey: {
          type: "string",
          description: "The API key for authentication.",
        },
      },
      required: [],
    },
  },
  {
    name: "bulk_county_zips",
    description: "Retrieves bulk data for county ZIPs for a given year.",
    parameters: {
      type: "object",
      properties: {
        year: {
          type: "integer",
          description: "The year for which to retrieve the bulk data.",
        },
        apikey: {
          type: "string",
          description: "The API key for authentication.",
        },
      },
      required: [],
    },
  },
  {
    name: "bulk_data_crosswalk",
    description: "Retrieves bulk data for crosswalk for a given year.",
    parameters: {
      type: "object",
      properties: {
        year: {
          type: "integer",
          description: "The year for which to retrieve the bulk data.",
        },
        apikey: {
          type: "string",
          description: "The API key for authentication.",
        },
      },
      required: [],
    },
  },
  {
    name: "plans_with_premiums",
    description:
      "Retrieves plan details along with premiums based on provided household details, market, and location.",
    parameters: {
      type: "object",
      properties: {
        plan_id: {
          type: "string",
          description: "The ID of the plan.",
        },
        income: {
          type: "number",
          description: "Household income. varies fro 1000 to 90000",
        },
        age: {
          type: "integer",
          description: "Age of the person.",
        },
        aptc_eligible: {
          type: "boolean",
          description:
            "Whether the person is eligible for APTC. True if not provided.",
        },
        gender: {
          type: "string",
          description: "Gender of the person. (e.g. 'Male', 'Female')",
        },
        uses_tobacco: {
          type: "boolean",
          description: "Whether the person uses tobacco. False if not provided",
        },
        market: {
          type: "string",
          description: "Market type (e.g., 'Individual').",
        },
        countyfips: {
          type: "string",
          description: "FIPS code of the county.",
        },
        state: {
          type: "string",
          description: "State abbreviation.",
        },
        zipcode: {
          type: "string",
          description: "ZIP code.",
        },
        year: {
          type: "integer",
          description: "The year for the plan. curret if not provided",
        },
        apikey: {
          type: "string",
          description: "The API key for authentication.",
        },
      },
      required: ["plan_id", "market", "countyfips", "state", "zipcode"],
    },
  },
];
