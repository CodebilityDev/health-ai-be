import { Module } from "~/lib/modules/declarations";
import { chatgptRouteDeclaration } from "./rest";
import { chataiDataList } from "./schema";

export const ChatAI = new Module({
  schema: [chataiDataList],
  graphqlExtensions: [],
  restExtensions: [chatgptRouteDeclaration],
});
