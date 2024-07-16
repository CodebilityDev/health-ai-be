import { Module } from "~/lib/modules/declarations";
import { authDefinition } from "./auth";
import { Bots } from "./botconfig";
import { ChatAI } from "./chatai";
import { GHL } from "./gohighlevel";
import { ServerHealth } from "./serverhealth";
import { ServerLogging } from "./serverlogging";

export const moduleDefinitions: Module[] = [
  ServerHealth,
  ServerLogging,
  authDefinition,
  // postDefiniton,
  // testDefinition,
  Bots,
  GHL,
  ChatAI,
];
