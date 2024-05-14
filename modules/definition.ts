import type { Lists } from ".keystone/types";
import type { GraphQLSchema } from "graphql/type/schema";
import {
  RouteDeclarationList,
  SocketDeclarationList,
} from "../server/declarations";

export interface ModuleDefinition {
  schema: Lists[];
  graphqlExtensions: ((schema: GraphQLSchema) => GraphQLSchema)[];
  restExtensions: RouteDeclarationList[];
  socketExtensions?: SocketDeclarationList[];
}
