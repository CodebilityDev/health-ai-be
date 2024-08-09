import { z } from "zod";
import {
  GraphqlActionMetadata,
  GraphqlMethodDeclarationList,
} from "~/lib/graphql/declarations";
import { ChatSessionData } from "~modules/chatai/types/ChatSessionData.type";
import { getGHLContacts } from "./service/getGHLContacts";
import {
  clearCustomFieldsCache,
  getGHLCustomFields,
} from "./service/getGHLCustomFields";
import { getGHLMe } from "./service/getGHLMe";
import { getGHLMessages } from "./service/getGHLMessages";
import { getAccessToken } from "./service/getGHLToken";
import {
  createCustomField,
  deleteCustomField,
  updateCustomField,
} from "./service/modifyGHLCustomFields";
import { processGHLMessage } from "./service/sendGHLMessage";

import { GlobalContext } from "~/common/context";
import { genereateHealthBotMessageCore } from "~modules/chatai/openai/healthbot/genereateHealthBotMessageCore";
import { getModelIDByGHLLocation } from "~modules/chatai/openai/healthbot/getModelIDByGHL";

const ghAPIGqlDeclaration = new GraphqlMethodDeclarationList();

async function checkGroupMembership(args: {
  context: GlobalContext;
  input: { groupID: string };
}) {
  if (!args.context.session) {
    throw new Error("Unauthorized");
  }

  const group = await args.context.prisma.group.findFirst({
    where: {
      id: args.input.groupID,
      members: {
        some: {
          userId: args.context.session.itemId,
        },
      },
    },
  });

  if (!group) {
    throw new Error("Unauthorized");
  }

  return group;
}

ghAPIGqlDeclaration.add(
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
      const group = await checkGroupMembership({
        context,
        input: {
          groupID: input.groupID,
        },
      });

      const modelID = await getModelIDByGHLLocation({
        context,
        body: {
          location_id: input.location_id,
        },
        type: "chat",
      });

      const resp = await genereateHealthBotMessageCore({
        context,
        input: {
          chatSession: new ChatSessionData([]),
          type: "chat",
          modelID: modelID.modelID,
          prompt: "Hello",
        },
      });

      if (input.actualSend) {
        await processGHLMessage({
          context: context,
          groupID: input.groupID,
          groupName: group.name,
          input: {
            contactID: input.contactID,
            contactName: `${input.first_name} ${input.last_name}`,
            message: resp.message,
            type: "SMS",
          },
        });
      }

      return {
        message: resp.message,
        contactID: input.contactID,
        thread: JSON.stringify(resp.messages, null, 2),
      };
    },
  }),
);

ghAPIGqlDeclaration.add(
  new GraphqlActionMetadata({
    root: "Query",
    name: "ghl_accessToken",
    output: "String",
    input: z.object({
      groupID: z.string(),
    }),
    resolve: async (_, { groupID }, context) => {
      await checkGroupMembership({
        context,
        input: {
          groupID: groupID,
        },
      });

      const accessToken = await getAccessToken({
        prismaClient: context.prisma,
        groupID,
      });

      return accessToken;
    },
  }),
);

ghAPIGqlDeclaration.add(
  new GraphqlActionMetadata({
    root: "Query",
    name: "ghl_me",
    input: z.object({
      groupID: z.string(),
    }),
    output: [
      {
        name: "GHLMeReturn",
        isMain: true,
        schema: z.object({
          name: z.string(),
          email: z.string(),
          firstName: z.string(),
          lastName: z.string(),
          phone: z.string(),
          address: z.string(),
          state: z.string(),
          country: z.string(),
          postalCode: z.string(),
          business: z.object({
            name: z.string(),
            address: z.string(),
            city: z.string(),
            state: z.string(),
            country: z.string(),
            postalCode: z.string(),
            website: z.string(),
            timezone: z.string(),
            logoUrl: z.string(),
          }),
        }),
      },
    ],
    resolve: async (_, { groupID }, context) => {
      await checkGroupMembership({
        context,
        input: {
          groupID: groupID,
        },
      });

      const userInfo = await getGHLMe({
        context,
        groupID,
      });

      if (!userInfo) {
        throw new Error("No Account Found");
      }

      // console.log(userInfo);

      return {
        name: `${userInfo.firstName} ${userInfo.lastName}`,
        email: userInfo.email,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        phone: userInfo.phone,
        address: userInfo.address,
        state: userInfo.state,
        country: userInfo.country,
        postalCode: userInfo.postalCode,
        business: userInfo.business,
      };
    },
  }),
);

ghAPIGqlDeclaration.add(
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
      await checkGroupMembership({
        context,
        input: {
          groupID: input.groupID,
        },
      });

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

ghAPIGqlDeclaration.add(
  new GraphqlActionMetadata({
    root: "Query",
    name: "ghl_getMessages",
    output: "String",
    input: z.object({
      groupID: z.string(),
      conversationID: z.string(),
    }),
    resolve: async (_, input, context) => {
      await checkGroupMembership({
        context,
        input: {
          groupID: input.groupID,
        },
      });

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

ghAPIGqlDeclaration.add(
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
      await checkGroupMembership({
        context,
        input: {
          groupID: input.groupID,
        },
      });

      return await getGHLCustomFields({
        context,
        groupID: input.groupID,
      });
    },
  }),
);

ghAPIGqlDeclaration.add(
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
      await checkGroupMembership({
        context,
        input: {
          groupID: input.groupID,
        },
      });

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
            if (d.statusCode == 401) {
              throw new Error("Please re-authenticate GHL");
            }
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
            if (d.statusCode == 401) {
              throw new Error("Please re-authenticate GHL");
            }
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
            if (d.statusCode == 401) {
              throw new Error("Please re-authenticate GHL");
            }
            output.push(`Deleted custom field: ${field.id}`);
            break;
          }
        }
      }

      return output;
    },
  }),
);

ghAPIGqlDeclaration.add(
  new GraphqlActionMetadata({
    root: "Mutation",
    name: "ghl_breakCustomFieldsCache",
    output: "Boolean",
    input: z.object({
      groupID: z.string(),
    }),
    resolve: async (_, input, context) => {
      const group = await checkGroupMembership({
        context,
        input: {
          groupID: input.groupID,
        },
      });

      clearCustomFieldsCache(group.id);

      return true;
    },
  }),
);

export { ghAPIGqlDeclaration };
