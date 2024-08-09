import { ChatCompletion } from "openai/resources";
import { GlobalContext } from "~/common/context";
import { CONFIG } from "~/common/env";
import { ChatSessionData } from "~modules/chatai/types/ChatSessionData.type";
import { SYS } from "~modules/chatai/types/UserTypes";
import { getGHLCustomFields } from "~modules/gohighlevel/service/getGHLCustomFields";
import { dataToProfileBuilder } from "./dataToProfileBuilder";
import { getCleanGPTResponse } from "./services/getGPTResponse";

export async function conversationAnalyzer(args: {
  context: GlobalContext;
  chatSessionData: ChatSessionData;
  groupID: string;
  contactID: string;
  fieldsFilter: string[];
  userInfo: any;
  user_contextFields: string[];
}) {
  // console.log("updating user profile");
  // console.log(JSON.stringify(userProfile.userInfo));
  // do a conversation analysis
  const messageQueue = [
    // add the conversation here
    ...args.chatSessionData.history,
    // do the data extraction prompt here
    SYS(
      `These are the fields that I want checking: ${args.fieldsFilter}. Consider all values as string .The user already has the following provided data, ${JSON.stringify(args.userInfo)}. Return an impartial json response containing new updated data of the user. Example: {"name": undefined, "age": 20} and the user said that they are 25 years old. Only return {"age": 25}. Only return keys and values based of the keys that I am checking. Don't return or invent new fields. You can leave '{}' if no data is needed to be updated. No null values are allowed. Double check the conversation for the latest information and compare it with the existing data.`,
    ),
    // expect a json of data of 'new' partial data
  ];

  const openAIKey = CONFIG.OPENAI_API_KEY;
  const userInfoUpdate = (await getCleanGPTResponse({
    apiKey: openAIKey,
    allHistory: messageQueue,
    options: {
      response_format: {
        type: "json_object",
      },
    },
  })) as ChatCompletion;

  const rawUpdatedUserInfo = JSON.parse(
    userInfoUpdate.choices[0].message.content ?? "{}",
  );

  let customContextList = (args.user_contextFields || []) as string[];
  let customFields = await getGHLCustomFields({
    context: args.context,
    groupID: args.groupID,
  });
  let fieldContextAndID = customContextList.reduce(
    (d: Record<string, any>, c: string) => {
      return {
        ...d,
        [c]: customFields.customFields.find((f) => f.name === c)?.id,
      };
    },
    {},
  );

  const updatedUserInfoPayload = await dataToProfileBuilder({
    newUserData: rawUpdatedUserInfo,
    customFieldsNameAndID: fieldContextAndID,
  });

  // console.log(
  //   "Updated User Info",
  //   userProfile.userInfo,
  //   userProfile.fieldsFilter,
  //   rawUpdatedUserInfo,
  //   updatedUserInfoPayload
  // );

  return updatedUserInfoPayload;
}
