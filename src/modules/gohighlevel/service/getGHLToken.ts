import { GlobalContext } from "~/common/context";
import { CONFIG } from "~/common/env";

export const AccessTokenList: Record<
  string,
  {
    accessToken: string;
    locationId: string;
    companyId: string;
    userId: string;
    expiresAt: number;
    scope: string;
  } | null
> = {};

export const getAccessToken = async (args: {
  prismaClient: GlobalContext["prisma"];
  groupID: string;
}) => {
  const { prismaClient, groupID } = args;

  if (AccessTokenList[groupID]) {
    const accessToken = AccessTokenList[groupID];
    if (accessToken.expiresAt > Date.now()) {
      return accessToken;
    }
  }

  const user = await prismaClient.group.findUnique({
    where: {
      id: groupID,
    },
    include: {
      ghlAccess: true,
    },
  });

  if (!user) {
    return null;
  }

  const ghsToken = user.ghlAccess;

  if (!ghsToken) {
    return null;
  }

  const encodedParams = new URLSearchParams();
  encodedParams.set("client_id", CONFIG.GHL_CLIENTID);
  encodedParams.set("client_secret", CONFIG.GHL_CLIENTSECRET);
  encodedParams.set("grant_type", "refresh_token");
  encodedParams.set("refresh_token", ghsToken.refreshToken);

  const url = "https://services.leadconnectorhq.com/oauth/token";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: encodedParams,
  };

  try {
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

    AccessTokenList[groupID] = {
      accessToken: data.access_token,
      locationId: data.locationId,
      companyId: data.companyId,
      userId: data.userId,
      scope: data.scope,
      expiresAt: Date.now() + data.expires_in * 1000,
    };

    return AccessTokenList[groupID];
  } catch (error) {
    console.error(error);
    return null;
  }
};
