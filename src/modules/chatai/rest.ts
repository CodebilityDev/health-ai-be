import { z } from "zod";
import {
  RouteDeclarationList,
  RouteDeclarationMetadata,
} from "~/lib/rest/declarations";
import { RequestInputType, RouteMethod } from "~/lib/rest/types";
import { genereateHealthBotMessageCore } from "./openai/healthbot/genereateHealthBotMessageCore";
import { getChatSession } from "./openai/healthbot/getChatSession";
import { saveChatSession } from "./openai/healthbot/saveChatSession";

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
      // Get Chat Session
      const chatSession = await getChatSession({
        sessionID,
        context,
        opts: {
          createIfNotExists: true,
          keywordIfNotExists: sessionID,
        },
      });

      // In place Generate Chat Message
      await genereateHealthBotMessageCore({
        context,
        input: {
          chatSession,
          type: "chat",
          modelID,
          prompt,
        },
        output: async (pings) => {
          res.write(JSON.stringify(pings) + "\n");
        },
        onEnd: async () => {
          res.end();
        },
      });

      // Save Chat Session
      await saveChatSession({
        chatSession,
        context,
        modelID,
        sessionID,
      });
      return;
    },
  }),
);

export { chatgptRouteDeclaration };
