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
      `This is my current info. ${JSON.stringify(args.userInfo)}. Return a json object that analyzes the variables: ${args.fieldsFilter.join(
        ", ",
      )} and return the new values. Example: {"name": "John Doe", "email": "john@doe.com"}. All fields are required.`,
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
  //   args.userInfo,
  //   args.fieldsFilter,
  //   rawUpdatedUserInfo,
  //   updatedUserInfoPayload
  // );

  // console.log("Updated User Info", updatedUserInfoPayload);

  return updatedUserInfoPayload;
}
