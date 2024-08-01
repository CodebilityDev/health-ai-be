import { ChatCompletion, ChatCompletionMessageParam } from "openai/resources";
import { GlobalContext } from "~/common/context";
import { CONFIG } from "~/common/env";
import { getCleanGPTResponse } from "~modules/chatai/openai/healthbot/getGPTResponse";
import { ChatSessionData } from "~modules/chatai/types/ChatSessionData.type";
import { LeadContact } from "~modules/gohighlevel/service/getGHLContacts";
import { getGHLDetailedContact } from "~modules/gohighlevel/service/getGHLDetailedContact";
import { getGHLMe } from "~modules/gohighlevel/service/getGHLMe";
import { getGHLMessages } from "~modules/gohighlevel/service/getGHLMessages";
import { getGHLContactUpdate } from "~modules/gohighlevel/service/getGHLUpdateContact";
import { processGHLMessage } from "~modules/gohighlevel/service/sendGHLMessage";
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

async function checkEnabled(args: {
  context: GlobalContext;
  groupID: string;
  contactID: string;
  toCheck:
    | "enable_globalAutoReply"
    | "enable_globalWelcome"
    | "enable_globalContactUpdate";
  listAccessKey: string;
}) {
  // get group info
  const group = await args.context.prisma.group.findFirst({
    where: {
      id: args.groupID,
    },
  });

  if (!group) {
    return false;
  }

  const accessList = (group.contactConfigs as Record<string, string>) ?? {};

  // @ts-ignore
  if (group[args.toCheck]) {
    // check if globalAutoReply is enabled
    // if contactID is in blacklist, return false
    if (
      accessList[args.contactID]?.includes(`${args.listAccessKey}_blacklist`)
    ) {
      return false;
    }
    return true;
  } else {
    // if contactID is not in whitelist, return false
    if (
      accessList[args.contactID]?.includes(`${args.listAccessKey}_whitelist`)
    ) {
      return true;
    }
    return false;
  }
}

async function checkDNDMessage(args: {
  context: GlobalContext;
  groupID: string;
  contactInfo: LeadContact;
  message: string;
}) {
  // get group info
  const group = await args.context.prisma.group.findFirst({
    where: {
      id: args.groupID,
    },
    include: {
      aiKey: true,
    },
  });

  if (!group) {
    return false;
  }

  // if dnd check is disabled, return true
  if (!group.enable_checkDnd && !group.enable_checkProfanity) {
    return true;
  }

  // check if user has DND enabled for SMS, if yes return false
  if (args.contactInfo.dndSettings?.SMS?.status !== "inactive") {
    return false;
  }

  if (group.enable_checkDnd) {
    // check if message is 'STOP' or 'STOPALL', if yes return false (and update DND status)
    if (
      args.message.toLowerCase() === "stop" ||
      args.message.toLowerCase() === "stopall"
    ) {
      await getGHLContactUpdate({
        context: args.context,
        contactId: args.contactInfo.id,
        groupID: args.groupID,
        updateData: {
          dnd: true,
        },
      });
      return false;
    }

    if (group.enable_checkProfanity) {
      const openAIKey = group?.aiKey?.openapiKey || CONFIG.OPENAI_API_KEY;
      const profanityCheck = (await getCleanGPTResponse({
        apiKey: openAIKey,
        allHistory: [
          {
            role: "system",
            content:
              "The user will send a message, return 'true' if the message is profane, else return 'false'. Return the result as it is..",
          },
          {
            role: "user",
            content: args.message,
          },
        ],
      })) as ChatCompletion;

      if (profanityCheck.choices[0].message.content?.includes("true")) {
        await getGHLContactUpdate({
          context: args.context,
          contactId: args.contactInfo.id,
          groupID: args.groupID,
          updateData: {
            dnd: true,
          },
        });
        return false;
      }
    }
  }

  // return true if user
  return true;
}

