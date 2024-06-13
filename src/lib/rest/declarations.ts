import { ServerAccessFunction } from "./access/types";
import { RouteDeclaration, RouteMethod } from "./types";

export class RouteDeclarationMetadata<T = any, U = any> {
  method: RouteMethod;
  inputParser: T;
  useJsonParser?: boolean;
  useFileParser?: boolean;
  outputParser?: U;
  accessConfig?: ServerAccessFunction;
  // @ts-expect-error T does not satisfy the constraint 'z.ZodType<any>'.
  function: RouteDeclaration<z.infer<T>>;

  constructor(args: {
    method: RouteMethod;
    accessConfig?: ServerAccessFunction;
    inputParser: T;
    outputParser?: U;
    // @ts-expect-error T does not satisfy the constraint 'z.ZodType<any>'.
    func: RouteDeclaration<z.infer<T>>;
    useJsonParser?: boolean;
    useFileParser?: boolean;
  }) {
    this.method = args.method;
    this.function = args.func;
    this.inputParser = args.inputParser;
    this.accessConfig = args.accessConfig;
    this.outputParser = args.outputParser;
    this.useJsonParser = args.useJsonParser ?? true;
    this.useFileParser = args.useFileParser ?? false;
  }
}

export class RouteDeclarationList {
  name: string;
  routes: Map<string, RouteDeclarationMetadata>;

  constructor(args: { path: string }) {
    this.name = args.path;
    this.routes = new Map();
  }
}
