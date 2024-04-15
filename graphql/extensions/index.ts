import type { GraphQLSchema } from "graphql/type/schema";
import { clientAuthGraphqlExtension } from "./auth";
import { testGraphqlExtension } from "./test";

export function boostrapGraphqlExtensions(schema: GraphQLSchema) {
  let _schema = schema;
  const extensionList = [testGraphqlExtension, clientAuthGraphqlExtension];

  extensionList.forEach((extension) => {
    _schema = extension(_schema);
  });

  return _schema;
}
