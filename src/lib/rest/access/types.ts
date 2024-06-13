import { ServerOperationArgs } from "~/lib/rest/types";

export type ServerAccessFunction = (operation: ServerOperationArgs) => boolean;

export type ServerAccessConfigBuilder = (generatorArgs: {
  superAccess?: string[];
  conditions?: ((operation: ServerOperationArgs) => boolean)[];
}) => ServerAccessFunction;
