import { NextFunction, Request, Response } from "express";
import { GlobalContext } from "~/common/context";
import { CONFIG } from "~/common/env";
import { getRootMethodsFromGraphQL } from "~/functions/getRootMethodsFromGQLString";

export const requestLogger =
  (commonContext: GlobalContext) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const context = await commonContext.withRequest(req, res);
    // get the request url, method, and the time it takes to respond
    let { url, method } = req;
    // remove the query params from the url
    url = url.split("?")[0];
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

        if (query) {
          // get the methods from the graphql query
          const methods = getRootMethodsFromGraphQL(query);

          // @ts-ignore
          logData.graphql = methods;
        }
      }

      // if url is _next, don't log
      if (url.includes("_next")) return;

      if (CONFIG.LOG_REQUESTS === "short") {
        console.log(
          `${method} ${url} [${logData.graphql.join(", ")}] ${res.statusCode} ${elapsed}ms`,
        );
      } else if (CONFIG.LOG_REQUESTS === "true") {
        console.log(JSON.stringify(logData));
      }
      const userID = context.session?.itemId;
      if (CONFIG.LOG_TODB === "true") {
        if (logData.status >= 400) {
          // (async function () {
          //   await context.prisma.serverError.create({
          //     data: {
          //       method: logData.method,
          //       url: logData.url,
          //       status: logData.status.toString(),
          //       graphql: logData.graphql.join(", "),
          //       userID: userID,
          //     },
          //   });
          // })();
        } else {
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
      }
    });
    next();
  };
