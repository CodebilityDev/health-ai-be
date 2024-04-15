import { KeystoneContext } from "@keystone-6/core/types";
import type { Request, Response } from "express";
import { z } from "zod";
import { GlobalTypeInfo } from "../common/types";

import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export type RouteDeclaration<T = any> = (props: {
  context: KeystoneContext<GlobalTypeInfo>;
  inputData: T;
  req: Request;
  res: Response;
}) => Promise<any> | any;

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
}

export const NO_INPUT = z.object({});

export class RouteDeclarationMetadata<T = any, U = any> {
  method: RouteMethod;
  inputParser: T;
  outputParser?: U;
  isAuthed?: boolean;
  // @ts-expect-error T does not satisfy the constraint 'z.ZodType<any>'.
  function: RouteDeclaration<z.infer<T>>;

  constructor(args: {
    method: RouteMethod;
    isAuthed?: boolean;
    inputParser: T;
    outputParser?: U;
    // @ts-expect-error T does not satisfy the constraint 'z.ZodType<any>'.
    func: RouteDeclaration<z.infer<T>>;
  }) {
    this.method = args.method;
    this.function = args.func;
    this.inputParser = args.inputParser;
    this.isAuthed = args.isAuthed;
    this.outputParser = args.outputParser;
  }
}

export type RouteDeclarationList = {
  name: string;
  routes: Map<string, RouteDeclarationMetadata>;
};
