import { KeystoneContext } from "@keystone-6/core/types";
import { NextFunction, Request, Response } from "express";
import { GlobalContext, GlobalTypeInfo } from "~/common/context";
import { CONFIG } from "~/common/env";
import { errorJSON } from "~/functions/errorJson";
import { getRootMethodsFromGraphQL } from "~/functions/getRootMethodsFromGQLString";

/**
 * Handler to catch `async` operation errors.
 * Reduces having to write `try-catch` all the time.
 */
export const catchErrors =
  (action: Function, context: KeystoneContext<GlobalTypeInfo>) =>
  (req: Request, res: Response, next: NextFunction) =>
    action(req, res, context).catch(next);

/**
 * Show useful information to client in development.
 */

export const devErrorHandler =
  (commonContext: GlobalContext) =>
  async (err: any, req: Request, res: Response, next: NextFunction) => {
    const context = await commonContext.withRequest(req, res);
    err.stack = err.stack || "";
    const status = err.status || 500;
    const error = errorJSON(err);
    res.status(status);
    if (CONFIG.LOG_TODB) {
      const isGraphql = req.url.includes("/api/graphql");
      let logData = {
        method: req.method,
        url: req.url,
        status: res.statusCode || 500,
        elapsed: 0,
        graphql: [],
      };
      if (isGraphql) {
        const { query } = req.body;

        if (query) {
          // get the methods from the graphql query
          const methods = getRootMethodsFromGraphQL(query);

          // @ts-ignore
          logData.graphql = methods;
        }
      }
      const userID = context.session?.itemId;
      (async function () {
        console.log(JSON.stringify(error));
        await context.prisma.serverError.create({
          data: {
            method: logData.method,
            url: logData.url,
            status: logData.status.toString(),
            graphql: logData.graphql.join(", "),
            userID: userID,
            errorMessage: JSON.stringify(error),
          },
        });
      })();
    }
    return res.json({ status, error });
  };
