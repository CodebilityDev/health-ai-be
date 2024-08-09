import { ChatCompletionMessageParam } from "openai/resources";
import { GlobalContext } from "~/common/context";
import { CONFIG } from "~/common/env";
import { ChatSessionData } from "~modules/chatai/types/ChatSessionData.type";
import { getGHLMe, GetGHLMe } from "~modules/gohighlevel/service/getGHLMe";
import { getGitomerText } from "./services/getGitomer";
import { getGPTResponse, OutputPings } from "./services/getGPTResponse";

export type HealthBotAIOnOutput = (args: OutputPings) => void;
export type HealthBotAIOnEnd = () => void;

/**
 * Generate a message from the health bot.
 * Specifically, this function does the following:
 * 1. Load the model and group data from the database
 * 2. Gets your GHL Profile
 * 3. Generates the Gitomer template
 * 4. Setup Chat History
 * 5. Generate the response
 * 6. Return
 */
export async function genereateHealthBotMessageCore(args: {
  context: GlobalContext;
  output?: HealthBotAIOnOutput;
  onEnd?: HealthBotAIOnEnd;
  input: {
    modelID: string;
    type?: "welcome" | "chat";
    prompt: string;
    chatSession: ChatSessionData;
    newChatHistory?: ChatCompletionMessageParam[];
    targetFields?: string;
  };
}) {
  let inputType = args.input.type || "welcome";
  const modelSource = {
    chat: "conversationBotConfig",
    welcome: "botConfig",
  };
  // get modelID from database
  // @ts-ignore
  let modelConfig = await args.context.prisma[
    modelSource[inputType]
  ].findUnique({
    where: { id: args.input.modelID },
    include: {
      group: {
        include: {
          aiKey: true,
        },
      },
    },
  });

  let groupData = modelConfig?.group;

  if (!groupData) {
    groupData = await args.context.prisma.group.findUnique({
      where: { id: args.input.modelID },
      include: {
        aiKey: true,
      },
    });
  }

  // console.log(modelConfig);

  if (!modelConfig) {
    throw new Error("Model not found");
  }

  let chatSessionData = args.input.chatSession;

  let ghlAccountMe: GetGHLMe | undefined;
  if (modelConfig.groupId) {
    // check the GHL Account
    ghlAccountMe = await getGHLMe({
      context: args.context,
      groupID: modelConfig.groupId,
    });
  }

  // load the openai client
  //   - use the user's api key if available, otherwise use the default
  const openAIKey =
    modelConfig?.group?.aiKey?.openapiKey || CONFIG.OPENAI_API_KEY;

  // console.log(modelConfig);

  const gitomerTemplate = getGitomerText({
    botSettings: {
      carriers: modelConfig.healthInsuranceCarriers,
      exMessage: modelConfig.welcomeMessage,
      mission: modelConfig.companyStatement,
      plan: modelConfig.priorityPlan,
      recommendedPlan: modelConfig.presentationStrategy,
      summary: modelConfig.summaryPrompt,
      tone: modelConfig.tonestyle,
      welcomeMessage: modelConfig.welcomeMessageFormat,
      noZipCodeMessage: modelConfig.noZipCodeMessage,
    },
    agent: {
      firstName: ghlAccountMe?.firstName || "Insurance Bot",
      lastName: ghlAccountMe?.lastName || "",
    },
    config: {
      isAnAssistant: modelConfig.group?.enable_botIsAssistant,
      noSSN: modelConfig.group?.enable_noSSN,
      dndReminder: modelConfig.group?.check_dndNotice,
      assitantName: modelConfig.group?.botAssistantName,
      dndNoticeMessage: modelConfig.group?.dndNoticeMessage,
      activeSurvey: modelConfig.group?.enable_activeSurvey,
      activeSurveySample: modelConfig.group?.activeSurveySample,
      activeSurveyTargetFields: args.input.targetFields,
    },
  });

  // load the chat session history, put the gitomer prompt at the start and generate the response
  const messages: ChatCompletionMessageParam[] = [
    // put the chat session history here
    ...chatSessionData.history,

    // put chat history here
    ...(args.input.newChatHistory || []),

    // put the user prompt here
    {
      role: "user",
      content: args.input.prompt,
    },
  ];

  // generate the response
  const { curMessages, lastResponse } = await getGPTResponse({
    apiKey: openAIKey,
    preMessages: gitomerTemplate.preMessage,
    postMessages: gitomerTemplate.postMessage,
    messages,
    output(fargs) {
      args.output && args.output(fargs);
    },
  });
  // let reply = lastResponse.choices[0].message.content;

  // save the response to the chat session history
  chatSessionData.history = curMessages;

  args.onEnd && args.onEnd();
  return {
    lastResponse,
    message: lastResponse.choices[0].message.content ?? "",
    messages: [
      ...gitomerTemplate.preMessage,
      ...curMessages,
      ...gitomerTemplate.postMessage,
    ],
    thread: curMessages,
    chatSessionData,
  };
}
