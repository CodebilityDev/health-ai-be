import { UserRoleType } from "~/common/graphql-types";
import { GraphqlActionAccessConfigBuilder, GraphqlActionArgs } from "../types";

export const graphqlAccessConfig: GraphqlActionAccessConfigBuilder = (
  generatorArgs,
) => {
  const globalMiddleware = (operation: GraphqlActionArgs) => {
    if (!operation.context.session) {
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
    if (superAccessRoles.includes(operation.context.session.data.role)) {
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
