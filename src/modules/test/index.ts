import { ModuleDefinition } from "../definition";
import { testGraphqlDeclarations } from "./graphql-subs";
import { postSocketDeclaration } from "./socket";

export const testDefinition: ModuleDefinition = {
  schema: [],
  graphqlExtensions: [testGraphqlDeclarations],
  restExtensions: [],
  socketExtensions: [postSocketDeclaration],
};
