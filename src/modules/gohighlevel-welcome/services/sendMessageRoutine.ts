import { ChatCompletionMessageParam } from "openai/resources";
import { GlobalContext } from "~/common/context";
import { buildInsuranceBotReplier } from "~modules/chatai/services/insuranceBot";
import { ChatSessionData } from "~modules/chatai/types/ChatSessionData.type";

export async function sendMessageRoutine(args: {
  context: GlobalContext;
  location_id: string;
  summarizeLength?: number;
  chatSession: ChatSessionData;
  clientInfo: {
    location_id: string;
    first_name: string;
    last_name: string;
    agent_first_name: string;
    agent_last_name: string;
    [key: string]: any;
  };
  chatHistory: ChatCompletionMessageParam[];
  prompt: string;
  targetFields?: string;
  type?: "welcome" | "chat";
}) {
  const modelAI = await args.context.prisma.gHLAccess.findFirst({
    where: {
      locationId: args.location_id,
      group: {
        id: args.location_id,
      },
    },
    include: {
      group: {
        include: {
          botConfig: args.type ?? "welcome" == "welcome" ? true : false,
          conversationBotConfig: args.type == "chat" ? true : false,
        },
      },
    },
  });

  let modelID;

  if (args.type == "chat") {
    modelID = modelAI?.group?.conversationBotConfig?.id;
  } else {
    modelID = modelAI?.group?.botConfig?.id;
  }

  // console.log("argsBody", args.body);
  // console.log("modelID", modelID);

  if (!modelID) {
    // // create a new model with blank data
    // let newModel = await args.context.prisma.botConfig.create({
    //   data: {},
    // });
    // modelID = newModel.id;
    if (!modelID) {
      if (args.type == "chat") {
        // look for the model with 'blank' as name, else create a new model with blank data
        let newModel =
          await args.context.prisma.conversationBotConfig.findFirst({
            where: {
              name: "blank",
            },
          });
        if (!newModel) {
          newModel = await args.context.prisma.conversationBotConfig.create({
            data: {
              name: "blank",
            },
          });
        }
        modelID = newModel.id;
      } else {
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
  }

  const chatGPTReply = await buildInsuranceBotReplier({
    context: args.context,
    input: {
      modelID: modelID,
      type: args.type,
      chatHistory: args.chatHistory,
      prompt: args.prompt,
      chatSession: args.chatSession,
      targetFields: args.targetFields,
    },
    res: undefined,
  });

  const message = chatGPTReply?.lastResponse?.choices[0]?.message.content || "";

  return {
    message,
    thread: chatGPTReply?.messages,
    body: args.clientInfo,
    modelID,
    chatSession: args.chatSession,
  };
}