export const WebhookRoutines = {
  onCreate: async (args: {
    locationID: string;
    groupID: string;
    contactID: string;
    context: GlobalContext;
  }) => {
    // get user information
    const user = await getGHLDetailedContact({
      context: args.context,
      groupID: args.groupID,
      input: {
        id: args.contactID,
      },
    });

    if (
      !(await checkEnabled({
        contactID: args.contactID,
        context: args.context,
        groupID: args.groupID,
        toCheck: "enable_globalWelcome",
        listAccessKey: "welcome",
      }))
    ) {
      // console.log(`Not enabled [on create] [${args.contactID}]`);
      return;
    }

    // check if user has a 'federalplan' tag
    // const hasFederalPlan = user.tags.includes("federalplan-ai");

    // if (!hasFederalPlan) {
    //   return;
    // }

    // console.log("User", user);

    const agentInfo = await getGHLMe({
      context: args.context,
      groupID: args.groupID,
    });
    const timezone = user.timezone || agentInfo.timezone || "America/New_York";

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
      chatSession: new ChatSessionData([]),
      context: args.context,
    });

    // console.log("Generated message", resp);
    // addSMSJob({
    //   message: resp.message,
    //   contactID: args.contactID,
    //   groupID: args.groupID,
    // });
    await processGHLMessage({
      context: args.context,
      groupID: args.groupID,
      groupName: agentInfo.business.name,
      input: {
        contactID: args.contactID,
        contactName: `${user.firstName} ${user.lastName}`,
        message: resp.message,
        type: "SMS",
      },
      cutOffTime: {
        timezone,
      },
    });

    // if chat session with id already exists, delete it
    await args.context.prisma.chatSession.deleteMany({
      where: {
        id: "welcome" + args.contactID,
      },
    });
    await args.context.prisma.chatSession.create({
      data: {
        id: "welcome" + args.contactID,
        botConfigId: resp.modelID,
        keywords: `contact: ${user.firstName} ${user.lastName} | email: ${user.email} | id: ${user.id}`,
        sessionData: resp.chatSession.toString(),
      },
    });

    (async () => {
      await args.context.prisma.groupAILog.create({
        data: {
          contactID: args.contactID,
          contactName: `${user.firstName} ${user.lastName} (${user.email})`,
          groupId: args.groupID,
          locationID: args.locationID,
          locationName: agentInfo.business.name,
          modelID: resp.modelID,
          // @ts-ignore
          log: {
            type: "onCreate",
            message: resp.message,
            history: resp.thread,
          },
        },
      });
    })();

    // console.log("Message sent");

    return;
  },
  onUpdate: async (args: {
    locationID: string;
    groupID: string;
    contactID: string;
    context: GlobalContext;
  }) => {
    // get user information
    const user = await getGHLDetailedContact({
      context: args.context,
      groupID: args.groupID,
      input: {
        id: args.contactID,
      },
    });

    if (
      !(await checkEnabled({
        contactID: args.contactID,
        context: args.context,
        groupID: args.groupID,
        toCheck: "enable_globalContactUpdate",
        listAccessKey: "contactUpdate",
      }))
    ) {
      // console.log(`Not enabled [on update] [${args.contactID}]`);
      return;
    }

    // check if user has a 'federalplan' tag
    // const hasFederalPlan = user.tags.includes("federalplan-ai");

    // if (!hasFederalPlan) {
    //   return;
    // }

    // console.log("User", user);

    const agentInfo = await getGHLMe({
      context: args.context,
      groupID: args.groupID,
    });

    const timezone = user.timezone || agentInfo.timezone || "America/New_York";

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
      chatSession: new ChatSessionData([]),
      context: args.context,
    });

    // console.log("Generated message", resp);

    const sendResult = await processGHLMessage({
      context: args.context,
      groupID: args.groupID,
      groupName: agentInfo.business.name,
      input: {
        contactID: args.contactID,
        contactName: `${user.firstName} ${user.lastName}`,
        message: resp.message,
        type: "SMS",
      },
      cutOffTime: {
        timezone,
      },
    });

    // if chat session with id already exists, delete it
    await args.context.prisma.chatSession.deleteMany({
      where: {
        id: "welcome" + args.contactID,
      },
    });
    await args.context.prisma.chatSession.create({
      data: {
        id: "welcome" + args.contactID,
        botConfigId: resp.modelID,
        keywords: `contact: ${user.firstName} ${user.lastName} | email: ${user.email} | id: ${user.id}`,
        sessionData: resp.chatSession.toString(),
      },
    });

    (async () => {
      await args.context.prisma.groupAILog.create({
        data: {
          contactID: args.contactID,
          contactName: `${user.firstName} ${user.lastName}`,
          groupId: args.groupID,
          locationID: args.locationID,
          locationName: agentInfo.business.name,
          modelID: resp.modelID,
          // @ts-ignore
          log: {
            type: "onUpdate",
            message: resp.message,
            history: resp.thread,
          },
        },
      });
    })();
    // console.log("Message sent");

    return;
  },
  onNewMessage: async (args: {
    locationID: string;
    groupID: string;
    contactID: string;
    context: GlobalContext;
    message: string;
    conversationID: string;
    messageID: string;
  }) => {
    // get user information
    const user = await getGHLDetailedContact({
      context: args.context,
      groupID: args.groupID,
      input: {
        id: args.contactID,
      },
    });

    // check dnd
    if (!(await checkDNDMessage({ ...args, contactInfo: user }))) {
      return;
    }

    // check if whitelisted
    if (
      !(await checkEnabled({
        contactID: args.contactID,
        context: args.context,
        groupID: args.groupID,
        toCheck: "enable_globalAutoReply",
        listAccessKey: "autoReply",
      }))
    ) {
      // console.log(`Not enabled [autoreply] [${args.contactID}]`);
      return;
    }

    // check if user has a 'federalplan' tag
    // const hasFederalPlan = user.tags.includes("federalplan-ai");

    // if (!hasFederalPlan) {
    //   return;
    // }

    // get agent info
    const agentInfo = await getGHLMe({
      context: args.context,
      groupID: args.groupID,
    });

    const timezone = user.timezone || agentInfo.timezone || "America/New_York";

    let chatSessionData = new ChatSessionData([]);

    // check if chat session exists, else create a new one

    const chatSession =
      await args.context.prisma.chatConversationSession.findFirst({
        where: {
          id: "chat" + user.id,
        },
      });

    if (chatSession) {
      chatSessionData = ChatSessionData.fromString(
        chatSession.sessionData?.toString() ?? "{}",
      );
    } else {
      // create a new chat session
      await args.context.prisma.chatConversationSession.create({
        data: {
          id: "chat" + user.id,
          keywords: `contact: ${user.firstName} ${user.lastName} | email: ${user.email} | id: ${user.id}`,
          sessionData: chatSessionData.toString(),
        },
      });
    }

    const groupData = await args.context.prisma.group.findFirst({
      where: {
        id: args.groupID,
      },
    });

    // get conversation history
    const conversation = await getGHLMessages({
      context: args.context,
      groupID: args.groupID,
      conversationID: args.conversationID,
      params: {
        limit: "100",
      },
    });

    // console.log("Conversation", conversation);

    let rawChatHistory = conversation.messages;
    // sort by date oldest to newest
    rawChatHistory = rawChatHistory.sort(
      (a, b) =>
        new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime(),
    );

    if (chatSessionData.lastMessageID) {
      // filter out conversations older than the last message
      let lastMessageIndex = rawChatHistory.findIndex(
        (message) => message.id === chatSessionData.lastMessageID,
      );

      if (lastMessageIndex !== -1) {
        rawChatHistory = rawChatHistory.slice(lastMessageIndex + 1);
      }
    }

    // console.log("Agent Info", agentInfo);

    let chatHistory: ChatCompletionMessageParam[] = rawChatHistory.map(
      (message) => {
        return {
          role: message.direction === "inbound" ? "user" : "assistant",
          content: message.body,
        };
      },
    );

    const body = {
      location_id: args.locationID,
      first_name: user.firstName,
      last_name: user.lastName,
      agent_first_name: agentInfo.firstName,
      agent_last_name: agentInfo.lastName,
      ...user,
    };

    chatHistory = [
      {
        role: "user",
        content: profileBuilderPrompt({
          userInfo: body,
          filter: groupData?.contactConfigs as string[],
        }),
      },
      ...chatHistory,
    ];

    // pop out the last message
    chatHistory.pop();
    let lastMessage = args.message;

    // update the last message id
    chatSessionData.lastMessageID = args.messageID;

    // console.log("Chat History", chatHistory);

    // try to append the last message to the chat history
    // let d = true;

    // if (d) {
    //   return;
    // }

    const resp = await sendMessageRoutine({
      clientInfo: body,
      context: args.context,
      chatHistory,
      location_id: args.locationID,
      prompt: lastMessage ?? "",
      chatSession: chatSessionData,
      type: "chat",
    });

    // console.log("Generated message", resp);

    const sendResult = await processGHLMessage({
      context: args.context,
      groupID: args.groupID,
      groupName: agentInfo.business.name,
      input: {
        contactID: args.contactID,
        contactName: `${user.firstName} ${user.lastName}`,
        message: resp.message,
        type: "SMS",
      },
      cutOffTime: {
        timezone,
      },
    });

    // remove every prompt that starts with 'this is my latest...'

    resp.chatSession.history = resp.chatSession.history.filter(
      (message) => !(message.content as string)?.includes("[profilePrompt]"),
    );

    // check if there's any message in the history that is duplicated, ex. message 2 and message 3 has the same role and content
    let lastRole = "";
    let lastContent: any = "";
    for (let i = 0; i < resp.chatSession.history.length; i++) {
      let message = resp.chatSession.history[i];
      if (message.role === lastRole && message.content === lastContent) {
        resp.chatSession.history.splice(i, 1);
        i--;
      } else {
        lastRole = message.role;
        lastContent = message.content;
      }
    }

    // check if id exist in chat session, if yes update, else create
    const fetchedChatSession =
      await args.context.prisma.chatConversationSession.findFirst({
        where: {
          id: "chat" + user.id,
        },
      });
    if (fetchedChatSession) {
      await args.context.prisma.chatConversationSession.update({
        where: {
          id: "chat" + user.id,
        },
        data: {
          botConfigId: resp.modelID,
          keywords: `contact: ${user.firstName} ${user.lastName} | email: ${user.email} | id: ${user.id}`,
          sessionData: resp.chatSession.toString(),
        },
      });
    } else {
      await args.context.prisma.chatConversationSession.create({
        data: {
          id: "chat" + user.id,
          botConfigId: resp.modelID,
          keywords: `contact: ${user.firstName} ${user.lastName} | email: ${user.email} | id: ${user.id}`,
          sessionData: resp.chatSession.toString(),
        },
      });
    }

    (async () => {
      await args.context.prisma.groupAILog.create({
        data: {
          contactID: args.contactID,
          contactName: `${user.firstName} ${user.lastName}`,
          groupId: args.groupID,
          locationID: args.locationID,
          locationName: agentInfo.business.name,
          modelID: resp.modelID,
          // @ts-ignore
          log: {
            type: "onNewMessage",
            message: resp.message,
            history: resp.thread,
          },
        },
      });
    })();
    // console.log("Message sent");
  },
};

export const webhookRoutine = async (args: {
  payload: GHLWebhookBody;
  context: GlobalContext;
}) => {
  // get the latest user that is associated with the location
  const locationID = args.payload.locationId;
  const group = await args.context.prisma.gHLAccess.findFirst({
    where: {
      locationId: locationID,
    },
    include: {
      group: true,
    },
  });

  if (!group?.group) {
    return;
  }

  switch (args.payload.type) {
    case "ContactUpdate": {
      // handle contact update
      const _payload = args.payload as ContactUpdate;
      await WebhookRoutines.onUpdate({
        locationID: _payload.locationId,
        groupID: group?.group.id,
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
        groupID: group?.group.id,
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
        groupID: group?.group.id,
        contactID: _payload.contactId,
        context: args.context,
        message: _payload.body,
        conversationID: _payload.conversationId,
        messageID: _payload.messageId,
      });
      break;
    }
  }
};
