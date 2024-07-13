import { Module } from "~/lib/modules/declarations";
import { clientAuthGraphqlExtension } from "./graphql";
import { authRouteDeclaration } from "./rest-api";
import { userDataList } from "./schema";

export const authDefinition = new Module({
  schema: [userDataList],
  graphqlExtensions: [clientAuthGraphqlExtension],
  restExtensions: [authRouteDeclaration],
});
