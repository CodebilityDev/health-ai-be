import { Module } from "~/lib/modules/declarations";
import { messageQueueGqlDeclaration } from "./graphql";
import { smsQueueWorker } from "./worker";

export const SMSQueueDeclaration = new Module({
  graphqlExtensions: [messageQueueGqlDeclaration],
  queueDeclarations: [smsQueueWorker],
});
