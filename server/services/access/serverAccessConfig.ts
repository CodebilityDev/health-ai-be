import { UserRoleType } from "../../../graphql/operations";
import { ServerOperationArgs } from "../../declarations";

export type ServerAccessFunction = (operation: ServerOperationArgs) => boolean;

export type ServerAccessConfigBuilder = (generatorArgs: {
  superAccess?: string[];
  conditions?: ((operation: ServerOperationArgs) => boolean)[];
}) => ServerAccessFunction;

export const serverAccessConfig: ServerAccessConfigBuilder = (
  generatorArgs,
) => {
  const globalMiddleware = (operation: ServerOperationArgs) => {
    if (!operation.session) {
      throw new Error("Not Authenticated");
    }

    if (!operation.context.session?.itemId) {
      throw new Error("Not Authenticated");
    }

    const superAccessRoles = [
      ...(generatorArgs.superAccess || []),
      UserRoleType.Dev,
    ];
    // check for dev super user
    if (superAccessRoles.includes(operation.session.data.role)) {
      return true;
    }

    return false;
  };

  return (operation) => {
    let isAllowed = false;

    // global middleware is to take precedence
    isAllowed = isAllowed || globalMiddleware(operation);

    for (const condition of generatorArgs.conditions || []) {
      if (isAllowed) {
        isAllowed = isAllowed || condition(operation);
      }

      if (!isAllowed) {
        break;
      }
    }

    return isAllowed;
  };
};

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
