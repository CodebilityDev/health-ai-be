import type { Lists } from ".keystone/types";
import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { json, relationship, text } from "@keystone-6/core/fields";

export const chataiDataList: Lists = {
  ChatSession: list({
    fields: {
      keywords: text(),
      sessionData: json(),
      botConfig: relationship({ ref: "BotConfig.sessions", many: false }),
    },
    access: allowAll,
  }),
  ChatConversationSession: list({
    fields: {
      keywords: text(),
      sessionData: json(),
      botConfig: relationship({
        ref: "ConversationBotConfig.sessions",
        many: false,
      }),
    },
    access: allowAll,
  }),
};
