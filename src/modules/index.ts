import { Module } from "~/lib/modules/declarations";
import { authDefinition } from "./auth";
import { ServerHealth } from "./health";
import { ServerLogging } from "./logging";

export const moduleDefinitions: Module[] = [
  ServerHealth,
  authDefinition,
  // postDefiniton,
  // testDefinition,
  ServerLogging,
];
