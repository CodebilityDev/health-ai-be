import { Response } from "express";
import { ChatCompletionMessageParam } from "openai/resources";
import { GlobalContext } from "~/common/context";
import { CONFIG } from "~/common/env";
import { getGHLMe, GetGHLMe } from "~modules/gohighlevel/service/getGHLMe";
import { getGitomerText } from "../openai/healthbot/getGitomer";
import { getGPTResponse } from "../openai/healthbot/getGPTResponse";
import { ChatSessionData } from "../types/ChatSessionData.type";

export async function buildInsuranceBotReplier(args: {
  context: GlobalContext;
  res?: Response;
  input: {
    modelID: string;
    type?: "welcome" | "chat";
    prompt: string;
    chatSession: ChatSessionData;
    chatHistory?: ChatCompletionMessageParam[];
    summarizeLength?: number;
  };
}) {
  // get modelID from database
  let modelConfig;
  if (args.input.type == "chat") {
    modelConfig = await args.context.prisma.conversationBotConfig.findUnique({
      where: { id: args.input.modelID },
      include: {
        group: {
          include: {
            aiKey: true,
          },
        },
      },
    });
  } else {
    modelConfig = await args.context.prisma.botConfig.findUnique({
      where: { id: args.input.modelID },
      include: {
        group: {
          include: {
            aiKey: true,
          },
        },
      },
    });
  }

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
    },
  });

  // load the chat session history, put the gitomer prompt at the start and generate the response
  const messages: ChatCompletionMessageParam[] = [
    // put the chat session history here
    ...chatSessionData.history,

    // put chat history here
    ...(args.input.chatHistory || []),

    // put the user prompt here
    {
      role: "user",
      content: args.input.prompt,
    },
  ];

  // generate the response
  const { curMessages, lastResponse } = await getGPTResponse({
    apiKey: openAIKey,
    preMessages: gitomerTemplate,
    messages,
    output(fargs) {
      args.res && args.res.write(JSON.stringify(fargs) + "\n");
    },
  });
  // let reply = lastResponse.choices[0].message.content;

  // save the response to the chat session history
  chatSessionData.history = curMessages;

  args.res && args.res.end();
  return {
    lastResponse,
    messages: [...gitomerTemplate, ...curMessages],
    chatSessionData,
  };
}
