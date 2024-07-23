import { ChatCompletionMessageParam } from "openai/resources";
import { GlobalContext } from "~/common/context";
import { getGHLDetailedContact } from "~modules/gohighlevel/service/getGHLDetailedContact";
import { getGHLMe } from "~modules/gohighlevel/service/getGHLMe";
import { getGHLMessages } from "~modules/gohighlevel/service/getGHLMessages";
import { sendGHLMessage } from "~modules/gohighlevel/service/sendGHLMessage";
import {
  ContactCreate,
  ContactUpdate,
  GHLWebhookBody,
  InboundMessage,
} from "../types/GHLWebhookBody.type";
import { sendMessageRoutine } from "./sendMessageRoutine";
import {
  profileBuilderPrompt,
  sendWelcomeMessageRoutine,
} from "./sendWelcomeMessageRoutine";

export const WebhookRoutines = {
  onCreate: async (args: {
    locationID: string;
    userID: string;
    contactID: string;
    context: GlobalContext;
  }) => {
    // get user information
    const user = await getGHLDetailedContact({
      context: args.context,
      userID: args.userID,
      input: {
        id: args.contactID,
      },
    });

    // check if user has a 'federalplan' tag
    // const hasFederalPlan = user.tags.includes("federalplan-ai");

    // if (!hasFederalPlan) {
    //   return;
    // }

    // console.log("User", user);

    const agentInfo = await getGHLMe({
      context: args.context,
      userID: args.userID,
    });

    // console.log("Agent Info", agentInfo);

    const body = {
      location_id: args.locationID,
      first_name: user.firstName,
      last_name: user.lastName,
      agent_first_name: agentInfo.firstName,
      agent_last_name: agentInfo.lastName,
      ...user,
    };

    const resp = await sendWelcomeMessageRoutine({
      body,
      context: args.context,
    });

    console.log("Generated message", resp);

    await sendGHLMessage({
      context: args.context,
      userID: args.userID,
      input: {
        contactID: args.contactID,
        message: resp.message,
        type: "SMS",
      },
    });

    console.log("Message sent");

    return;
  },
  onNewMessage: async (args: {
    locationID: string;
    userID: string;
    contactID: string;
    context: GlobalContext;
    message: string;
    conversationID: string;
  }) => {
    // get user information
    const user = await getGHLDetailedContact({
      context: args.context,
      userID: args.userID,
      input: {
        id: args.contactID,
      },
    });

    // check if user has a 'federalplan' tag
    // const hasFederalPlan = user.tags.includes("federalplan-ai");

    // if (!hasFederalPlan) {
    //   return;
    // }

    // get conversation history
    const conversation = await getGHLMessages({
      context: args.context,
      userID: args.userID,
      conversationID: args.conversationID,
    });

    let rawChatHistory = conversation.messages;
    // sort by date oldest to newest
    rawChatHistory = rawChatHistory.sort(
      (a, b) =>
        new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime(),
    );

    // get agent info
    const agentInfo = await getGHLMe({
      context: args.context,
      userID: args.userID,
    });

    // console.log("Agent Info", agentInfo);

    const body = {
      location_id: args.locationID,
      first_name: user.firstName,
      last_name: user.lastName,
      agent_first_name: agentInfo.firstName,
      agent_last_name: agentInfo.lastName,
      ...user,
    };

    let chatHistory: ChatCompletionMessageParam[] = rawChatHistory.map(
      (message) => {
        return {
          role: message.direction === "inbound" ? "user" : "assistant",
          content: message.body,
        };
      },
    );

    chatHistory = [
      {
        role: "user",
        content: profileBuilderPrompt(body),
      },
      ...chatHistory,
    ];

    // pop out the last message
    let lastMessage = args.message;

    const resp = await sendMessageRoutine({
      clientInfo: body,
      context: args.context,
      chatHistory,
      location_id: args.locationID,
      prompt: lastMessage || "",
    });

    console.log("Generated message", resp);

    await sendGHLMessage({
      context: args.context,
      userID: args.userID,
      input: {
        contactID: args.contactID,
        message: resp.message,
        type: "SMS",
      },
    });

    console.log("Message sent");
  },
};

export const webhookRoutine = async (args: {
  payload: GHLWebhookBody;
  context: GlobalContext;
}) => {
  // console.log("Webhook received", args.payload);

  // get the latest user that is associated with the location
  const locationID = args.payload.locationId;
  const user = await args.context.prisma.gHLAccess.findFirst({
    where: {
      locationId: locationID,
    },
    include: {
      user: true,
    },
  });

  if (!user?.user) {
    return;
  }

  switch (args.payload.type) {
    case "ContactUpdate": {
      // handle contact update
      const _payload = args.payload as ContactUpdate;
      await WebhookRoutines.onCreate({
        locationID: _payload.locationId,
        userID: user?.user.id,
        contactID: _payload.id,
        context: args.context,
      });
      break;
    }
    case "ContactCreate": {
      // handle contact create
      const _payload = args.payload as ContactCreate;
      await WebhookRoutines.onCreate({
        locationID: _payload.locationId,
        userID: user?.user.id,
        contactID: _payload.id,
        context: args.context,
      });
      break;
    }
    case "InboundMessage": {
      // handle inbound message
      const _payload = args.payload as InboundMessage;
      await WebhookRoutines.onNewMessage({
        locationID: _payload.locationId,
        userID: user?.user.id,
        contactID: _payload.contactId,
        context: args.context,
        message: _payload.body,
        conversationID: _payload.conversationId,
      });
      break;
    }
  }
};
