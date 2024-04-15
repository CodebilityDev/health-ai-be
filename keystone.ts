import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { config } from "@keystone-6/core";
import { z } from "zod";

extendZodWithOpenApi(z);

import { session, withAuth } from "./auth";
import { GlobalTypeInfo } from "./common/types";
import dbConfig from "./dbConfig";
import s3FilesStorageConfig, { s3FilesConfigKey } from "./fileConfig";
import { boostrapGraphqlExtensions } from "./graphql/extensions";
import s3ImageStorageConfig, { s3ImageConfigKey } from "./imageConfig";
import { lists } from "./schema";
import bootstrapExpress from "./server";
import { CONFIG } from "./utils/config/env";

const keystoneConfig = config<GlobalTypeInfo>({
  db: dbConfig,
  lists,
  session,
  graphql: {
    playground: CONFIG.GRAPHQL_INSTROSPECTION === "true",
    apolloConfig: {
      introspection: CONFIG.GRAPHQL_INSTROSPECTION === "true",
      // WARN: This is a security risk, should be configured properly, but cant be done in this project
      csrfPrevention: false,
    },
  },
  server: {
    cors: {
      origin: CONFIG.SERVER_CORS_URL.split(","),
      // secure: true,
    },
    extendExpressApp: bootstrapExpress,
  },
  extendGraphqlSchema: boostrapGraphqlExtensions,
  storage: {
    [s3FilesConfigKey]: s3FilesStorageConfig,
    [s3ImageConfigKey]: s3ImageStorageConfig,
  },
});

export default withAuth(keystoneConfig);
