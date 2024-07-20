import { Module } from "~/lib/modules/declarations";
import { ghWelcomeAPIGqlDeclaration } from "./graphql";
import { ghlWelcomeRouteDeclaration } from "./rest";

export const GHL_Welcome = new Module({
  schema: [],
  graphqlExtensions: [ghWelcomeAPIGqlDeclaration],
  restExtensions: [ghlWelcomeRouteDeclaration],
});
