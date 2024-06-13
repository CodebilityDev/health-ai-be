import { GraphqlActionArgs } from "../types";

const hasRole =
  (args: { roles: string[] }) => (operation: GraphqlActionArgs) => {
    return args.roles.includes(
      operation.context.session?.data?.role ?? "xxnorolexx",
    );
  };

export const GraphqlAccessTemplate = {
  hasRole,
};
