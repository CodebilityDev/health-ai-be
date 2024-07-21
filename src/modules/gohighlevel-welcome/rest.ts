import { z } from "zod";
import {
  RouteDeclarationList,
  RouteDeclarationMetadata,
} from "~/lib/rest/declarations";
import { RequestInputType, RouteMethod } from "~/lib/rest/types";
import { sendWelcomeMessageRoutine } from "./services/sendWelcomeMessageRoutine";
import { webhookRoutine } from "./services/webhookRoutine";

export const ghlWelcomeRouteDeclaration = new RouteDeclarationList({
  path: "/ghwh",
});

ghlWelcomeRouteDeclaration.routes.set(
  "/webhook",
  new RouteDeclarationMetadata({
    method: RouteMethod.POST,
    inputParser: z.object({
      [RequestInputType.BODY]: z.any(),
    }),
    func: async ({ context, inputData: { body } }) => {
      return await webhookRoutine({
        payload: body,
        context,
      });
    },
  }),
);

ghlWelcomeRouteDeclaration.routes.set(
  "/welcome/callback",
  new RouteDeclarationMetadata({
    method: RouteMethod.POST,
    inputParser: z.object({
      [RequestInputType.BODY]: z.object({
        location_id: z.string(),
        zip_code: z.string().optional(),
        first_name: z.string().optional(),
        last_name: z.string().optional(),
        dob: z.string().optional(),
        state: z.string().optional(),
        gender: z.string().optional(),
        how_many_people_in_your_household_need_to_be_on_the_plan: z
          .string()
          .optional(),
        yearly_income: z.string().optional(),
        number_of_tax_dependents: z.string().optional(),
        has_tax_dependents: z.string().optional(),
        spouse_name: z.string().optional(),
        projected_annual_household_income: z.string().optional(),
        agent_first_name: z.string().optional(),
        agent_last_name: z.string().optional(),
      }),
    }),
    func: async ({ context, inputData: { body } }) => {
      return await sendWelcomeMessageRoutine({
        body: {
          ...body,
          location_id: body.location_id,
          first_name: body.first_name || "",
          last_name: body.last_name || "",
          agent_first_name: body.agent_first_name || "Insurance Agent",
          agent_last_name: body.agent_last_name || "",
        },
        context,
      });
    },
  }),
);
