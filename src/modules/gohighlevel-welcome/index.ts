import { Module } from "~/lib/modules/declarations";
import { ghlWelcomeRouteDeclaration } from "./rest";

export const GHL_Welcome = new Module({
  schema: [],
  graphqlExtensions: [],
  restExtensions: [ghlWelcomeRouteDeclaration],
});
