import { GraphqlActionArgs } from "../types";

const hasRole =
  (args: { roles: string[] }) => (operation: GraphqlActionArgs) => {
    return args.roles.includes(
      operation.context.session?.data?.role ?? "xxnorolexx",
    );
  };

const isLoggedIn = (operation: GraphqlActionArgs) => {
  return !!operation.context.session?.data;
};

export const GraphqlAccessTemplate = {
  hasRole,
  isLoggedIn,
};
