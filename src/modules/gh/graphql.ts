import { z } from "zod";
import {
  GraphqlActionMetadata,
  GraphqlMethodDeclarationList,
} from "~/lib/graphql/declarations";
import { getAccessToken } from "./service/getGHLToken";

const ghAPIGqlDeclaration = new GraphqlMethodDeclarationList();

ghAPIGqlDeclaration.add(
  new GraphqlActionMetadata({
    root: "Query",
    name: "ghl_accessToken",
    output: "String",
    resolve: async (_, {}, context) => {
      if (!context.session) {
        throw new Error("Unauthorized");
      }

      const userID = context.session.itemId;

      const accessToken = await getAccessToken({
        prismaClient: context.prisma,
        userID,
      });

      return accessToken;
    },
  }),
);

ghAPIGqlDeclaration.add(
  new GraphqlActionMetadata({
    root: "Query",
    name: "ghl_me",
    output: [
      {
        name: "GHLMeReturn",
        isMain: true,
        schema: z.object({
          name: z.string(),
          email: z.string(),
          firstName: z.string(),
          lastName: z.string(),
          phone: z.string(),
          address: z.string(),
          state: z.string(),
          country: z.string(),
          postalCode: z.string(),
        }),
      },
    ],
    resolve: async (_, {}, context) => {
      if (!context.session) {
        throw new Error("Unauthorized");
      }

      const userID = context.session.itemId;

      const accessToken = await getAccessToken({
        prismaClient: context.prisma,
        userID,
      });

      const resp = await fetch(
        `https://services.leadconnectorhq.com/locations/${accessToken?.locationId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken?.accessToken}`,
            Version: "2021-07-28",
            Accept: "application/json",
          },
        },
      );

      const data = await resp.json();
      // console.log(data);

      return {
        name: data.location.name,
        email: data.location.email,
        firstName: data.location.firstName,
        lastName: data.location.lastName,
        phone: data.location.phone,
        address: data.location.address,
        state: data.location.state,
        country: data.location.country,
        postalCode: data.location.postalCode,
      };
    },
  }),
);

export { ghAPIGqlDeclaration };
