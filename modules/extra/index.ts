import { ModuleDefinition } from "../definition";
import { postSocketDeclaration } from "./socket";

export const extraDefiniton: ModuleDefinition = {
  schema: [],
  graphqlExtensions: [],
  restExtensions: [],
  socketExtensions: [postSocketDeclaration],
};
