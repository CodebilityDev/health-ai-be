import { ServerOperationArgs } from "../types";

const hasRole =
  (args: { roles: string[] }) => (operation: ServerOperationArgs) => {
    // console.log(operation.session?.data?.role);
    return args.roles.includes(operation.session?.data?.role ?? "xxnorolexx");
  };

const isLoggedIn = (operation: ServerOperationArgs) => {
  return !!operation.session?.data;
};

export const RestAccessTemplate = {
  hasRole,
  isLoggedIn,
};
