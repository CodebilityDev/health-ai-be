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
    input: z.object({
      groupID: z.string(),
    }),
    resolve: async (_, { groupID }, context) => {
      if (!context.session) {
        throw new Error("Unauthorized");
      }

      // check if the user has access to the group
      const group = await context.prisma.group.findFirst({
        where: {
          id: groupID,
          members: {
            some: {
              userId: context.session.itemId,
            },
          },
        },
      });

      if (!group) {
        throw new Error("Unauthorized");
      }

      const accessToken = await getAccessToken({
        prismaClient: context.prisma,
        groupID,
      });

      return accessToken;
    },
  }),
);

ghAPIGqlDeclaration.add(
  new GraphqlActionMetadata({
    root: "Query",
    name: "ghl_me",
    input: z.object({
      groupID: z.string(),
    }),
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
          business: z.object({
            name: z.string(),
            address: z.string(),
            city: z.string(),
            state: z.string(),
            country: z.string(),
            postalCode: z.string(),
            website: z.string(),
            timezone: z.string(),
            logoUrl: z.string(),
          }),
        }),
      },
    ],
    resolve: async (_, { groupID }, context) => {
      if (!context.session) {
        throw new Error("Unauthorized");
      }

      // check if the user has access to the group
      const group = await context.prisma.group.findFirst({
        where: {
          id: groupID,
          members: {
            some: {
              userId: context.session.itemId,
            },
          },
        },
      });

      if (!group) {
        throw new Error("Unauthorized");
      }

      const userInfo = await getGHLMe({
        context,
        groupID,
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
        business: userInfo.business,
      };
    },
  }),
);

export { ghAPIGqlDeclaration };
