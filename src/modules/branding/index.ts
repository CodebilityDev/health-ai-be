import { Module } from "~/lib/modules/declarations";
import { brandingDataList } from "./schema";

export const Branding = new Module({
  schema: [brandingDataList],
  graphqlExtensions: [],
  restExtensions: [],
});
