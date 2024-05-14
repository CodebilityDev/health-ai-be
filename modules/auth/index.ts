import { ModuleDefinition } from "../definition";
import { clientAuthGraphqlExtension } from "./graphql";
import { authRouteDeclaration } from "./rest-api";
import { userDataList } from "./schema";
import { authSocketDeclaration } from "./socket";

export const authDefinition: ModuleDefinition = {
  schema: [userDataList],
  graphqlExtensions: [clientAuthGraphqlExtension],
  restExtensions: [authRouteDeclaration],
  socketExtensions: [authSocketDeclaration],
};
