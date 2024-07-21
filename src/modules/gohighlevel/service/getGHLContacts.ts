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

type LeadContactCustomField = {
  id: string;
  value: any; // Assuming the value can be of any type, replace with appropriate type if known
};

type LeadContact = {
  id: string;
  country: string;
  type: string;
  locationId: string;
  attributionSource: {
    sessionSource: string;
    mediumId: string | null;
    medium: string;
  };
  lastNameLowerCase: string;
  emailLowerCase: string;
  email: string;
  lastName: string;
  dateAdded: string;
  phone: string;
  timezone: string;
  city: string;
  address1: string;
  dateOfBirth: string;
  attachments: any[]; // Assuming the attachments are of type any[], replace with appropriate type if known
  tags: string[];
  state: string;
  additionalPhones: any[]; // Assuming the additionalPhones are of type any[], replace with appropriate type if known
  postalCode: string;
  fullNameLowerCase: string;
  firstName: string;
  firstNameLowerCase: string;
  dateUpdated: string;
  customFields: LeadContactCustomField[];
  additionalEmails: any[]; // Assuming the additionalEmails are of type any[], replace with appropriate type if known
};

export const getGHLContact = async (args: {
  context: GlobalContext;
  userID: string;
  contactID: string;
}): Promise<LeadContact> => {
  const accessToken = await getAccessToken({
    prismaClient: args.context.prisma,
    userID: args.userID,
  });

  const resp = await fetch(
    `https://services.leadconnectorhq.com/contacts/${args.contactID}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken?.accessToken}`,
        Accept: "application/json",
        Version: "2021-07-28",
      },
    },
  );

  const data = await resp.json();

  // console.log(JSON.stringify(data));

  // for all of customFIelds, we need to convert the value to string
  data.contact.customFields = data.contact.customFields.map(
    (field: LeadContact["customFields"][0]) => ({
      ...field,
      value: field.value.toString(),
    }),
  );

  return data.contact;
};
