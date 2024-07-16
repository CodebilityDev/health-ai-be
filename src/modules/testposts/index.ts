import { Module } from "~/lib/modules/declarations";
import { postDataList } from "./schema";

export const postDefiniton = new Module({
  schema: [postDataList],
  graphqlExtensions: [],
  restExtensions: [],
});
