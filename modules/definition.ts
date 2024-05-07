import type { Lists } from ".keystone/types";
import type { GraphQLSchema } from "graphql/type/schema";
import { RouteDeclarationList } from "../server/declarations";

export interface ModuleDefinition {
  schema: Lists[];
  graphqlExtensions: ((schema: GraphQLSchema) => GraphQLSchema)[];
  restExtensions: RouteDeclarationList[];
}
