import { z } from "zod";
import {
  RouteDeclarationList,
  RouteDeclarationMetadata,
} from "~/lib/rest/declarations";
import { RequestInputType, RouteMethod } from "~/lib/rest/types";
import { buildInsuranceBotReplier } from "~modules/chatai/services/insuranceBot";
import { sendWelcomeMessageRoutine } from "./services/sendMessageRoutine";

export const ghlWelcomeRouteDeclaration = new RouteDeclarationList({
  path: "/ghwh",
});

ghlWelcomeRouteDeclaration.routes.set(
  "/welcome/manual",
  new RouteDeclarationMetadata({
    method: RouteMethod.POST,
    inputParser: z.object({
      [RequestInputType.BODY]: z.object({
        contactID: z.string(),
        location_id: z.string(),
        model_id: z.string(),
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
      const modelAI = await context.prisma.gHLAccess.findFirst({
        where: {
          locationId: body.location_id,
        },
        include: {
          user: {
            include: {
              botConfig: true,
            },
          },
        },
      });

      let modelID = modelAI?.user?.botConfig?.id;

      if (body.model_id) {
        modelID = body.model_id;
      }

      if (!modelID) {
        // look for the model with 'blank' as name, else create a new model with blank data
        let newModel = await context.prisma.botConfig.findFirst({
          where: {
            name: "blank",
          },
        });
        if (!newModel) {
          newModel = await context.prisma.botConfig.create({
            data: {
              name: "blank",
            },
          });
        }
        modelID = newModel.id;
      }

      const chatGPTReply = await buildInsuranceBotReplier({
        context,
        input: {
          modelID: modelID,
          prompt:
            `I have the following identity information: ` +
            JSON.stringify(body),
          sessionID: `${body.first_name} ${body.last_name} - ${body.agent_first_name} ${body.agent_last_name} ${Date.now()}`,
        },
        res: undefined,
      });

      const message =
        chatGPTReply?.lastResponse?.choices[0]?.message.content || "";

      return {
        message,
        body,
        modelID,
      };
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
        body,
        context,
      });
    },
  }),
);
