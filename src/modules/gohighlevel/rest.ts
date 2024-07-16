import { z } from "zod";
import { CONFIG } from "~/common/env";
import { serverAccessConfig } from "~/lib/rest/access";
import { RestAccessTemplate } from "~/lib/rest/access/templates";
import {
  RouteDeclarationList,
  RouteDeclarationMetadata,
} from "~/lib/rest/declarations";
import { RequestInputType, RouteMethod } from "~/lib/rest/types";
import { base64 } from "~/services/base64";
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
        "conversations/message.readonly conversations/message.write users.readonly users.write locations.readonly contacts.readonly contacts.write",
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
      context: { prisma },
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

      const decodedState = base64.decode(state);
      const { userId, redirect } = JSON.parse(decodedState);

      // console.log("userId", userId);

      // if a user is already connected, update the token
      const existing = await prisma.gHLAccess.findFirst({
        where: { userId: userId },
      });

      if (existing) {
        await prisma.gHLAccess.update({
          where: { id: existing.id },
          data: {
            refreshToken: data.refresh_token,
            scope: data.scope,
            companyId: data.companyId,
            ghsUserId: data.userId,
            locationId: data.locationId,
            planId: data.planId,
          },
        });
      } else {
        await prisma.gHLAccess.create({
          data: {
            refreshToken: data.refresh_token,
            scope: data.scope,
            companyId: data.companyId,
            ghsUserId: data.userId,
            locationId: data.locationId,
            planId: data.planId,
            user: { connect: { id: userId } },
          },
        });
      }

      // clear cache
      AccessTokenList[userId] = null;

      res.redirect(redirect || CONFIG.PAGE_URL);
      // return data;
    },
  }),
);

export { ghlRouteDeclaration };
