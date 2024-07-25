import { GlobalContext } from "~/common/context";
import { getAccessToken } from "./getGHLToken";

type Message = {
  id: string;
  direction: "inbound" | "outbound";
  status: string;
  type: number;
  locationId: string;
  attachments: any[]; // Assuming attachments can be of any type, replace with appropriate type if known
  body: string;
  contactId: string;
  contentType: string;
  conversationId: string;
  dateAdded: string;
  messageType: string;
  userId?: string; // userId is optional as it's not present in all messages
  source?: string; // source is optional as it's not present in all messages
};

type MessagesData = {
  lastMessageId: string;
  nextPage: boolean;
  messages: Message[];
};

export const getGHLMessages = async (args: {
  context: GlobalContext;
  groupID: string;
  conversationID: string;
  params?: {
    lastMessageId?: string;
    limit?: string;
    type?: "TYPE_SMS" | "TYPE_EMAIL" | "TYPE_CHAT" | string;
  };
}): Promise<MessagesData> => {
  const accessToken = await getAccessToken({
    prismaClient: args.context.prisma,
    groupID: args.groupID,
  });

  if (!accessToken?.locationId) {
    throw new Error("Unauthorized");
  }

  // filter args.params to remove undefined values
  args.params = Object.fromEntries(
    Object.entries(args.params ?? {}).filter(([_, v]) => v !== undefined),
  );

  const resp = await fetch(
    `https://services.leadconnectorhq.com/conversations/${args.conversationID}/messages` +
      (args.params ? `?${new URLSearchParams(args.params)}` : ""),
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

  return data.messages;
};
