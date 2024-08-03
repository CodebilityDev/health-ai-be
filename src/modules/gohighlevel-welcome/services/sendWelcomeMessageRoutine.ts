import { GlobalContext } from "~/common/context";
import { buildInsuranceBotReplier } from "~modules/chatai/services/insuranceBot";
import { ChatSessionData } from "~modules/chatai/types/ChatSessionData.type";

export const FIELDS_MAP: Record<string, any> = {
  location_id: null,
  first_name: "firstName",
  last_name: "lastName",
  agent_first_name: null,
  agent_last_name: null,
};

const DEFAULT_FIELDS = [
  "location_id",
  "first_name",
  "last_name",
  "agent_first_name",
  "agent_last_name",
  "emailLowerCase",
  "timezone",
  "companyName",
  "phone",
  "type",
  "source",
  "address1",
  "city",
  "state",
  "country",
  "postalCode",
  "website",
  "dateOfBirth",
  "gender",

  // "id",
  // "email",
  // "timezone",
  // "country",
  // "contactName",
];

const UPDATABLE_FIELDS = [
  "companyName",
  "phone",
  "type",
  "address1",
  "city",
  "state",
  "country",
  "postalCode",
  "website",
  "dateOfBirth",
  "gender",
];

export const profileBuilderPrompt = (args: {
  userInfo: any;
  filter?: string[];
}) => {
  const fieldsFilter = [...DEFAULT_FIELDS, ...(args.filter || [])];
  const updatableFields = [...UPDATABLE_FIELDS, ...(args.filter || [])];

  const customFields = args.userInfo.customFields || [];

  args.userInfo = {
    ...args.userInfo,
    ...customFields.reduce((acc: any, field: any) => {
      acc[field.name] = field.value;
      return acc;
    }, {} as any),
  };

  const filteredUserInfo = Object.keys(args.userInfo).reduce((acc, key) => {
    if (fieldsFilter.includes(key)) {
      acc[key] = args.userInfo[key];
    }
    return acc;
  }, {} as any);

  const st = `[profilePrompt] This is my latest identity information. Use these data to properly address me or consider my needs: ${JSON.stringify(filteredUserInfo)}`;

  return {
    prompt: st,
    userInfo: filteredUserInfo,
    fieldsFilter: updatableFields,
  };
};

export const dataToProfileBuilder = (args: {
  newUserData: any;
  customFieldsNameAndID: Record<string, string>;
}) => {
  const dataUpdate: Record<string, any> = {};
  const specialKeys = Object.keys(FIELDS_MAP);
  const customKeys = Object.keys(args.customFieldsNameAndID);
  for (let newKey in args.newUserData) {
    if (specialKeys.includes(newKey)) {
      if (FIELDS_MAP[newKey]) {
        dataUpdate[FIELDS_MAP[newKey]] = args.newUserData[newKey];
      }
    } else if (customKeys.includes(newKey)) {
      if (!dataUpdate.customFields) {
        dataUpdate.customFields = [];
      }
      dataUpdate.customFields.push({
        id: args.customFieldsNameAndID[newKey],
        field_value: args.newUserData[newKey],
      });
    } else if (UPDATABLE_FIELDS.includes(newKey)) {
      dataUpdate[newKey] = args.newUserData[newKey];
    }
  }

  return dataUpdate;
};

export async function sendWelcomeMessageRoutine(args: {
  context: GlobalContext;
  chatSession: ChatSessionData;
  body: {
    location_id: string;
    first_name: string;
    last_name: string;
    agent_first_name: string;
    agent_last_name: string;
  };
}) {
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
      prompt: profileBuilderPrompt({
        userInfo: args.body,
        filter: modelAI?.group?.user_contextFields as string[],
      }).prompt,
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
