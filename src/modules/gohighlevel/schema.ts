import type { Lists } from ".keystone/types";
import { list } from "@keystone-6/core";
import { relationship, text } from "@keystone-6/core/fields";
import { schemaAccessConfig } from "~/lib/schema/access";
import {
  SchemaAccessTemplate,
  userOwnershipCheck,
} from "~/lib/schema/access/templates";

export const ghlSchema: Lists = {
  GHLAccess: list({
    fields: {
      user: relationship({ ref: "User.ghlAccess", many: false }),
      refreshToken: text({ validation: { isRequired: true } }),
      ghsUserId: text(),
      planId: text(),
      locationId: text(),
      companyId: text(),
      scope: text(),
    },
    access: schemaAccessConfig({
      isAuthed: true,
      operations: {
        all: SchemaAccessTemplate.allow,
      },
      filter: {
        all: userOwnershipCheck(),
      },
    }),
  }),
  AIKey: list({
    fields: {
      user: relationship({ ref: "User.aiKey", many: false }),
      openapiKey: text(),
    },
    access: schemaAccessConfig({
      isAuthed: true,
      operations: {
        all: SchemaAccessTemplate.allow,
      },
      filter: {
        all: userOwnershipCheck(),
      },
    }),
  }),
};
