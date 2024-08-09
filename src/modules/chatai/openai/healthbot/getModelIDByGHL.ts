import { GlobalContext } from "~/common/context";

export const getModelIDByGHLLocation = async (args: {
  context: GlobalContext;
  type?: string;
  body: {
    location_id: string;
  };
}) => {
  let inputType = args.type || "welcome";
  const modelSource = {
    chat: "conversationBotConfig",
    welcome: "botConfig",
  };
  // @ts-ignore
  const model = modelSource[inputType];

  const modelAI = await args.context.prisma.gHLAccess.findFirst({
    where: {
      locationId: args.body.location_id,
      group: {
        id: args.body.location_id,
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      group: {
        include: {
          [model]: true,
        },
      },
    },
  });

  // @ts-ignore
  let modelID = modelAI?.group?.[model]?.id;

  // console.log("argsBody", args.body);
  // console.log("modelID", modelID);

  if (!modelID) {
    // look for the model with 'blank' as name, else create a new model with blank data

    // @ts-ignore
    let newModel = await args.context.prisma[model].findFirst({
      where: {
        name: "blank",
      },
    });
    if (!newModel) {
      // @ts-ignore
      newModel = await args.context.prisma[model].create({
        data: {
          name: "blank",
        },
      });
    }
    modelID = newModel.id;
  }

  // console.log("Model ID", modelID);

  return {
    modelID,
    modelAI,
  };
};
