import type { Lists } from ".keystone/types";
import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { text } from "@keystone-6/core/fields";

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
    },
    access: allowAll,
  }),
};
