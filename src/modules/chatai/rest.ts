import { z } from "zod";
import {
  RouteDeclarationList,
  RouteDeclarationMetadata,
} from "~/lib/rest/declarations";
import { RequestInputType, RouteMethod } from "~/lib/rest/types";
import { buildInsuranceBotReplier } from "./services/insuranceBot";

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
      await buildInsuranceBotReplier({
        context,
        input: {
          modelID,
          prompt,
          sessionID,
        },
        res,
      });
      return;
    },
  }),
);

export { chatgptRouteDeclaration };
