import { z } from "zod";
import { ACCESS_LEVELS } from "~/common/context";
import { CONFIG } from "~/common/env";
import { serverAccessConfig } from "~/lib/rest/access";
import { RestAccessTemplate } from "~/lib/rest/access/templates";
import {
  RouteDeclarationList,
  RouteDeclarationMetadata,
} from "~/lib/rest/declarations";
import { RequestInputType, RouteMethod } from "~/lib/rest/types";
import { base64 } from "~/services/base64";
import { getGHLMe } from "./service/getGHLMe";
import { AccessTokenList } from "./service/getGHLToken";

const ghlRouteDeclaration = new RouteDeclarationList({
  path: "/ghapi",
});

ghlRouteDeclaration.routes.set(
  "/auth/signin",
  new RouteDeclarationMetadata({
    method: RouteMethod.GET,
    accessConfig: serverAccessConfig({
      conditions: [RestAccessTemplate.isLoggedIn],
    }),
    inputParser: z.object({
      [RequestInputType.QUERY]: z.object({
        redirect: z.string().optional(),
      }),
    }),
    func: async ({
      res,
      context,
      inputData: {
        query: { redirect },
      },
    }) => {
      // check if userid is valid
      const user = await context.prisma.user.findFirst({
        where: { id: context.session?.itemId },
      });

      if (!user) {
        res.status(400).json({ error: "Invalid user" });
        return;
      }

      const url = new URL(
        "https://marketplace.leadconnectorhq.com/oauth/chooselocation",
      );
      url.searchParams.append("client_id", CONFIG.GHL_CLIENTID);
      url.searchParams.append("redirect_uri", CONFIG.GHL_REDIRECT_URI);
      url.searchParams.append("response_type", "code");
      url.searchParams.append(
        "scope",
        "conversations/message.write conversations/message.readonly conversations.readonly conversations/reports.readonly users.readonly users.write locations.readonly contacts.readonly contacts.write locations/customValues.write locations/customValues.readonly locations/customFields.readonly locations/customFields.write",
      );
      url.searchParams.append(
        "state",
        base64.encode(
          JSON.stringify({
            userId: context.session?.itemId,
            redirect,
          }),
        ) || "",
      );

      return {
        url: url.toString(),
      };
    },
  }),
);

ghlRouteDeclaration.routes.set(
  "/auth/callback",
  new RouteDeclarationMetadata({
    method: RouteMethod.GET,
    inputParser: z.object({
      [RequestInputType.QUERY]: z.object({
        code: z.string(),
        state: z.string(),
      }),
    }),

    func: async ({
      context,
      inputData: {
        [RequestInputType.QUERY]: { code, state },
      },
      res,
    }) => {
      if (!code) {
        res.status(400).json({ error: "Invalid code" });
        return;
      }

      const encodedParams = new URLSearchParams();
      encodedParams.set("client_id", CONFIG.GHL_CLIENTID);
      encodedParams.set("client_secret", CONFIG.GHL_CLIENTSECRET);
      encodedParams.set("grant_type", "authorization_code");
      encodedParams.set("code", code);
      encodedParams.set("redirect_uri", CONFIG.GHL_REDIRECT_URI);

      const url = "https://services.leadconnectorhq.com/oauth/token";
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: encodedParams,
      };

      // console.log({ url, options });

      const response = await fetch(url, options);

      const data = (await response.json()) as {
        access_token: string;
        token_type: "Bearer";
        expires_in: number;
        refresh_token: string;
        scope: string;
        userType: string;
        locationId: string;
        companyId: string;
        approvedLocations: string[];
        userId: string;
        planId: string;
      };

      if (!data.locationId) {
        res.status(400).json({ error: "Invalid location" });
        return;
      }

      const decodedState = base64.decode(state);
      const { userId, redirect } = JSON.parse(decodedState);

      // check if locationID already has a group assigned to it, if it has, just update it and add the user to the group if not already added

      let groupData;

      groupData = await context.prisma.group.findFirst({
        where: {
          id: data.locationId,
        },
        include: {
          ghlAccess: true,
        },
      });

      // if group dont exist, create it

      if (!groupData) {
        groupData = await context.prisma.group.create({
          data: {
            id: data.locationId,
            name: data.locationId,
          },
          include: {
            ghlAccess: true,
          },
        });
      }

      // bind the user to the group if not already bound
      const userGroup = await context.prisma.groupMember.findFirst({
        where: {
          groupId: data.locationId,
          userId: userId,
        },
      });

      if (!userGroup) {
        await context.prisma.groupMember.create({
          data: {
            group: { connect: { id: data.locationId } },
            user: { connect: { id: userId } },
            access: ACCESS_LEVELS.ADMIN,
          },
        });
      }

      let ghlAccessID = groupData.ghlAccess?.id;

      // if groupData doesnt have ghl binding, create it
      if (!ghlAccessID) {
        await context.prisma.gHLAccess.create({
          data: {
            id: data.locationId,
            refreshToken: data.refresh_token,
            scope: data.scope,
            companyId: data.companyId,
            ghsUserId: data.userId,
            locationId: data.locationId,
            planId: data.planId,
            group: { connect: { id: data.locationId } },
            updatedAt: new Date(),
          },
        });
      } else {
        await context.prisma.gHLAccess.update({
          where: { id: ghlAccessID },
          data: {
            refreshToken: data.refresh_token,
            scope: data.scope,
            companyId: data.companyId,
            ghsUserId: data.userId,
            locationId: data.locationId,
            planId: data.planId,
            updatedAt: new Date(),
          },
        });
      }

      // update name of the group
      const userInfo = await getGHLMe({
        context: context,
        groupID: data.locationId,
      });

      if (userInfo) {
        await context.prisma.group.update({
          where: { id: data.locationId },
          data: {
            name: userInfo.business.name,
          },
        });
      }

      // clear cache
      AccessTokenList[data.locationId] = null;

      res.redirect(redirect || CONFIG.PAGE_URL);
      // return data;
    },
  }),
);

export { ghlRouteDeclaration };
