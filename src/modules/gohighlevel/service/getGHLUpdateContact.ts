import { GlobalContext } from "~/common/context";
import { LeadContact } from "./getGHLContacts";
import { getAccessToken } from "./getGHLToken";

type DndSetting = {
  status: string;
  message: string;
  code: string;
};

type InboundDndSetting = {
  all: object;
};

type CustomField = {
  id?: string;
  key?: string;
  field_value: string;
};

export type UpdateContact = {
  firstName?: string | null;
  lastName?: string | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  address1?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string;
  website?: string | null;
  timezone?: string | null;
  dnd?: boolean;
  dndSettings?: {
    Call?: DndSetting;
    Email?: DndSetting;
    SMS?: DndSetting;
    WhatsApp?: DndSetting;
    GMB?: DndSetting;
    FB?: DndSetting;
  };
  inboundDndSettings?: {
    all?: InboundDndSetting;
  };
  tags?: string[];
  customFields?: CustomField[];
  source?: string | null;
  country?: string;
};

export const getGHLContactUpdate = async (args: {
  context: GlobalContext;
  groupID: string;
  contactId: string;
  updateData: UpdateContact;
}): Promise<LeadContact> => {
  const accessToken = await getAccessToken({
    prismaClient: args.context.prisma,
    groupID: args.groupID,
  });

  // console.log(accessToken);
  // console.log("id", args.contactId);

  const resp = await fetch(
    `https://services.leadconnectorhq.com/contacts/${args.contactId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken?.accessToken}`,
        "Content-Type": "application/json",
        Version: "2021-07-28",
      },
      body: JSON.stringify(args.updateData),
    },
  );

  const data = await resp.json();

  // console.log(JSON.stringify(args.updateData));
  // console.log(JSON.stringify(data));

  return data.contact;
};
