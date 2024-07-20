import { GlobalContext } from "~/common/context";
import { getAccessToken } from "./getGHLToken";

interface CustomField {
  id: string;
  value: string;
}

interface Attribution {
  url: string;
  campaign: string;
  utmSource: string;
  utmMedium: string;
  utmContent: string;
  referrer: string;
  campaignId: string;
  fbclid: string;
  gclid: string;
  msclikid: string;
  dclid: string;
  fbc: string;
  fbp: string;
  fbEventId: string;
  userAgent: string;
  ip: string;
  medium: string;
  mediumId: string;
}

interface Contact {
  id: string;
  locationId: string;
  email: string;
  timezone: string;
  country: string;
  source: string;
  dateAdded: string;
  contactName: string;
  firstName: string;
  lastName: string;
  customFields: CustomField[];
  tags: string[];
  businessId: string;
  attributions: Attribution[];
  followers: string;
}

interface ContactsResponse {
  contacts: Contact[];
  count: number;
}

export const getGHLContacts = async (args: {
  context: GlobalContext;
  userID: string;
  query?: string;
}): Promise<Contact[]> => {
  const accessToken = await getAccessToken({
    prismaClient: args.context.prisma,
    userID: args.userID,
  });

  const resp = await fetch(
    `https://services.leadconnectorhq.com/contacts/?locationId=${accessToken?.locationId}` +
      (args.query ? `&query=${args.query}` : ""),
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken?.accessToken}`,
        Accept: "application/json",
        Version: "2021-04-15",
      },
    },
  );

  const data = await resp.json();

  // console.log(JSON.stringify(data));

  return data.contacts;
};
