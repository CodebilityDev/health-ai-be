import { Module } from "~/lib/modules/declarations";
import { ghAPIGqlDeclaration } from "./graphql";
import { ghlRouteDeclaration } from "./rest";
import { ghlSchema } from "./schema";

export const GHL = new Module({
  schema: [ghlSchema],
  graphqlExtensions: [ghAPIGqlDeclaration],
  restExtensions: [ghlRouteDeclaration],
});
