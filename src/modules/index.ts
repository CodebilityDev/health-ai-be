import { Module } from "~/lib/modules/declarations";
import { authDefinition } from "./auth";
import { Bots } from "./botconfig";
import { ChatAI } from "./chatai";
import { GHL } from "./gohighlevel";
import { GHL_Welcome } from "./gohighlevel-welcome";
import { groupDefiniton } from "./group";
import { ServerHealth } from "./serverhealth";
import { ServerLogging } from "./serverlogging";
import { SMSQueueDeclaration } from "./sms-queue";

export const moduleDefinitions: Module[] = [
  ServerHealth,
  ServerLogging,
  authDefinition,
  groupDefiniton,
  // postDefiniton,
  // testDefinition,
  Bots,
  GHL,
  ChatAI,
  GHL_Welcome,
  SMSQueueDeclaration,
];
