import type { Lists } from ".keystone/types";
import { graphql, list } from "@keystone-6/core";
import { denyAll } from "@keystone-6/core/access";
import {
  image,
  password,
  relationship,
  select,
  text,
  timestamp,
  virtual,
} from "@keystone-6/core/fields";
import { z } from "zod";
import { accessConfig } from "../common/access/definitions/access";
import {
  allow,
  checkRole,
  hasRole,
  isOwner,
  sequential,
} from "../common/access/definitions/templates";
import { PERMISSION_ENUM } from "../common/roles";
import { GlobalContext } from "../common/types";
import { s3ImageConfigKey } from "../imageConfig";
import { resetPasswordForNewUser } from "../server/services/auth/reset_password";

export const userDataList: Lists = {
  User: list({
    fields: {
      name: text({ validation: { isRequired: true } }),
      lastName: text(),
      displayName: virtual({
        field: graphql.field({
          type: graphql.String,
          async resolve(item, {}, context: GlobalContext) {
            return `${item.name} ${item.lastName}`.trim();
          },
        }),
      }),
      email: text({
        validation: { isRequired: true },
        isIndexed: "unique",
        // hooks: {
        //   resolveInput: async ({ inputData }) => {
        //     if (!inputData.email) {
        //       return `user-${Math.random().toString(36).substring(7)}@client`;
        //     }
        //     return inputData.email;
        //   },
        // },
      }),
      adminPassword: password({
        validation: { isRequired: false },
        hooks: {
          validateInput: async ({
            resolvedData,
            context,
            addValidationError,
          }) => {
            const role = context?.session?.data?.role;

            if (!resolvedData.adminPassword) {
              return;
            }

            if (checkRole(role, [PERMISSION_ENUM.DEV])) {
              return;
            }

            const userCount = await context.query.User.count({});

            if (userCount == 0) {
              return;
            }

            addValidationError("You are not allowed to modify this");
          },
        },
      }),
      localAuth: relationship({
        ref: "UserLocalAuth.user",
        many: false,
        access: denyAll,
      }),
      avatar: image({
        storage: s3ImageConfigKey,
      }),
      role: select({
        type: "enum",
        options: [
          { label: "Dev", value: PERMISSION_ENUM.DEV },
          { label: "Admin", value: PERMISSION_ENUM.ADMIN },
          { label: "User", value: PERMISSION_ENUM.USER },
        ],
        defaultValue: PERMISSION_ENUM.USER,
        hooks: {
          validateInput: async ({
            resolvedData,
            context,
            addValidationError,
          }) => {
            const role = context?.session?.data?.role;
            const selectedRole = resolvedData?.role?.toString() ?? "";

            if (!selectedRole) {
              return;
            }

            if (checkRole(role, [PERMISSION_ENUM.DEV])) {
              return;
            }

            if (
              checkRole(role, [PERMISSION_ENUM.DEV]) &&
              checkRole(selectedRole, [PERMISSION_ENUM.DEV])
            ) {
              return;
            }

            if (
              checkRole(role, [PERMISSION_ENUM.ADMIN]) &&
              !checkRole(selectedRole, [PERMISSION_ENUM.DEV])
            ) {
              return;
            }

            const userCount = await context.query.User.count({});

            if (userCount == 0) {
              return;
            }

            addValidationError("You are not allowed to change the role");
          },
        },
      }),
      groups: relationship({
        ref: "Group.members",
        many: true,
      }),
      posts: relationship({
        ref: "Post.author",
        many: true,
      }),
      createdAt: timestamp({
        defaultValue: { kind: "now" },
      }),
    },
    access: accessConfig({
      isAuthed: true,
      // superAccess: [PERMISSION_ENUM.ADMIN],
      operations: {
        read: allow,
        write: hasRole({ roles: [PERMISSION_ENUM.ADMIN] }),
        update: allow,
      },
      filter: {
        read: allow,
        write: sequential([
          hasRole({ roles: [PERMISSION_ENUM.ADMIN] }),
          isOwner(),
        ]),
      },
    }),
    hooks: {
      validateDelete: async ({ item, context, addValidationError }) => {
        // if user is the only user, do not allow delete
        const userCount = await context.query.User.count({});

        if (userCount == 1) {
          return addValidationError("You cannot delete the only user");
        }

        const userRole = context.session?.data?.role;

        if (!userRole) {
          return addValidationError("You are not allowed to delete this");
        }

        if (checkRole(userRole, [PERMISSION_ENUM.DEV])) {
          return;
        }

        // if existingItem is dev, do not allow delete
        if (item.role === PERMISSION_ENUM.DEV) {
          return addValidationError("You are not allowed to delete this");
        }
      },
      afterOperation: async ({ operation, context, item }) => {
        if (operation === "create") {
          if (!item.role) return;
          const check = z.string().email().safeParse(item.email);

          if (!check.success) {
            return;
          }

          if (checkRole(item.role, [PERMISSION_ENUM.DEV])) {
            return;
          }

          await resetPasswordForNewUser(
            {
              email: item.email,
            },
            context,
          );
          console.log(`[System] Reset password for new user: ${item.email}`);
        }
      },
    },
  }),
  UserLocalAuth: list({
    fields: {
      password: text(),
      twoFaEmail: text(),
      twoFaEmailSecret: text(),
      twoFaEmailLastSent: timestamp(),
      user: relationship({
        ref: "User.localAuth",
        many: false,
      }),
    },
    access: denyAll,
    graphql: {
      omit: true,
    },
  }),
  Group: list({
    fields: {
      name: text({ validation: { isRequired: true } }),
      members: relationship({
        ref: "User.groups",
        many: true,
      }),
    },
    access: accessConfig({
      isAuthed: true,
      operations: {
        all: allow,
      },
      filter: {
        all: allow,
      },
    }),
  }),
};
