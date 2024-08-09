import { ChatCompletionMessageParam } from "openai/resources";
import { GlobalContext } from "~/common/context";
import { getChatSession } from "~modules/chatai/openai/healthbot/getChatSession";
import { LeadContact } from "~modules/gohighlevel/service/getGHLContacts";
import { getGHLMessages } from "~modules/gohighlevel/service/getGHLMessages";

export async function syncGHLMessageToConvContext(args: {
  context: GlobalContext;
  messageID: string;
  userData: LeadContact;
  groupID: string;
  conversationID: string;
}) {
  // check if chat session exists, else create a new one
  const chatSessionData = await getChatSession({
    context: args.context,
    sessionID: "chat" + args.userData.id,
    opts: {
      createIfNotExists: true,
      keywordIfNotExists: `contact: ${args.userData.firstName} ${args.userData.lastName} | email: ${args.userData.email} | id: ${args.userData.id}`,
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
    (a, b) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime(),
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

  // update the last message id
  chatSessionData.lastMessageID = args.messageID;

  // remove duplicates

  let lastRole = "";
  let lastContent: any = "";
  for (let i = 0; i < chatSessionData.history.length; i++) {
    let message = chatSessionData.history[i];
    if (message.role === lastRole && message.content === lastContent) {
      chatSessionData.history.splice(i, 1);
      i--;
    } else {
      lastRole = message.role;
      lastContent = message.content;
    }
  }

  return {
    chatSession: chatSessionData,
    newChatMessages: chatHistory,
  };
}
