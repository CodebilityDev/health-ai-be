import { list } from "@keystone-6/core";
import { text, timestamp } from "@keystone-6/core/fields";
import { Module } from "~/lib/modules/declarations";
import { schemaAccessConfig } from "~/lib/schema/access";
import { SchemaAccessTemplate } from "~/lib/schema/access/templates";
import { responseAnalyticsRouteDeclaration } from "./api";
import { loggingGqlDeclaration } from "./gql";

export const ServerLogging = new Module({
  schema: [
    {
      ServerLog: list({
        fields: {
          method: text(),
          url: text(),
          status: text(),
          elapsed: text(),
          graphql: text(),
          userID: text(),
          errorMessage: text(),
          createdAt: timestamp({
            defaultValue: {
              kind: "now",
            },
          }),
        },
        access: schemaAccessConfig({
          isAuthed: true,
          operations: {
            all: SchemaAccessTemplate.deny,
          },
          filter: {
            all: SchemaAccessTemplate.deny,
          },
        }),
      }),
      ServerError: list({
        fields: {
          method: text(),
          url: text(),
          status: text(),
          graphql: text(),
          userID: text(),
          errorMessage: text(),
          createdAt: timestamp({
            defaultValue: {
              kind: "now",
            },
          }),
        },
        access: schemaAccessConfig({
          isAuthed: true,
          operations: {
            all: SchemaAccessTemplate.deny,
          },
          filter: {
            all: SchemaAccessTemplate.deny,
          },
        }),
      }),
    },
  ],
  graphqlExtensions: [loggingGqlDeclaration],
  restExtensions: [responseAnalyticsRouteDeclaration],
});
