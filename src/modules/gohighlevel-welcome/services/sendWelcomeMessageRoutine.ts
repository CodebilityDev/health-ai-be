import { GlobalContext } from "~/common/context";
import { buildInsuranceBotReplier } from "~modules/chatai/services/insuranceBot";
import { ChatSessionData } from "~modules/chatai/types/ChatSessionData.type";

export const profileBuilderPrompt = (args: any) =>
  `[profilePrompt] This is my latest identity information. Use these data to properly address me or consider my needs: ${JSON.stringify(args)}`;

export async function sendWelcomeMessageRoutine(args: {
  context: GlobalContext;
  chatSession: ChatSessionData;
  body: {
    location_id: string;
    first_name: string;
    last_name: string;
    agent_first_name: string;
    agent_last_name: string;
    [key: string]: any;
  };
}) {
  const modelAI = await args.context.prisma.gHLAccess.findFirst({
    where: {
      locationId: args.body.location_id,
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      group: {
        include: {
          botConfig: true,
        },
      },
    },
  });

  let modelID = modelAI?.group?.botConfig?.id;

  // console.log("argsBody", args.body);
  // console.log("modelID", modelID);

  if (!modelID) {
    // // create a new model with blank data
    // let newModel = await args.context.prisma.botConfig.create({
    //   data: {},
    // });
    // modelID = newModel.id;
    if (!modelID) {
      // look for the model with 'blank' as name, else create a new model with blank data
      let newModel = await args.context.prisma.botConfig.findFirst({
        where: {
          name: "blank",
        },
      });
      if (!newModel) {
        newModel = await args.context.prisma.botConfig.create({
          data: {
            name: "blank",
          },
        });
      }
      modelID = newModel.id;
    }
  }

  const chatGPTReply = await buildInsuranceBotReplier({
    context: args.context,
    input: {
      modelID: modelID,
      chatSession: args.chatSession,
      prompt: profileBuilderPrompt(args.body),
    },
    res: undefined,
  });

  const message = chatGPTReply?.lastResponse?.choices[0]?.message.content || "";

  return {
    message,
    thread: chatGPTReply?.messages,
    chatSession: chatGPTReply?.chatSessionData,
    body: args.body,
    modelID,
  };
}
