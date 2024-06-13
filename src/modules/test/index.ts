import { Module } from "~/lib/modules/declarations";
import { testGraphqlDeclarations } from "./graphql-subs";
import { postSocketDeclaration } from "./socket";

export const testDefinition = new Module({
  schema: [],
  graphqlExtensions: [testGraphqlDeclarations],
  restExtensions: [],
  socketExtensions: [postSocketDeclaration],
});
