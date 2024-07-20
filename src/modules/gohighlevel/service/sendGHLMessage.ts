import { GlobalContext } from "~/common/context";
import { getAccessToken } from "./getGHLToken";

interface MessageResponse {
  conversationId: string;
  emailMessageId: string;
  messageId: string;
  messageIds: string[];
  msg: string;
}

export const sendGHLMessage = async (args: {
  context: GlobalContext;
  userID: string;
  input: {
    type: "SMS" | string;
    contactID: string;
    message: string;
  };
}): Promise<MessageResponse> => {
  const accessToken = await getAccessToken({
    prismaClient: args.context.prisma,
    userID: args.userID,
  });

  const resp = await fetch(
    "https://services.leadconnectorhq.com/conversations/messages",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken?.accessToken}`,
        Version: "2021-04-15",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        type: args.input.type,
        contactId: args.input.contactID,
        message: args.input.message,
      }),
    },
  );

  const data = await resp.json();

  return data;
};
