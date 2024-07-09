import { Module } from "~/lib/modules/declarations";
import { botDataList } from "./schema";

export const Bots = new Module({
  schema: [botDataList],
  graphqlExtensions: [],
  restExtensions: [],
});
