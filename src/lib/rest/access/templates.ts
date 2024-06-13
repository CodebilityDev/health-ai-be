import { ServerOperationArgs } from "../types";

const hasRole =
  (args: { roles: string[] }) => (operation: ServerOperationArgs) => {
    // console.log(operation.session?.data?.role);
    return args.roles.includes(operation.session?.data?.role ?? "xxnorolexx");
  };

export const RestAccessTemplate = {
  hasRole,
};
