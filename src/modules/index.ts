import { Module } from "~/lib/modules/declarations";
import { authDefinition } from "./auth";
import { ServerHealth } from "./health";
import { postDefiniton } from "./posts";
import { testDefinition } from "./test";

export const moduleDefinitions: Module[] = [
  ServerHealth,
  authDefinition,
  postDefiniton,
  testDefinition,
];
