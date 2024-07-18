import { z } from "zod";
import {
  GraphqlActionMetadata,
  GraphqlMethodDeclarationList,
} from "~/lib/graphql/declarations";
import { getGHLMe } from "./service/getGHLMe";
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

      const userInfo = await getGHLMe({
        context,
        userID,
      });

      if (!userInfo) {
        throw new Error("No Account Found");
      }

      // console.log(userInfo);

      return {
        name: `${userInfo.firstName} ${userInfo.lastName}`,
        email: userInfo.email,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        phone: userInfo.phone,
        address: userInfo.address,
        state: userInfo.state,
        country: userInfo.country,
        postalCode: userInfo.postalCode,
      };
    },
  }),
);

export { ghAPIGqlDeclaration };
