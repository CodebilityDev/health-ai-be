import type { Lists } from ".keystone/types";
import { list } from "@keystone-6/core";
import {
  checkbox,
  integer,
  json,
  relationship,
  text,
} from "@keystone-6/core/fields";
import { ACCESS_LEVELS } from "~/common/context";
import { schemaAccessConfig } from "~/lib/schema/access";
import { SchemaAccessTemplate } from "~/lib/schema/access/templates";
import { updateQueuedSMSJob } from "~modules/sms-queue/queue";

export const groupDataList: Lists = {
  Group: list({
    fields: {
      name: text({ validation: { isRequired: true } }),
      members: relationship({
        ref: "GroupMember.group",
        many: true,
      }),

      botConfig: relationship({
        ref: "BotConfig.group",
        many: false,
      }),
      conversationBotConfig: relationship({
        ref: "ConversationBotConfig.group",
        many: false,
      }),
      ghlAccess: relationship({
        ref: "GHLAccess.group",
        many: false,
      }),
      aiKey: relationship({
        ref: "AIKey.group",
        many: false,
      }),
      enable_globalWelcome: checkbox(),
      enable_globalContactUpdate: checkbox(),
      enable_globalAutoReply: checkbox(),
      check_dndNotice: checkbox(),
      enable_checkDnd: checkbox(),
      enable_checkProfanity: checkbox(),
      enable_botIsAssistant: checkbox(),
      enable_noSSN: checkbox(),
      contactConfigs: json(),
      availability_start: integer(),
      availability_end: integer(),
      availability_enabled: checkbox(),
      aiLogs: relationship({
        ref: "GroupAILog.group",
        many: true,
      }),
      snippets: relationship({
        ref: "Snippet.group",
        many: true,
      }),
      agent_firstName: text(),
      agent_lastName: text(),
      enable_stopNotice: checkbox(),
    },
    hooks: {
      afterOperation: async ({ operation, context, item, inputData }) => {
        if (operation === "create") {
          await context.prisma.groupMember.create({
            data: {
              group: {
                connect: {
                  id: item.id,
                },
              },
              user: {
                connect: {
                  id: context.session?.itemId,
                },
              },
              access: ACCESS_LEVELS.ADMIN,
            },
          });
        } else if (operation === "update") {
          if (
            inputData.availability_start ||
            inputData.availability_end ||
            inputData.availability_enabled
          ) {
            // update all the queued sms
            await updateQueuedSMSJob({
              context,
              newStartTime: item.availability_start ?? 8,
              newEndTime: item.availability_end ?? 18,
            });
          }
        }
      },
    },
    access: schemaAccessConfig({
      isAuthed: true,
      operations: {
        all: SchemaAccessTemplate.allow,
      },
      filter: {
        all: SchemaAccessTemplate.sequential([
          ({ context }) => {
            return {
              OR: [
                SchemaAccessTemplate.memberhipCheckString(
                  {
                    type: "user",
                    userId: context.session?.itemId,
                    permissionLevel: ACCESS_LEVELS.VIEW,
                  },
                  SchemaAccessTemplate.groupMemberKeymap,
                ),
              ],
            };
          },
        ]),
      },
    }),
  }),
  GroupAILog: list({
    fields: {
      group: relationship({
        ref: "Group.aiLogs",
        many: false,
      }),
      contactID: text(),
      contactName: text(),
      locationID: text(),
      locationName: text(),
      modelID: text(),
      type: text(),
      status: text(),
      log: json(),
    },
    access: schemaAccessConfig({
      isAuthed: true,
      operations: {
        all: SchemaAccessTemplate.allow,
      },
      filter: {
        all: SchemaAccessTemplate.quickMembershipCheck(),
      },
    }),
  }),
  GroupMember: list({
    fields: {
      group: relationship({
        ref: "Group.members",
        many: false,
      }),
      user: relationship({
        ref: "User.groups",
        many: false,
      }),
      access: integer({
        defaultValue: ACCESS_LEVELS.VIEW,
      }),
    },
    access: schemaAccessConfig({
      isAuthed: true,
      operations: {
        all: SchemaAccessTemplate.allow,
      },
      filter: {
        all: SchemaAccessTemplate.sequential([
          SchemaAccessTemplate.quickMembershipCheck(),
        ]),
      },
    }),
  }),
};
