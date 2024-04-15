import { z } from "zod";
import { ItemArgs, OperationArgs } from "./templates.type";

export const hasRole =
  <N = any, O = any>(args: { roles: string[] }) =>
  (operation: OperationArgs | ItemArgs<N, O>) => {
    return args.roles.includes(operation.session?.data?.role);
  };

export const isOwner =
  <N = any, O = any>(args?: { itemIDKey?: string }) =>
  (operation: ItemArgs<N, O>) => {
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

export const validateInput =
  <N = any, O = any>(args: { validator: z.ZodObject<any> }) =>
  (operation: ItemArgs<N, O>) => {
    const validateResult = args.validator.safeParse(operation.inputData);

    if (validateResult.success) {
      return true;
    }

    return false;
  };

export const sequential =
  <N = any, O = any>(
    checkers: ((operation: ItemArgs<N, O>) => boolean | Record<string, any>)[],
  ) =>
  (operation: ItemArgs<N, O>) => {
    for (let checker of checkers) {
      const check = checker(operation);
      if (check) {
        return check;
      }
    }
    return false;
  };

export const allow = () => true;

export const deny = () => false;

export const checkRole = (role: string, allowedRoles: string[]) => {
  return allowedRoles.includes(role);
};

export const memberhipCheckString = (
  check: {
    userId?: string;
    permissionLevel?: number;
    type: "user" | "group" | "public" | string;
  },
  args: {
    tableKey: string;
    userKey: string;
    userIdKey: string;
    accessKey: string;
  },
) => {
  switch (check.type) {
    case "user": {
      return {
        [args.tableKey]: {
          some: {
            [args.userKey]: {
              [args.userIdKey]: {
                equals: check.userId,
              },
            },
            [args.accessKey]: {
              gte: check.permissionLevel,
            },
          },
        },
      };
    }
    case "public": {
      return {
        members: {
          some: {
            isPublic: {
              equals: true,
            },
            access: {
              gte: check.permissionLevel,
            },
          },
        },
      };
    }
  }
};
