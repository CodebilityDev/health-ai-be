import { Module } from "~/lib/modules/declarations";
import { authDefinition } from "./auth";
import { Bots } from "./botconfig";
import { Branding } from "./branding";
import { ChatAI } from "./chatai";
import { fileDefinition } from "./file";
import { GHL } from "./gohighlevel";
import { GHL_Webhook } from "./gohighlevel-webhook";
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
  GHL_Webhook,
  SMSQueueDeclaration,
  Branding,
  fileDefinition,
];
