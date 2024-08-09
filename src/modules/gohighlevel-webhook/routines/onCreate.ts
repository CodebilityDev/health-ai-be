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

export async function onCreate(args: {
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
    toCheck: EnabledToCheck.Welcome,
  });

  if (!bootstrapMessage) {
    return;
  }

  const { compiledUserData, userData, agentData, timezone } = bootstrapMessage;

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
        contactName: `${userData.firstName} ${userData.lastName} (${userData.email})`,
        groupId: args.groupID,
        locationID: args.locationID,
        locationName: agentData.business.name,
        modelID: model.modelID,
        // @ts-ignore
        log: {
          type: "onCreate",
          message: resp.message,
          history: resp.thread,
        },
      },
    });
  })();

  return;
}
