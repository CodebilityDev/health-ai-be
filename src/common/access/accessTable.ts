import { ACCESS_LEVELS } from "../roles";
import { GlobalContext } from "../types";
import { memberhipCheckString } from "./definitions/templates";

export const groupMemberKeymap = {
  accessKey: "access",
  tableKey: "members",
  userKey: "user",
  userIdKey: "id",
  type: "user",
};

export const quickMembershipCheck =
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
