import { ChatCompletionMessageParam } from "openai/resources";
import { GlobalContext } from "~/common/context";
import { conversationAnalyzer } from "~modules/chatai/openai/healthbot/conversationAnalyzer";
import { genereateHealthBotMessageCore } from "~modules/chatai/openai/healthbot/genereateHealthBotMessageCore";
import { getModelIDByGHLLocation } from "~modules/chatai/openai/healthbot/getModelIDByGHL";
import { profileBuilderPrompt } from "~modules/chatai/openai/healthbot/profileBuilderPrompt";
import { getGHLContactUpdate } from "~modules/gohighlevel/service/getGHLUpdateContact";
import { processGHLMessage } from "~modules/gohighlevel/service/sendGHLMessage";
import { syncGHLMessageToConvContext } from "../services/ghlMessageSync";
import {
  bootstrapConversation,
  EnabledListAccessKey,
  EnabledToCheck,
} from "../services/webhookBootstrap";

export const onNewMessage = async (args: {
  locationID: string;
  groupID: string;
  contactID: string;
  context: GlobalContext;
  message: string;
  conversationID: string;
  messageID: string;
  messageType: string;
}) => {
  // Bootstrap the conversation
  const bootstrapMessage = await bootstrapConversation({
    contactID: args.contactID,
    context: args.context,
    groupID: args.groupID,
    locationID: args.locationID,
    listAccessKey: EnabledListAccessKey.AutoReply,
    toCheck: EnabledToCheck.AutoReply,
  });

  // console.log("Bootstrap Message", bootstrapMessage);

  if (!bootstrapMessage) {
    return;
  }

  const { compiledUserData, timezone, userData, agentData } = bootstrapMessage;

  // Load the bot model
  const model = await getModelIDByGHLLocation({
    context: args.context,
    body: {
      location_id: args.locationID,
    },
    type: "chat",
  });

  // Sync the message to the conversation context
  const { newChatMessages, chatSession } = await syncGHLMessageToConvContext({
    context: args.context,
    messageID: args.messageID,
    conversationID: args.conversationID,
    groupID: args.groupID,
    userData: userData,
  });

  // Build the user profile
  const userProfile = profileBuilderPrompt({
    userInfo: compiledUserData,
    filter: model.modelAI?.group?.user_contextFields as string[],
  });

  // pop out the last message
  newChatMessages.pop();

  let chatHistoryWithUserProfile: ChatCompletionMessageParam[] = [
    {
      role: "user",
      content: userProfile.prompt,
    },
    ...newChatMessages,
  ];

  // Generate the bot message
  const resp = await genereateHealthBotMessageCore({
    context: args.context,
    input: {
      modelID: model.modelID,
      type: "chat",
      newChatHistory: chatHistoryWithUserProfile,
      prompt: args.message,
      chatSession: chatSession,
      targetFields: JSON.stringify(userProfile.fieldsFilter),
    },
  });

  // Send the message
  await processGHLMessage({
    context: args.context,
    groupID: args.groupID,
    groupName: agentData.business.name,
    input: {
      contactID: args.contactID,
      contactName: `${userData.firstName} ${userData.lastName}`,
      message: resp.message,
      type: args.messageType,
    },
    cutOffTime: {
      timezone,
    },
  });

  // remove every prompt that starts with 'this is my latest...'
  resp.chatSessionData.history = resp.chatSessionData.history.filter(
    (message) => !(message.content as string)?.includes("[profilePrompt]"),
  );

  // check if there's any message in the history that is duplicated, ex. message 2 and message 3 has the same role and content
  if (model.modelAI?.group?.enable_profileBuilder) {
    const analysis = await conversationAnalyzer({
      chatSessionData: resp.chatSessionData,
      context: args.context,
      contactID: args.contactID,
      fieldsFilter: userProfile.fieldsFilter,
      groupID: args.groupID,
      userInfo: compiledUserData,
      user_contextFields: model.modelAI?.group?.user_contextFields as string[],
    });

    await getGHLContactUpdate({
      context: args.context,
      contactId: args.contactID,
      groupID: args.groupID,
      updateData: analysis,
    });
  }

  (async () => {
    await args.context.prisma.chatConversationSession.update({
      where: {
        id: "chat" + userData.id,
      },
      data: {
        botConfigId: model.modelID,
        keywords: `contact: ${userData.firstName} ${userData.lastName} | email: ${userData.email} | id: ${userData.id}`,
        sessionData: resp.chatSessionData.toString(),
      },
    });
  })();
};
