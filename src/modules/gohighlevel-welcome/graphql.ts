import { z } from "zod";
import {
  GraphqlActionMetadata,
  GraphqlMethodDeclarationList,
} from "~/lib/graphql/declarations";
import { ChatSessionData } from "~modules/chatai/types/ChatSessionData.type";
import { getGHLContacts } from "~modules/gohighlevel/service/getGHLContacts";
import { getGHLCustomFields } from "~modules/gohighlevel/service/getGHLCustomFields";
import { getGHLMessages } from "~modules/gohighlevel/service/getGHLMessages";
import {
  createCustomField,
  deleteCustomField,
  updateCustomField,
} from "~modules/gohighlevel/service/modifyGHLCustomFields";
import { processGHLMessage } from "~modules/gohighlevel/service/sendGHLMessage";
import { sendWelcomeMessageRoutine as generateWelcomeMessage } from "./services/sendWelcomeMessageRoutine";

const ghWelcomeAPIGqlDeclaration = new GraphqlMethodDeclarationList();

ghWelcomeAPIGqlDeclaration.add(
  new GraphqlActionMetadata({
    root: "Query",
    name: "ghl_getContacts",
    input: z.object({
      groupID: z.string(),
      query: z.string().optional(),
    }),
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
    inputRequired: false,
    resolve: async (_, input, context) => {
      if (!context.session) {
        throw new Error("Unauthorized");
      }

      const group = await context.prisma.group.findFirst({
        where: {
          id: input.groupID,
          members: {
            some: {
              userId: context.session.itemId,
            },
          },
        },
      });

      if (!group) {
        throw new Error("Unauthorized");
      }

      const contactList = await getGHLContacts({
        context: context,
        groupID: input.groupID,
        query: input?.query,
      });

      // console.log(contactList);

      return { contacts: contactList };
    },
  }),
);

// ghWelcomeAPIGqlDeclaration.add(
//   new GraphqlActionMetadata({
//     root: "Query",
//     name: "ghl_getContact",
//     output: [
//       {
//         name: "GHLDetailedContact",
//         schema: z.object({
//           id: z.string().optional(),
//           locationId: z.string().optional(),
//           firstName: z.string().optional(),
//           lastName: z.string().optional(),
//           fullName: z.string().optional(),
//           email: z.string().optional(),
//           timezone: z.string().optional(),
//           address1: z.string().optional(),
//           country: z.string().optional(),
//           city: z.string().optional(),
//           postalCode: z.string().optional(),
//           state: z.string().optional(),
//           dateUpdated: z.string().optional(),
//           businessId: z.string().optional(),
//           customFields: z.array(
//             z.object({
//               id: z.string(),
//               name: z.string(),
//               value: z.string(),
//             })
//           ),
//         }),
//         isMain: true,
//       },
//     ],
//     input: z.object({
//       id: z.string(),
//     }),
//     resolve: async (_, input, context) => {
//       if (!context.session) {
//         throw new Error("Unauthorized");
//       }

