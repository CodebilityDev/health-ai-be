import { ImageExtension } from "@keystone-6/core/types";
import { z } from "zod";
import { PERMISSION_ENUM } from "~/common/roles";
import { s3ImageConfigKey } from "~/imageConfig";
import { LoginDocument } from "~graphql/operations";
import {
  FILE_TYPE,
  NO_INPUT,
  RequestInputType,
  RouteDeclarationList,
  RouteDeclarationMetadata,
  RouteMethod,
} from "../../../server/declarations";
import {
  hasRole,
  serverAccessConfig,
} from "../../../server/services/access/serverAccessConfig";

const authRouteDeclaration: RouteDeclarationList = {
  name: "/auth",
  routes: new Map(),
};

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

authRouteDeclaration.routes.set(
  "/test/:id/:id2",
  new RouteDeclarationMetadata({
    method: RouteMethod.GET,
    accessConfig: serverAccessConfig({
      conditions: [hasRole({ roles: [PERMISSION_ENUM.ADMIN] })],
    }),
    inputParser: z.object({
      [RequestInputType.PARAMS]: z.object({
        id: z.preprocess((val: any) => parseInt(val), z.number()),
        id2: z.preprocess((val: any) => parseInt(val), z.number()),
      }),
      [RequestInputType.QUERY]: z.object({
        name: z.string(),
      }),
      [RequestInputType.HEADERS]: z.object({
        whoosh: z.string().default("whoosh"),
      }),
    }),

    func: async ({ inputData, res }) => {
      return inputData;
    },
  }),
);

authRouteDeclaration.routes.set(
  "/profile_picture",
  new RouteDeclarationMetadata({
    method: RouteMethod.GET,
    accessConfig: serverAccessConfig({}),
    inputParser: NO_INPUT,
    func: async ({ context: { session, prisma, images }, res }) => {
      const user = await prisma.user.findUnique({
        where: {
          id: session?.data?.id,
        },
      });

      if (!user) {
        return res.status(404).json({
          error: "User not found",
        });
      }

      if (!user.avatar_id || !user.avatar_extension) {
        return res.status(404).json({
          error: "Profile picture not found",
        });
      }

      const image = await images(s3ImageConfigKey).getUrl(
        user.avatar_id,
        user.avatar_extension as ImageExtension,
      );

      return {
        session,
        image: image,
      };
    },
  }),
);

authRouteDeclaration.routes.set(
  "/file_upload",
  new RouteDeclarationMetadata({
    method: RouteMethod.POST,
    useJsonParser: false,
    useFileParser: true,
    inputParser: z.object({
      [RequestInputType.FILES]: z.object({
        file: FILE_TYPE,
      }),
      [RequestInputType.BODY]: z.object({
        index: z.string(),
      }),
    }),
    func: async ({
      inputData: {
        body: { index },
        files: { file },
      },
      context,
    }) => {
      return {
        message: "File uploaded",
      };
    },
  }),
);

export { authRouteDeclaration };
