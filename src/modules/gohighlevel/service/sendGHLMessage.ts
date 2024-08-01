import { GlobalContext } from "~/common/context";
import { addSMSJob } from "~modules/sms-queue/queue";
import { getAccessToken } from "./getGHLToken";

interface MessageResponse {
  conversationId: string;
  emailMessageId: string;
  messageId: string;
  messageIds: string[];
  msg: string;
}

export const processGHLMessage = async (args: {
  context: GlobalContext;
  groupID: string;
  groupName: string;
  input: {
    type: "SMS" | string;
    contactID: string;
    contactName: string;
    message: string;
  };
  cutOffTime?: {
    timezone: string;
  };
}) => {
  if (args.cutOffTime) {
    // check if the current time is within the cut off time via group info
  }

  addSMSJob({
    message: args.input.message,
    contactID: args.input.contactID,
    contactName: args.input.contactName,
    groupID: args.groupID,
    groupName: args.groupName,
    type: args.input.type,
    offTimeConfig: {
      timezone: args.cutOffTime?.timezone!,
    },
  });
};

export const sendGHLMessage = async (args: {
  context: GlobalContext;
  groupID: string;
  input: {
    type: "SMS" | string;
    contactID: string;
    message: string;
  };
}): Promise<MessageResponse> => {
  const accessToken = await getAccessToken({
    prismaClient: args.context.prisma,
    groupID: args.groupID,
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
