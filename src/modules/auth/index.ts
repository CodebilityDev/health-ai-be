import { ModuleDefinition } from "~modules/definition";
import { clientAuthGraphqlExtension } from "./graphql";
import { authRouteDeclaration } from "./rest-api";
import { userDataList } from "./schema";

export const authDefinition: ModuleDefinition = {
  schema: [userDataList],
  graphqlExtensions: [clientAuthGraphqlExtension],
  restExtensions: [authRouteDeclaration],
};
