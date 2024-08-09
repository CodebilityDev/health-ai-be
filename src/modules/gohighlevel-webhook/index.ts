import { Module } from "~/lib/modules/declarations";
import { ghlWebhookRouteDeclaration } from "./rest";

export const GHL_Webhook = new Module({
  schema: [],
  graphqlExtensions: [],
  restExtensions: [ghlWebhookRouteDeclaration],
});
