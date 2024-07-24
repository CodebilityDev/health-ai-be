import { GlobalContext } from "~/common/context";
import { getAccessToken } from "./getGHLToken";

export type ConversationData = {
  id: string;
  locationId: string;
  dateAdded: number;
  dateUpdated: number;
  lastMessageDate: number;
  lastMessageType: string;
  lastMessageBody: string;
  lastOutboundMessageAction: string;
  lastMessageDirection: string;
  inbox: boolean;
  unreadCount: number;
  lastManualMessageDate: number;
  contactId: string;
  fullName: string;
  contactName: string;
  email: string;
  phone: string;
  tags: string[];
  type: string;
  scoring: any[];
  sort: number[];
};

export const getGHLConversations = async (args: {
  context: GlobalContext;
  groupID: string;
  contactID: string;
}): Promise<ConversationData[]> => {
  const accessToken = await getAccessToken({
    prismaClient: args.context.prisma,
    groupID: args.groupID,
  });

  if (!accessToken?.locationId) {
    throw new Error("Unauthorized");
  }

  let url = `https://services.leadconnectorhq.com/conversations/search`;

  url += `?locationId=${accessToken.locationId}`;
  url += `&contactId=${args.contactID}`;
  // url += `&assignedTo=${accessToken.userId}`;

  const resp = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken?.accessToken}`,
      Version: "2021-04-15",
      Accept: "application/json",
    },
  });

  const data = await resp.json();

  // console.log(JSON.stringify(data));

  return data.conversations;
};
