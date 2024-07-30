import { Module } from "~/lib/modules/declarations";
import { groupDataList } from "./schema";

export const groupDefiniton = new Module({
  schema: [groupDataList],
  graphqlExtensions: [],
  restExtensions: [],
});
