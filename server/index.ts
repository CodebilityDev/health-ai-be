import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import { Express, Router, json } from "express";
import swaggerUi from "swagger-ui-express";
import { GlobalContext } from "../common/types";
import { routeList } from "./api";
import { RequestInputType, RouteDeclarationList } from "./declarations";
import { devErrorHandler } from "./services/middleware/errorHandler";

const registry = new OpenAPIRegistry();

const MAIN_API_ROUTE = "/api";

// create a function to convert :var to {var}
function convertExpressRouteToOpenApiRoute(route: string) {
  return route.replace(/:(\w+)/g, "{$1}");
}

function implementRouteDeclaration(
  mainRouter: Router,
  commonContext: GlobalContext,
  data: RouteDeclarationList,
) {
  const router = Router();

  for (const [route, routeData] of data.routes) {
    const method = routeData.method;

    registry.registerPath({
      method: method as any,
      path: convertExpressRouteToOpenApiRoute(
        MAIN_API_ROUTE + data.name + route,
      ),
      tags: [data.name],
      security: routeData.accessConfig ? [{ bearerAuth: [] }] : undefined,
      request: {
        query: routeData.inputParser.pick({
          [RequestInputType.QUERY]: true,
        }).shape?.query,
        params: routeData.inputParser.pick({
          [RequestInputType.PARAMS]: true,
        }).shape?.params,
        headers: routeData.inputParser.pick({
          [RequestInputType.HEADERS]: true,
        }).shape?.headers,
        body: ["get"].includes(method)
          ? undefined
          : {
              content: {
                "application/json": {
                  schema: routeData.inputParser.pick({
                    [RequestInputType.BODY]: true,
                  }).shape?.body,
                },
              },
            },
      },
      responses: {
        200: {
          description: "Successful response",
          content: {
            "application/json": {
              schema: routeData.outputParser ? routeData.outputParser : {},
            },
          },
        },
      },
    });

    router[method](route, async (req, res, next) => {
      const context = await commonContext.withRequest(req, res);
      const parsedData = routeData.inputParser.safeParse({
        [RequestInputType.QUERY]: req.query,
        [RequestInputType.BODY]: req.body,
        [RequestInputType.PARAMS]: req.params,
        [RequestInputType.HEADERS]: req.headers,
      });
      if (!parsedData.success)
        return res.status(400).json({ error: parsedData.error });

      const session = context.session;

      if (routeData.accessConfig) {
        const accessResult = routeData.accessConfig({
          context,
          session,
          operation: method,
        });

        if (!accessResult) return res.status(403).json({ error: "Forbidden" });
      }

      try {
        const returnValue = await routeData.function({
          context,
          inputData: parsedData.data,
          req,
          res,
        });

        if (returnValue) {
          if (routeData.outputParser) {
            const outputData = routeData.outputParser.safeParse(returnValue);
            if (!outputData.success)
              return res.status(500).json({ error: outputData.error });
            return res.json(outputData.data);
          } else {
            return res.json(returnValue);
          }
        }
      } catch (error) {
        next(error);
      }
    });
  }

  mainRouter.use(data.name, router);
}

export default function bootstrapExpress(
  app: Express,
  commonContext: GlobalContext,
) {
  app.use(json());
  app.use(devErrorHandler);
  const mainRouter = Router();

  for (const routeData of routeList) {
    implementRouteDeclaration(mainRouter, commonContext, routeData);
  }

  const definitions = registry.definitions;
  const generator = new OpenApiGeneratorV3(definitions);
  const document = generator.generateDocument({
    info: {
      title: "Server API",
      version: "1.0.0",
    },
    openapi: "3.0.0",
    // add bearerAuth security definition
  });
  // @ts-ignore
  document.components["securitySchemes"] = {
    bearerAuth: {
      type: "http",
      in: "header",
      name: "Authorization",
      description: "Bearer token to access these api endpoints",
      scheme: "bearer",
      bearerFormat: "JWT",
    },
  };

  app.use("/api/rest", swaggerUi.serve, swaggerUi.setup(document));
  app.use(MAIN_API_ROUTE, mainRouter);
}
