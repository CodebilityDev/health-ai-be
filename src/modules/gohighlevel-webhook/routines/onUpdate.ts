import { GlobalContext } from "~/common/context";
import { genereateHealthBotMessageCore } from "~modules/chatai/openai/healthbot/genereateHealthBotMessageCore";
import { getModelIDByGHLLocation } from "~modules/chatai/openai/healthbot/getModelIDByGHL";
import { profileBuilderPrompt } from "~modules/chatai/openai/healthbot/profileBuilderPrompt";
import { ChatSessionData } from "~modules/chatai/types/ChatSessionData.type";
import { processGHLMessage } from "~modules/gohighlevel/service/sendGHLMessage";
import {
  bootstrapConversation,
  EnabledListAccessKey,
  EnabledToCheck,
} from "../services/webhookBootstrap";

export async function onUpdate(args: {
  locationID: string;
  groupID: string;
  contactID: string;
  context: GlobalContext;
}) {
  const bootstrapMessage = await bootstrapConversation({
    contactID: args.contactID,
    context: args.context,
    groupID: args.groupID,
    locationID: args.locationID,
    listAccessKey: EnabledListAccessKey.Welcome,
    toCheck: EnabledToCheck.ContactUpdate,
  });

  if (!bootstrapMessage) {
    return;
  }

  const { compiledUserData, timezone, userData, agentData } = bootstrapMessage;

  const model = await getModelIDByGHLLocation({
    context: args.context,
    body: {
      location_id: args.locationID,
    },
  });

  const chatSession = new ChatSessionData([]);

  const resp = await genereateHealthBotMessageCore({
    context: args.context,
    input: {
      modelID: model.modelID,
      chatSession: chatSession,
      prompt: profileBuilderPrompt({
        userInfo: compiledUserData,
        filter: model.modelAI?.group?.user_contextFields as string[],
      }).prompt,
    },
  });

  // console.log("Generated message", resp);

  await processGHLMessage({
    context: args.context,
    groupID: args.groupID,
    groupName: agentData.business.name,
    input: {
      contactID: args.contactID,
      contactName: `${userData.firstName} ${userData.lastName}`,
      message: resp.message,
      type: "SMS",
    },
    cutOffTime: {
      timezone,
    },
  });

  (async () => {
    await args.context.prisma.groupAILog.create({
      data: {
        contactID: args.contactID,
        contactName: `${userData.firstName} ${userData.lastName}`,
        groupId: args.groupID,
        locationID: args.locationID,
        locationName: agentData.business.name,
        modelID: model.modelID,
        // @ts-ignore
        log: {
          type: "onUpdate",
          message: resp.message,
          history: resp.thread,
        },
      },
    });
  })();

  return;
}
