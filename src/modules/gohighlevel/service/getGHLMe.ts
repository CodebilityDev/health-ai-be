import { GlobalContext } from "~/common/context";
import { getAccessToken } from "./getGHLToken";

export interface GetGHLMe {
  id: string;
  companyId: string;
  name: string;
  domain: string;
  address: string;
  city: string;
  state: string;
  logoUrl: string;
  country: string;
  postalCode: string;
  website: string;
  timezone: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  business: Business;
  social: Social;
  settings: Settings;
  reseller: Reseller;
}

interface Business {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  website: string;
  timezone: string;
  logoUrl: string;
}

interface Social {
  facebookUrl: string;
  googlePlus: string;
  linkedIn: string;
  foursquare: string;
  twitter: string;
  yelp: string;
  instagram: string;
  youtube: string;
  pinterest: string;
  blogRss: string;
  googlePlacesId: string;
}

interface Settings {
  allowDuplicateContact: boolean;
  allowDuplicateOpportunity: boolean;
  allowFacebookNameMerge: boolean;
  disableContactTimezone: boolean;
}

interface Reseller {}

export const getGHLMe = async (args: {
  context: GlobalContext;
  userID: string;
}): Promise<GetGHLMe> => {
  const accessToken = await getAccessToken({
    prismaClient: args.context.prisma,
    userID: args.userID,
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

  return data.location;
};
