import { Module } from "~/lib/modules/declarations";
import { authDefinition } from "./auth";
import { Bots } from "./bot";
import { ServerHealth } from "./health";
import { ServerLogging } from "./logging";

export const moduleDefinitions: Module[] = [
  ServerHealth,
  ServerLogging,
  authDefinition,
  // postDefiniton,
  // testDefinition,
  Bots,
];
