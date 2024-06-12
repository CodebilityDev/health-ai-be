import responseCachePlugin from "@apollo/server-plugin-response-cache";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { config } from "@keystone-6/core";
import { z } from "zod";

extendZodWithOpenApi(z);

import { session, withAuth } from "./src/authConfig";
import { GlobalTypeInfo } from "./src/common/types";
import dbConfig from "./src/dbConfig";
import s3FilesStorageConfig, { s3FilesConfigKey } from "./src/fileConfig";
import s3ImageStorageConfig, { s3ImageConfigKey } from "./src/imageConfig";
import { injectModules } from "./src/modules";
import { CONFIG } from "./src/utils/config/env";

class MEM_CACHE {
  cache = new Map<string, string>();

  async set(key: string, value: string) {
    // console.log("SET", key, value);
    this.cache.set(key, value);
  }

  async get(key: string) {
    // console.log("GET", key);
    const val = this.cache.get(key);
    if (!val) {
      return undefined;
    }
    const valParsed = JSON.parse(val);
    if (
      valParsed.cacheTime + valParsed.cachePolicy.maxAge * 1000 <
      Date.now()
    ) {
      this.cache.delete(key);
      return undefined;
    }
    return this.cache.get(key);
  }

  async delete(key: string) {
    this.cache.delete(key);
  }

  processor = {
    set: this.set.bind(this),
    get: this.get.bind(this),
    delete: this.delete.bind(this),
  };
}

const MEM_CACHE_INSTANCE = new MEM_CACHE();

const configDef = injectModules({
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

// update package.json time

import * as fs from "fs";
import * as path from "path";

// if reload.json doesnt exist, create it
if (!fs.existsSync(path.join(process.cwd(), "reload.json"))) {
  fs.writeFileSync(
    path.join(process.cwd(), "reload.json"),
    JSON.stringify({ time: new Date().toISOString() }, null, 2),
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
