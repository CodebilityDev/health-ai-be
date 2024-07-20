import { GlobalContext } from "~/common/context";
import { buildInsuranceBotReplier } from "~modules/chatai/services/insuranceBot";

export async function sendWelcomeMessageRoutine(args: {
  context: GlobalContext;
  body: any;
}) {
  const modelAI = await args.context.prisma.gHLAccess.findFirst({
    where: {
      locationId: args.body.location_id,
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
      prompt:
        `I have the following identity information: ` +
        JSON.stringify(args.body),
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
