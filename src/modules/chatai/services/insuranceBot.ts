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
    prompt: string;
    sessionID: string;
  };
}) {
  // get modelID from database
  const modelConfig = await args.context.prisma.botConfig.findUnique({
    where: { id: args.input.modelID },
    include: {
      user: {
        include: {
          aiKey: true,
        },
      },
    },
  });

  if (!modelConfig) {
    throw new Error("Model not found");
  }

  // get sessionID from chat history
  const chatSession = await args.context.prisma.chatSession.findUnique({
    where: { id: args.input.sessionID },
  });

  let chatSessionData: ChatSessionData | undefined;

  // create a new chat session if it doesn't exist
  if (!chatSession) {
    chatSessionData = new ChatSessionData([]);
    await args.context.prisma.chatSession.create({
      data: {
        id: args.input.sessionID,
        sessionData: chatSessionData.toString(),
        botConfigId: args.input.modelID,
      },
    });
  } else {
    chatSessionData = ChatSessionData.fromString(
      chatSession.sessionData?.toString() || "{}",
    );
  }

  let ghlAccountMe: GetGHLMe | undefined;
  if (modelConfig.userId) {
    // check the GHL Account
    ghlAccountMe = await getGHLMe({
      context: args.context,
      userID: modelConfig.userId,
    });
  }

  // load the openai client
  //   - use the user's api key if available, otherwise use the default
  const openAIKey =
    modelConfig?.user?.aiKey?.openapiKey || CONFIG.OPENAI_API_KEY;

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
  });

  // load the chat session history, put the gitomer prompt at the start and generate the response
  const messages: ChatCompletionMessageParam[] = [
    // put the chat session history here
    ...chatSessionData.history,

    // put the user prompt here
    {
      role: "user",
      content: args.input.prompt,
    },
  ];

  // console.log(messages);

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

  // save the chat session history
  await args.context.prisma.chatSession.update({
    where: { id: args.input.sessionID },
    data: {
      sessionData: chatSessionData.toString(),
      botConfigId: args.input.modelID,
    },
  });

  args.res && args.res.end();
  return lastResponse;
}
