import { Module } from "~/lib/modules/declarations";
import { healthRouteDeclaration } from "./rest";

export const ServerHealth = new Module({
  schema: [],
  graphqlExtensions: [],
  restExtensions: [healthRouteDeclaration],
});
