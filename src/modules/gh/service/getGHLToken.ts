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
  } | null
> = {};

export const getAccessToken = async (args: {
  prismaClient: GlobalContext["prisma"];
  userID: string;
}) => {
  const { prismaClient, userID } = args;

  if (AccessTokenList[userID]) {
    const accessToken = AccessTokenList[userID];
    if (accessToken.expiresAt > Date.now()) {
      return accessToken;
    }
  }

  const user = await prismaClient.user.findUnique({
    where: {
      id: userID,
    },
    include: {
      ghlAccess: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const ghsToken = user.ghlAccess;

  if (!ghsToken) {
    throw new Error("No token found");
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

    AccessTokenList[userID] = {
      accessToken: data.access_token,
      locationId: data.locationId,
      companyId: data.companyId,
      userId: data.userId,
      expiresAt: Date.now() + data.expires_in * 1000,
    };

    return AccessTokenList[userID];
  } catch (error) {
    console.error(error);
  }
};
