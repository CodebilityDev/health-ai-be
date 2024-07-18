import { ChatCompletionMessageParam } from "openai/resources";
import { z } from "zod";
import { CONFIG } from "~/common/env";
import {
  RouteDeclarationList,
  RouteDeclarationMetadata,
} from "~/lib/rest/declarations";
import { RequestInputType, RouteMethod } from "~/lib/rest/types";
import { GetGHLMe, getGHLMe } from "~modules/gohighlevel/service/getGHLMe";
import { getGitomerText } from "./openai/healthbot/getGitomer";
import { getGPTResponse } from "./openai/healthbot/getGPTResponse";
import { ChatSessionData } from "./types/ChatSessionData.type";

const chatgptRouteDeclaration = new RouteDeclarationList({
  path: "/chatgpt",
});

chatgptRouteDeclaration.routes.set(
  "/call",
  new RouteDeclarationMetadata({
    method: RouteMethod.POST,
    inputParser: z.object({
      [RequestInputType.BODY]: z.object({
        prompt: z.string(),
        modelID: z.string(),
        sessionID: z.string(),
      }),
    }),
    func: async ({
      inputData: {
        body: { modelID, prompt, sessionID },
      },
      res,
      context,
    }) => {
      // get modelID from database
      const modelConfig = await context.prisma.botConfig.findUnique({
        where: { id: modelID },
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
      const chatSession = await context.prisma.chatSession.findUnique({
        where: { id: sessionID },
      });

      let chatSessionData: ChatSessionData | undefined;

      // create a new chat session if it doesn't exist
      if (!chatSession) {
        chatSessionData = new ChatSessionData([]);
        await context.prisma.chatSession.create({
          data: {
            id: sessionID,
            sessionData: chatSessionData.toString(),
            botConfigId: modelID,
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
          context,
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
          content: prompt,
        },
      ];

      // console.log(messages);

      // generate the response
      const { curMessages, lastResponse } = await getGPTResponse({
        apiKey: openAIKey,
        preMessages: gitomerTemplate,
        messages,
        output(args) {
          res.write(JSON.stringify(args) + "\n");
        },
      });
      // let reply = lastResponse.choices[0].message.content;

      // save the response to the chat session history
      chatSessionData.history = curMessages;

      // save the chat session history
      await context.prisma.chatSession.update({
        where: { id: sessionID },
        data: {
          sessionData: chatSessionData.toString(),
          botConfigId: modelID,
        },
      });

      res.end();
      return;
    },
  }),
);

export { chatgptRouteDeclaration };
