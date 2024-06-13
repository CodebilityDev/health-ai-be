import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { KeystoneContext } from "@keystone-6/core/types";
import { Request, Response } from "express";
import { z } from "zod";
import { AuthedSession, GlobalContext, GlobalTypeInfo } from "~/common/context";

extendZodWithOpenApi(z);

export const NO_INPUT = z.object({});

export const FILE_TYPE = z.object({
  name: z.string(),
  data: z.any(), // Buffer
  size: z.number(),
  encoding: z.string(),
  tempFilePath: z.string(),
  truncated: z.boolean(),
  mimetype: z.string(),
  md5: z.string(),
});

export enum RouteMethod {
  GET = "get",
  POST = "post",
  PUT = "put",
  DELETE = "delete",
  USE = "use",
}

export enum RequestInputType {
  QUERY = "query",
  BODY = "body",
  PARAMS = "params",
  HEADERS = "headers",
  FILES = "files",
  FORMS = "forms",
}

export type ServerOperationArgs = {
  context: GlobalContext;
  session?: AuthedSession;
  operation: RouteMethod;
};

export type RouteDeclaration<T = any> = (props: {
  context: KeystoneContext<GlobalTypeInfo>;
  inputData: T;
  req: Request;
  res: Response;
}) => Promise<any> | any;
