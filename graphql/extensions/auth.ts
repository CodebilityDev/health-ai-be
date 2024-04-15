import { graphql } from "@keystone-6/core";
import { BaseItem } from "@keystone-6/core/types";
import { GlobalContext } from "../../common/types";
import { authenticateUser } from "../../server/services/auth/login";
import {
  changePassword,
  requestResetPassword,
  resetPassword,
  resetPasswordForNewUser,
} from "../../server/services/auth/reset_password";

const gqlNames = {
  ItemAuthenticationWithPasswordSuccess:
    "ClientItemAuthenticationWithPasswordSuccess",
  ItemAuthenticationWithPasswordFailure:
    "ClientItemAuthenticationWithPasswordFailure",
  ItemAuthenticationWithPasswordResult:
    "ClientItemAuthenticationWithPasswordResult",
};
const listKey = "User";
const identityField = "email";
const secretField = "password";

export const clientAuthGraphqlExtension = graphql.extend((base) => {
  const ItemAuthenticationWithPasswordSuccess = graphql.object<{
    sessionToken: string;
    item: BaseItem;
  }>()({
    name: gqlNames.ItemAuthenticationWithPasswordSuccess,
    fields: {
      sessionToken: graphql.field({ type: graphql.nonNull(graphql.String) }),
      item: graphql.field({ type: graphql.nonNull(base.object(listKey)) }),
    },
  });
  const ItemAuthenticationWithPasswordFailure = graphql.object<{
    message: string;
  }>()({
    name: gqlNames.ItemAuthenticationWithPasswordFailure,
    fields: {
      message: graphql.field({ type: graphql.nonNull(graphql.String) }),
    },
  });

  const AuthenticationResult = graphql.union({
    name: gqlNames.ItemAuthenticationWithPasswordResult,
    types: [
      ItemAuthenticationWithPasswordSuccess,
      ItemAuthenticationWithPasswordFailure,
    ],
    resolveType(val) {
      if ("sessionToken" in val) {
        return gqlNames.ItemAuthenticationWithPasswordSuccess;
      }
      return gqlNames.ItemAuthenticationWithPasswordFailure;
    },
  });
  return {
    mutation: {
      authclient_login: graphql.field({
        type: AuthenticationResult,
        args: {
          [identityField]: graphql.arg({
            type: graphql.nonNull(graphql.String),
          }),
          [secretField]: graphql.arg({ type: graphql.nonNull(graphql.String) }),
        },
        async resolve(
          _,
          { [identityField]: identity, [secretField]: secret },
          context: GlobalContext,
        ) {
          if (!context.sessionStrategy) {
            throw new Error("No session implementation available on context");
          }

          const user = await context.prisma.user.findUnique({
            where: { [identityField]: identity },
          });

          if (!user) {
            return { code: "FAILURE", message: "Authentication failed." };
          }

          const verifyResult = await authenticateUser(
            {
              email: identity,
              password: secret,
            },
            context,
          );

          if (!verifyResult) {
            return { code: "FAILURE", message: "Authentication failed." };
          }

          // Create session token
          const sessionToken = await context.sessionStrategy.start({
            data: {
              listKey: "User",
              itemId: verifyResult.id,
              data: {
                role: verifyResult.role,
                id: verifyResult.id,
                name: verifyResult.name,
                createdAt: verifyResult.createdAt.toISOString(),
              },
            },
            context,
          });

          // return Failure if sessionStrategy.start() returns null
          if (typeof sessionToken !== "string" || sessionToken.length === 0) {
            return { code: "FAILURE", message: "Failed to start session." };
          }

          return { sessionToken, item: user };
        },
      }),
      authclient_requestPasswordReset: graphql.field({
        type: graphql.Boolean,
        args: {
          email: graphql.arg({ type: graphql.nonNull(graphql.String) }),
        },
        async resolve(_, { email }, context: GlobalContext) {
          // Call the appropriate service function
          try {
            await requestResetPassword(email, "1h", context);
            return true;
          } catch (e) {
            console.error(e);
            return false;
          }
        },
      }),
      authclient_newAccountPasswordReset: graphql.field({
        type: graphql.Boolean,
        args: {
          email: graphql.arg({ type: graphql.nonNull(graphql.String) }),
        },
        async resolve(_, { email }, context: GlobalContext) {
          // Call the appropriate service function
          try {
            await resetPasswordForNewUser(
              {
                email,
              },
              context,
            );
            return true;
          } catch (e) {
            console.error(e);
            return false;
          }
        },
      }),
      authclient_resetPassword: graphql.field({
        type: graphql.Boolean,
        args: {
          token: graphql.arg({ type: graphql.nonNull(graphql.String) }),
          password: graphql.arg({ type: graphql.nonNull(graphql.String) }),
        },
        async resolve(_, { token, password }, context: GlobalContext) {
          // Call the appropriate service function
          try {
            // await resetPasswordForNewUser({ email, token, password }, context);
            await resetPassword(token, password, context);
            return true;
          } catch (e) {
            console.error(e);
            return false;
          }
        },
      }),
      authclient_changePassword: graphql.field({
        type: graphql.Boolean,
        args: {
          oldPassword: graphql.arg({ type: graphql.nonNull(graphql.String) }),
          newPassword: graphql.arg({ type: graphql.nonNull(graphql.String) }),
        },
        async resolve(_, { oldPassword, newPassword }, context: GlobalContext) {
          // Call the appropriate service function
          try {
            // console.log(
            //   await context.
            // );
            if (!context.session?.data.id) throw new Error("No user session");
            await changePassword(
              {
                id: context.session?.data.id,
              },
              {
                oldPassword,
                newPassword,
              },
              context,
            );
            return true;
          } catch (e) {
            console.error(e);
            return false;
          }
        },
      }),
    },
  };
});
