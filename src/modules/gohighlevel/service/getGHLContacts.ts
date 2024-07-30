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
  groupID: string;
  query?: string;
}): Promise<Contact[]> => {
  const accessToken = await getAccessToken({
    prismaClient: args.context.prisma,
    groupID: args.groupID,
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

export type LeadContact = {
  id: string;
  name: string;
  locationId: string;
  firstName: string;
  lastName: string;
  email: string;
  emailLowerCase: string;
  timezone: string;
  companyName: string;
  phone: string;
  dnd: boolean;
  dndSettings: {
    Call: DndSetting;
    Email: DndSetting;
    SMS: DndSetting;
    WhatsApp: DndSetting;
    GMB: DndSetting;
    FB: DndSetting;
  };
  type: string;
  source: string;
  assignedTo: string;
  address1: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  website: string;
  tags: string[];
  dateOfBirth: string;
  dateAdded: string;
  dateUpdated: string;
  attachments: string;
  ssn: string;
  gender: string;
  keyword: string;
  firstNameLowerCase: string;
  fullNameLowerCase: string;
  lastNameLowerCase: string;
  lastActivity: string;
  customFields: CustomField[];
  businessId: string;
  attributionSource: AttributionSource;
  lastAttributionSource: AttributionSource;
};

type DndSetting = {
  status: string;
  message: string;
  code: string;
};

type AttributionSource = {
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
};

export const getGHLContact = async (args: {
  context: GlobalContext;
  groupID: string;
  contactID: string;
}): Promise<LeadContact> => {
  const accessToken = await getAccessToken({
    prismaClient: args.context.prisma,
    groupID: args.groupID,
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
