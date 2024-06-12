import { z } from "zod";
import { minioClient } from "../../../common/s3/minio";
import {
  RequestInputType,
  RouteDeclarationList,
  RouteDeclarationMetadata,
  RouteMethod,
} from "../../declarations";

const healthRouteDeclaration: RouteDeclarationList = {
  name: "/health",
  routes: new Map(),
};

healthRouteDeclaration.routes.set(
  "/",
  new RouteDeclarationMetadata({
    method: RouteMethod.GET,
    inputParser: z.object({
      [RequestInputType.QUERY]: z.object({
        database: z
          .preprocess((val) => {
            if (val === "true") {
              return true;
            } else {
              return false;
            }
          }, z.boolean().optional())
          .optional(),
        s3: z
          .preprocess((val) => {
            if (val === "true") {
              return true;
            } else {
              return false;
            }
          }, z.boolean().optional())
          .optional(),
        unified: z
          .preprocess((val) => {
            if (val === "true") {
              return true;
            } else {
              return false;
            }
          }, z.boolean().optional())
          .optional(),
      }),
    }),

    func: async ({
      context: { prisma },
      inputData: {
        [RequestInputType.QUERY]: { database, s3, unified },
      },
      res,
    }) => {
      const serverStatus = true;
      let databaseStatus = false;
      let s3Status = false;

      if (database) {
        // test database connection
        try {
          await await prisma.$queryRaw`SELECT 1`;
          databaseStatus = true;
        } catch (e) {
          databaseStatus = false;
        }
      }

      if (s3) {
        // test s3 connection
        try {
          await minioClient.listBuckets();
          s3Status = true;
        } catch (e) {
          s3Status = false;
        }
      }

      let unifiedStatus = true;
      if (database) {
        unifiedStatus = unifiedStatus && databaseStatus;
      }
      if (s3) {
        unifiedStatus = unifiedStatus && s3Status;
      }

      if (unified) {
        if (unifiedStatus) {
          res.status(200).send({
            server: serverStatus,
            database: database ? databaseStatus : undefined,
            s3: s3 ? s3Status : undefined,
          });
        } else {
          res.status(500).send({
            error: "One or more systems are down",
            server: serverStatus,
            database: database ? databaseStatus : undefined,
            s3: s3 ? s3Status : undefined,
          });
        }
      } else {
        res.status(200).send({
          server: serverStatus,
          database: database ? databaseStatus : undefined,
          s3: s3 ? s3Status : undefined,
        });
      }
    },
  }),
);

export { healthRouteDeclaration };
