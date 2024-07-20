import { z } from "zod";
import {
  GraphqlActionMetadata,
  GraphqlMethodDeclarationList,
} from "~/lib/graphql/declarations";
import { getGHLContacts } from "~modules/gohighlevel/service/getGHLContacts";
import { sendGHLMessage } from "~modules/gohighlevel/service/sendGHLMessage";
import { sendWelcomeMessageRoutine } from "./services/sendMessageRoutine";

const ghWelcomeAPIGqlDeclaration = new GraphqlMethodDeclarationList();

ghWelcomeAPIGqlDeclaration.add(
  new GraphqlActionMetadata({
    root: "Query",
    name: "ghl_getContacts",
    output: [
      {
        name: "GHLContact",
        schema: z.object({
          id: z.string().optional(),
          locationId: z.string().optional(),
          firstName: z.string().optional(),
          lastName: z.string().optional(),
          contactName: z.string().optional(),
          email: z.string().optional(),
          timezone: z.string().optional(),
          country: z.string().optional(),
          source: z.string().optional(),
          dateAdded: z.string().optional(),
          businessId: z.string().optional(),
        }),
      },
      {
        name: "GHLContactList",
        isMain: true,
        fields: {
          contacts: "[GHLContact]",
        },
      },
    ],
    input: z.object({
      query: z.string().optional(),
    }),
    inputRequired: false,
    resolve: async (_, input, context) => {
      if (!context.session) {
        throw new Error("Unauthorized");
      }

      const contactList = await getGHLContacts({
        context: context,
        userID: context.session.itemId,
        query: input?.query,
      });

      // console.log(contactList);

      return { contacts: contactList };
    },
  }),
);

ghWelcomeAPIGqlDeclaration.add(
  new GraphqlActionMetadata({
    root: "Mutation",
    name: "ghl_sendMessage",
    output: [
      {
        name: "GHLMessageReturn",
        schema: z.object({
          message: z.string(),
          contactID: z.string(),
          thread: z.string(),
        }),
      },
    ],
    input: z.object({
      contactID: z.string(),
      location_id: z.string(),
      actualSend: z.boolean().optional(),
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
    resolve: async (_, input, context) => {
      if (!context.session) {
        throw new Error("Unauthorized");
      }

      const message = await sendWelcomeMessageRoutine({
        body: input,
        context,
      });

      if (input.actualSend) {
        await sendGHLMessage({
          context: context,
          userID: context.session.itemId,
          input: {
            contactID: input.contactID,
            message: message.message,
            type: "SMS",
          },
        });
      }
      return {
        message: message.message,
        contactID: input.contactID,
        thread: JSON.stringify(message.thread, null, 2),
      };
    },
  }),
);

export { ghWelcomeAPIGqlDeclaration };
