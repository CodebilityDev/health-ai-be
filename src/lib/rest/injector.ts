import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import {
  Express,
  NextFunction,
  Request,
  Response,
  Router,
  json,
} from "express";
import fileUpload from "express-fileupload";
import swaggerUi from "swagger-ui-express";
import { GlobalContext } from "~/common/context";
import { RouteDeclarationList } from "./declarations";
import { devErrorHandler } from "./middleware/errorHandler";
import { RequestInputType } from "./types";

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
      summary:
        (routeData.description ?? "").substring(0, 100) +
        ((routeData.description?.length ?? 0) > 100 ? "..." : ""),
      description: routeData.description,

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
        body:
          !["get"].includes(method) &&
          routeData.inputParser.pick({
            [RequestInputType.BODY]: true,
          }).shape?.body
            ? {
                content: {
                  "application/json": {
                    schema: routeData.inputParser.pick({
                      [RequestInputType.BODY]: true,
                    }).shape?.body,
                  },
                },
              }
            : undefined,
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

    let assignments: ((
      req: Request,
      res: Response,
      next: NextFunction,
    ) => void)[] = [];

    if (routeData.useJsonParser) {
      assignments.push(
        json({
          limit: "10mb",
        }),
      );
    }

    if (routeData.useFileParser) {
      assignments.push(
        fileUpload({
          limits: { fileSize: 50 * 1024 * 1024 },
        }),
      );
    }

    assignments.push(async (req, res, next) => {
      const context = await commonContext.withRequest(req, res);
      const parsedData = routeData.inputParser.safeParse({
        [RequestInputType.QUERY]: req.query,
        [RequestInputType.BODY]: req.body,
        [RequestInputType.PARAMS]: req.params,
        [RequestInputType.HEADERS]: req.headers,
        [RequestInputType.FILES]: req.files,
        [RequestInputType.FORMS]: req.body,
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

    router[method](route, ...assignments);
  }

  mainRouter.use(data.name, router);
}

export function bootstrapExpress(
  app: Express,
  commonContext: GlobalContext,
  extraRouteList: RouteDeclarationList[],
) {
  app.use(json());
  app.use(devErrorHandler);
  const mainRouter = Router();

  for (const routeData of extraRouteList) {
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

  app.use("/api/swagger", swaggerUi.serve, swaggerUi.setup(document));
  app.use(MAIN_API_ROUTE, mainRouter);
}
