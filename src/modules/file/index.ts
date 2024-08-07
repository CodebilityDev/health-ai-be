import { Module } from "~/lib/modules/declarations";
import { fileGQLDeclaration } from "./graphql";

export const fileDefinition = new Module({
  schema: [],
  graphqlExtensions: [fileGQLDeclaration],
  restExtensions: [],
});
