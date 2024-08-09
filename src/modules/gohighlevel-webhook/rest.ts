import { z } from "zod";
import {
  RouteDeclarationList,
  RouteDeclarationMetadata,
} from "~/lib/rest/declarations";
import { RequestInputType, RouteMethod } from "~/lib/rest/types";
import { webhookRoutine } from "./routines/webhookRoutine";

export const ghlWebhookRouteDeclaration = new RouteDeclarationList({
  path: "/ghwh",
});

ghlWebhookRouteDeclaration.routes.set(
  "/webhook",
  new RouteDeclarationMetadata({
    method: RouteMethod.POST,
    inputParser: z.object({
      [RequestInputType.BODY]: z.any(),
    }),
    func: async ({ context, inputData: { body } }) => {
      (async () => {
        await webhookRoutine({
          payload: body,
          context,
        });
      })();
      return "OK";
    },
  }),
);
