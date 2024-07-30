import { Module } from "~/lib/modules/declarations";
import { smsQueueWorker } from "./worker";

export const SMSQueueDeclaration = new Module({
  queueDeclarations: [smsQueueWorker],
});
