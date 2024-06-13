import responseCachePlugin from "@apollo/server-plugin-response-cache";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { config } from "@keystone-6/core";
import { z } from "zod";

extendZodWithOpenApi(z);

import { GlobalTypeInfo } from "~/common/context";
import { CONFIG } from "~/common/env";
import { session, withAuth } from "~/config/authConfig";
import dbConfig from "~/config/dbConfig";
import s3FilesStorageConfig, { s3FilesConfigKey } from "~/config/fileConfig";
import s3ImageStorageConfig, { s3ImageConfigKey } from "~/config/imageConfig";

// update package.json time

import * as fs from "fs";
import * as path from "path";
import { MEM_CACHE_INSTANCE } from "~/services/cache/memcache";
import { injectModules } from "./lib/modules";
import { moduleDefinitions } from "./modules";

const configDef = injectModules(moduleDefinitions, {
  db: dbConfig,
  lists: {},
  session,
  graphql: {
    playground: CONFIG.GRAPHQL_INSTROSPECTION === "true",
    apolloConfig: {
      introspection: CONFIG.GRAPHQL_INSTROSPECTION === "true",
      // WARN: This is a security risk, should be configured properly, but cant be done in this project
      csrfPrevention: false,
      plugins: [
        // ApolloServerPluginCacheControl({ defaultMaxAge: 1 }),
        responseCachePlugin({
          sessionId: async ({ request }) => {
            const session = request?.http?.headers.get("Authorization") || null;
            // console.log("SESSION", session);
            return session;
          },
        }),
      ],
      cache: MEM_CACHE_INSTANCE.processor,
    },
  },
  server: {
    cors: {
      origin: CONFIG.SERVER_CORS_URL.includes("*")
        ? true
        : CONFIG.SERVER_CORS_URL.split(","),
    },
  },
  storage: {
    [s3FilesConfigKey]: s3FilesStorageConfig,
    [s3ImageConfigKey]: s3ImageStorageConfig,
  },
});

const keystoneConfig = config<GlobalTypeInfo>(configDef);

// if reload.json doesnt exist, create it
if (!fs.existsSync(path.join(process.cwd(), "reload.json"))) {
  fs.writeFileSync(
    path.join(process.cwd(), "reload.json"),
    JSON.stringify({ time: new Date().toISOString() }, null, 2)
  );
}

const packageJsonPath = path.join(process.cwd(), "reload.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

// get last time and only rewrite if its older than 10 seconds
if (new Date().getTime() - new Date(packageJson.time).getTime() > 10000) {
  // console.log(new Date().getTime() - new Date(packageJson.time).getTime());
  packageJson.time = new Date().toISOString();
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

export default withAuth(keystoneConfig);
