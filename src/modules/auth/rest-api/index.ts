import { z } from "zod";
import { LoginDocument } from "~/common/graphql-types";
import {
  RouteDeclarationList,
  RouteDeclarationMetadata,
} from "~/lib/rest/declarations";
import { RequestInputType, RouteMethod } from "~/lib/rest/types";

const authRouteDeclaration = new RouteDeclarationList({
  path: "/auth",
});

authRouteDeclaration.routes.set(
  "/signin",
  new RouteDeclarationMetadata({
    method: RouteMethod.POST,
    inputParser: z.object({
      [RequestInputType.BODY]: z.object({
        username: z.string(),
        password: z.string(),
      }),
    }),
    outputParser: z.object({
      token: z.string(),
    }),
    func: async ({
      context: { graphql },
      inputData: {
        [RequestInputType.BODY]: { username, password },
      },
      res,
    }) => {
      const request = await graphql.run({
        query: LoginDocument,
        variables: {
          email: username as string,
          password: password as string,
        },
      });

      if (
        request.authenticateUserWithPassword?.__typename ==
        "UserAuthenticationWithPasswordSuccess"
      ) {
        return {
          token: request.authenticateUserWithPassword.sessionToken,
        };
      } else {
        res.status(401).json({
          error: "Invalid credentials",
        });
        return;
      }
    },
  }),
);

export { authRouteDeclaration };
