import { allOperations, denyAll } from "@keystone-6/core/access";
import { z } from "zod";
import { ACCESS_LEVELS, GlobalContext } from "~/common/context";
import { ItemArgs, OperationArgs } from "./types";

const hasRole =
  <N = any, O = any>(args: { roles: string[] }) =>
  (operation: OperationArgs | ItemArgs<N, O>) => {
    return args.roles.includes(operation.session?.data?.role);
  };

const isOwner =
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

const validateInput =
  <N = any, O = any>(args: { validator: z.ZodObject<any> }) =>
  (operation: ItemArgs<N, O>) => {
    const validateResult = args.validator.safeParse(operation.inputData);

    if (validateResult.success) {
      return true;
    }

    return false;
  };

const sequential =
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

const allow = () => true;

const deny = () => false;

const checkRole = (role: string, allowedRoles: string[]) => {
  return allowedRoles.includes(role);
};

const memberhipCheckString = (
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

const groupMemberKeymap = {
  accessKey: "access",
  tableKey: "members",
  userKey: "user",
  userIdKey: "id",
  type: "user",
};

const quickMembershipCheck =
  (fargs?: { level?: number; nest?: (base: any) => any }) =>
  (args: { context: GlobalContext }) => {
    if (fargs?.nest)
      return fargs.nest({
        group: {
          OR: [
            memberhipCheckString(
              {
                type: "user",
                userId: args.context.session?.itemId,
                permissionLevel: fargs?.level ?? ACCESS_LEVELS.VIEW,
              },
              groupMemberKeymap,
            ),
          ],
        },
      });
    return {
      group: {
        OR: [
          memberhipCheckString(
            {
              type: "user",
              userId: args.context.session?.itemId,
              permissionLevel: fargs?.level ?? ACCESS_LEVELS.VIEW,
            },
            groupMemberKeymap,
          ),
        ],
      },
    };
  };

const deniedAll = {
  operation: {
    ...allOperations(denyAll),
  },
  filter: {
    ...allOperations(denyAll),
  },
  item: {
    ...allOperations(denyAll),
  },
};

export const SchemaAccessTemplate = {
  hasRole,
  isOwner,
  validateInput,
  sequential,
  allow,
  deny,
  checkRole,
  memberhipCheckString,
  groupMemberKeymap,
  quickMembershipCheck,
  deniedAll,
};
