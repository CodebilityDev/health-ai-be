import { GlobalContext } from "~/common/context";
import { buildInsuranceBotReplier } from "~modules/chatai/services/insuranceBot";

export const profileBuilderPrompt = (args: any) =>
  `I have the following identity information. Use these data to properly address me or consider my needs: ${JSON.stringify(args)}`;

export async function sendWelcomeMessageRoutine(args: {
  context: GlobalContext;
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
      user: {
        include: {
          botConfig: true,
        },
      },
    },
  });

  let modelID = modelAI?.user?.botConfig?.id;

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
      prompt: profileBuilderPrompt(args.body),
      sessionID: `${args.body.first_name} ${args.body.last_name} - ${args.body.agent_first_name} ${args.body.agent_last_name} ${Date.now()}`,
    },
    res: undefined,
  });

  const message = chatGPTReply?.lastResponse?.choices[0]?.message.content || "";

  return {
    message,
    thread: chatGPTReply?.messages,
    body: args.body,
    modelID,
  };
}
