import { KeystoneConfig } from "@keystone-6/core/types";
import type { GraphQLSchema } from "graphql/type/schema";
import { GlobalTypeInfo } from "~/common/types";
import { bootstrapExpress } from "~/server";
import { bootstrapHttp } from "~/server/bootstrapHttp";
import { authDefinition } from "./auth";
import { ModuleDefinition } from "./definition";
import { postDefiniton } from "./posts";
import { testDefinition } from "./test";

const modules: ModuleDefinition[] = [
  testDefinition,
  authDefinition,
  postDefiniton,
];

export function injectModules(config: KeystoneConfig<GlobalTypeInfo>) {
  // inject schema first
  for (const module of modules) {
    for (const schema of module.schema) {
      config.lists = { ...config.lists, ...schema };
    }
  }

  // inject graphql extensions
  const allExtensions = modules.reduce(
    (acc, module) => [...acc, ...module.graphqlExtensions],
    [] as ((schema: GraphQLSchema) => GraphQLSchema)[],
  );

  const existingExtendGraphqlSchema = config.extendGraphqlSchema;

  config.extendGraphqlSchema = (schema: GraphQLSchema) => {
    let _schema = schema;
    const extensionList = allExtensions;

    if (existingExtendGraphqlSchema) {
      _schema = existingExtendGraphqlSchema(_schema);
    }

    extensionList.forEach((extension) => {
      _schema = extension(_schema);
    });

    return _schema;
  };

  // inject rest api
  const allRestExtensions = modules.reduce(
    (acc, module) => [...acc, ...module.restExtensions],
    [] as ModuleDefinition["restExtensions"],
  );

  const allSocketExtensions = modules.reduce(
    (acc, module) => {
      if (!acc) {
        return module.socketExtensions || [];
      }
      if (module.socketExtensions) {
        return [...acc, ...module.socketExtensions];
      }
      return acc;
    },
    [] as ModuleDefinition["socketExtensions"],
  );

  if (!config.server?.extendExpressApp) {
    config.server = {
      ...config.server,
      extendExpressApp: () => {},
      extendHttpServer: () => {},
    };
  }
  config.server.extendExpressApp = (app, context) => {
    bootstrapExpress(app, context, allRestExtensions);
  };

  config.server.extendHttpServer = (server, context) => {
    bootstrapHttp(server, context, allSocketExtensions ?? []);
  };

  return config;
}
