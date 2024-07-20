import type { Lists } from ".keystone/types";
import { list } from "@keystone-6/core";
import { relationship, text } from "@keystone-6/core/fields";
import { schemaAccessConfig } from "~/lib/schema/access";
import {
  SchemaAccessTemplate,
  userOwnershipCheck,
} from "~/lib/schema/access/templates";

export const botDataList: Lists = {
  BotConfig: list({
    fields: {
      name: text({ validation: { isRequired: true } }),
      companyStatement: text(),
      tonestyle: text(),
      priorityPlan: text(),
      healthInsuranceCarriers: text(),
      presentationStrategy: text(),
      specificQuestions: text(),
      summaryPrompt: text(),
      welcomeMessage: text(),
      welcomeMessageFormat: text(),
      noZipCodeMessage: text(),
      user: relationship({ ref: "User.botConfig", many: false }),
      sessions: relationship({ ref: "ChatSession.botConfig", many: true }),
    },
    access: schemaAccessConfig({
      isAuthed: {
        all: true,
        read: false,
      },
      operations: {
        all: SchemaAccessTemplate.allow,
      },
      filter: {
        read: SchemaAccessTemplate.allow,
        write: userOwnershipCheck(),
      },
    }),
  }),
};
