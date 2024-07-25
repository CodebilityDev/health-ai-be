import { z } from "zod";
import {
  RouteDeclarationList,
  RouteDeclarationMetadata,
} from "~/lib/rest/declarations";
import { RequestInputType, RouteMethod } from "~/lib/rest/types";
import { buildInsuranceBotReplier } from "./services/insuranceBot";
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
      const rawchatSession =
        await context.prisma.chatConversationSession.findFirst({
          where: {
            id: sessionID,
          },
        });
      const chatSession = ChatSessionData.fromString(
        rawchatSession?.sessionData?.toString() ?? "{}",
      );
      const resp = await buildInsuranceBotReplier({
        context,
        input: {
          chatSession,
          type: "chat",
          modelID,
          prompt,
        },
        res,
      });
      if (rawchatSession) {
        await context.prisma.chatConversationSession.update({
          where: {
            id: sessionID,
          },
          data: {
            sessionData: resp.chatSessionData.toString(),
          },
        });
      } else {
        await context.prisma.chatConversationSession.create({
          data: {
            id: sessionID,
            sessionData: resp.chatSessionData.toString(),
          },
        });
      }
      return;
    },
  }),
);

export { chatgptRouteDeclaration };
