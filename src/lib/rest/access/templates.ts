import { ServerOperationArgs } from "../types";

export const hasRole =
  (args: { roles: string[] }) => (operation: ServerOperationArgs) => {
    console.log(operation.session?.data?.role);
    return args.roles.includes(operation.session?.data?.role ?? "xxnorolexx");
  };

export const isOwner =
  (args?: { itemIDKey?: string }) => (operation: ServerOperationArgs) => {
    const userID = operation.session?.data?.id;

    if (!userID) {
      return false;
    }

    return {
      [args?.itemIDKey || "id"]: {
        equals: userID,
      },
    };
  };
