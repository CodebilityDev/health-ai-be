import { Context } from ".keystone/types";
import { graphql } from "@keystone-6/core";
import { ModuleDefinition } from "../definition";

export const testDefinition: ModuleDefinition = {
  schema: [],
  graphqlExtensions: [
    graphql.extend((base) => {
      return {
        query: {
          test: graphql.field({
            type: graphql.String,
            resolve() {
              return "Hello world!";
            },
          }),
        },
        mutation: {
          test: graphql.field({
            type: graphql.String,
            args: {
              email: graphql.arg({ type: graphql.String }),
            },
            async resolve(source, { email }, context: Context) {
              const user = await context.db.User.findOne({
                where: {
                  email: email,
                },
              });
              return `Hello ${user?.name}!`;
            },
          }),
        },
      };
    }),
  ],
  restExtensions: [],
};
