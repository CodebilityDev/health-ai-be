import { UserRoleType } from "~graphql/operations";
import { ServerOperationArgs } from "../types";
import { ServerAccessConfigBuilder } from "./types";

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