//       return getGHLDetailedContact({
//         context,
//         input,
//       });
//     },
//   })
// );

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
      groupID: z.string(),
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

      const group = await context.prisma.group.findFirst({
        where: {
          id: input.groupID,
          members: {
            some: {
              userId: context.session.itemId,
            },
          },
        },
      });

      if (!group) {
        throw new Error("Unauthorized");
      }

      // const detailedUserInfo = await getGHLDetailedContact({
      //   context,
      //   groupID: input.groupID,
      //   input: {
      //     id: input.contactID,
      //   },
      // });

      const message = await generateWelcomeMessage({
        chatSession: new ChatSessionData([]),
        // @ts-ignore
        body: {
          ...input,
          location_id: input.location_id,
          first_name: input.first_name || "",
          last_name: input.last_name || "",
          agent_first_name: input.agent_first_name || "Insurance Agent",
          agent_last_name: input.agent_last_name || "",
          // ...detailedUserInfo,
        },
        context,
      });

      if (input.actualSend) {
        await processGHLMessage({
          context: context,
          groupID: input.groupID,
          groupName: group.name,
          input: {
            contactID: input.contactID,
            contactName: `${input.first_name} ${input.last_name}`,
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

ghWelcomeAPIGqlDeclaration.add(
  new GraphqlActionMetadata({
    root: "Query",
    name: "ghl_getMessages",
    output: "String",
    input: z.object({
      groupID: z.string(),
      conversationID: z.string(),
    }),
    resolve: async (_, input, context) => {
      if (!context.session) {
        throw new Error("Unauthorized");
      }

      const group = await context.prisma.group.findFirst({
        where: {
          id: input.groupID,
          members: {
            some: {
              userId: context.session.itemId,
            },
          },
        },
      });

      if (!group) {
        throw new Error("Unauthorized");
      }

      return JSON.stringify(
        await getGHLMessages({
          context,
          groupID: input.groupID,
          conversationID: input.conversationID,
        }),
        null,
        2,
      );
    },
  }),
);

ghWelcomeAPIGqlDeclaration.add(
  new GraphqlActionMetadata({
    root: "Query",
    name: "ghl_getCustomFields",
    output: [
      {
        name: "GHLCustomFieldData",
        fields: {
          customFields: "[GHLCustomField]",
        },
        isMain: true,
      },
      {
        name: "GHLCustomField",
        schema: z.object({
          id: z.string(),
          name: z.string(),
          fieldKey: z.string().optional(),
          placeholder: z.string().optional(),
          dataType: z.string().optional(),
          position: z.number().optional(),
          picklistOptions: z.array(z.string()).optional(),
          picklistImageOptions: z.array(z.string()).optional(),
          isAllowedCustomOption: z.boolean().optional(),
          isMultiFileAllowed: z.boolean().optional(),
          maxFileLimit: z.number().optional(),
          locationId: z.string().optional(),
          model: z.string().optional(),
        }),
      },
    ],
    input: z.object({
      groupID: z.string(),
    }),
    resolve: async (_, input, context) => {
      if (!context.session) {
        throw new Error("Unauthorized");
      }

      const group = await context.prisma.group.findFirst({
        where: {
          id: input.groupID,
          members: {
            some: {
              userId: context.session.itemId,
            },
          },
        },
      });

      if (!group) {
        throw new Error("Unauthorized");
      }

      return await getGHLCustomFields({
        context,
        groupID: input.groupID,
      });
    },
  }),
);

ghWelcomeAPIGqlDeclaration.add(
  new GraphqlActionMetadata({
    root: "Mutation",
    name: "ghl_setCustomFields",
    output: "[String]",
    input: z.object({
      groupID: z.string(),
      customFields: z.array(
        z.object({
          id: z.string().optional(),
          name: z.string().optional(),
          action: z.enum(["create", "update", "delete"]),
        }),
      ),
    }),
    resolve: async (_, input, context) => {
      if (!context.session) {
        throw new Error("Unauthorized");
      }

      const group = await context.prisma.group.findFirst({
        where: {
          id: input.groupID,
          members: {
            some: {
              userId: context.session.itemId,
            },
          },
        },
      });

      if (!group) {
        throw new Error("Unauthorized");
      }

      let output: string[] = [];

      for (let field of input.customFields) {
        switch (field.action) {
          case "create": {
            const d = await createCustomField({
              context,
              groupID: input.groupID,
              input: {
                name: field.name!,
              },
            });
            // console.log(d);
            output.push(`Created custom field: ${field.name}`);
            break;
          }
          case "update": {
            // Update custom field
            const d = await updateCustomField({
              context,
              groupID: input.groupID,
              input: {
                id: field.id!,
                name: field.name!,
              },
            });
            // console.log(d);
            output.push(`Updated custom field: ${field.name}`);
            break;
          }
          case "delete": {
            // Delete custom field
            const d = await deleteCustomField({
              context,
              groupID: input.groupID,
              input: {
                id: field.id!,
              },
            });
            // console.log(d);
            output.push(`Deleted custom field: ${field.id}`);
            break;
          }
        }
      }

      return output;
    },
  }),
);

export { ghWelcomeAPIGqlDeclaration };
