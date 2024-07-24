import { ChatCompletionMessageParam } from "openai/resources";
import { GlobalContext } from "~/common/context";
import { buildInsuranceBotReplier } from "~modules/chatai/services/insuranceBot";

export async function sendMessageRoutine(args: {
  context: GlobalContext;
  location_id: string;
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
}) {
  const modelAI = await args.context.prisma.gHLAccess.findFirst({
    where: {
      locationId: args.location_id,
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
      chatHistory: args.chatHistory,
      prompt: args.prompt,
      sessionID: `${args.clientInfo.first_name} ${args.clientInfo.last_name} - ${args.clientInfo.agent_first_name} ${args.clientInfo.agent_last_name} ${Date.now()}`,
    },
    res: undefined,
  });

  const message = chatGPTReply?.lastResponse?.choices[0]?.message.content || "";

  return {
    message,
    thread: chatGPTReply?.messages,
    body: args.clientInfo,
    modelID,
  };
}
