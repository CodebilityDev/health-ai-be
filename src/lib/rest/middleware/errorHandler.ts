import { KeystoneContext } from "@keystone-6/core/types";
import { NextFunction, Request, Response } from "express";
import { parse, visit } from "graphql";
import { GlobalContext, GlobalTypeInfo } from "~/common/context";
import { CONFIG } from "~/common/env";

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

export const devErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  err.stack = err.stack || "";
  const status = err.status || 500;
  const error = { message: err.message };
  res.status(status);
  return res.json({ status, error });
};

const getRootMethodsFromGraphQL = (queryString: string) => {
  // Parse the GraphQL query string into an Abstract Syntax Tree (AST)
  const ast = parse(queryString);

  // Store all root methods (fields) found in the query
  const rootMethods: string[] = [];

  // Visit each node in the AST
  visit(ast, {
    OperationDefinition(node) {
      // Only look at the first level of selection set (root fields)
      if (node.selectionSet) {
        node.selectionSet.selections.forEach((selection) => {
          if (selection.kind === "Field") {
            rootMethods.push(selection.name.value);
          }
        });
      }
    },
  });

  return rootMethods;
};

export const requestLogger =
  (context: GlobalContext) =>
  (req: Request, res: Response, next: NextFunction) => {
    // get the request url, method, and the time it takes to respond
    const { url, method } = req;
    const start = Date.now();
    // is graphql request
    const isGraphql = url.includes("/api/graphql");
    res.on("finish", () => {
      const elapsed = Date.now() - start;
      // is is graphql request, get the graphql query
      let logData = {
        method,
        url,
        status: res.statusCode,
        elapsed,
        graphql: [],
      };
      if (isGraphql) {
        const { query } = req.body;

        // get the methods from the graphql query
        const methods = getRootMethodsFromGraphQL(query);

        // @ts-ignore
        logData.graphql = methods;
      }

      // if url is _next, don't log
      if (url.includes("_next")) return;

      if (CONFIG.LOG_REQUESTS === "short") {
        console.log(`${method} ${url} ${res.statusCode} ${elapsed}ms`);
      } else if (CONFIG.LOG_REQUESTS) {
        console.log(JSON.stringify(logData));
      }
      const userID = context.session?.itemId;
      if (CONFIG.LOG_TODB) {
        (async function () {
          await context.prisma.serverLog.create({
            data: {
              method: logData.method,
              url: logData.url,
              status: logData.status.toString(),
              elapsed: logData.elapsed.toString(),
              graphql: logData.graphql.join(", "),
              userID: userID,
            },
          });
        })();
      }
    });
    next();
  };
