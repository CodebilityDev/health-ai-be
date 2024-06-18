import { Server, Socket } from "socket.io";
import { z } from "zod";
import { GlobalContext } from "~/common/context";

export type SocketFunction<T = any> = (args: {
  context: GlobalContext;
  socket: Socket;
  server: Server;
  namespaceContext: Record<string, any>;
  args: T;
}) => any;

export type SocketFunctionListener<T = any> = {
  // inputParams: T;
  // outputParams: z.ZodType<any>;
  fx: SocketFunction;
  description?: string;
};

export type SocketFunctionBroadcaster = {
  key: (args: { context: GlobalContext }) => string;
  filter: (args: { context: GlobalContext }) => boolean;
  // outputParams: z.ZodType<any>;
  description?: string;
};

export class SocketDeclarationList {
  name: string;
  description?: string;
  socket: Map<
    string,
    {
      description?: string;
      listen: Map<string, SocketFunctionListener>;
      broadcast: Map<string, SocketFunctionBroadcaster>;
    }
  >;

  constructor(args: { path: string }) {
    this.name = args.path;
    this.socket = new Map();
  }

  addNamespace(namespace: string, description?: string) {
    const socketData = {
      listen: new Map(),
      broadcast: new Map(),
      description,
    };
    this.socket.set(namespace, socketData);
  }

  namespace(namespace: string) {
    if (!this.socket.has(namespace)) {
      this.addNamespace(namespace);
    }
    return this.socket.get(namespace)!;
  }

  addListener<T>(args: {
    namespace: string;
    event: string;
    // inputParser: T;
    // outputParser: z.ZodType<any>;
    // @ts-expect-error - infer the return type of the function
    fx: SocketFunction<z.infer<T>>;
    description?: string;
  }) {
    this.namespace(args.namespace).listen.set(args.event, {
      fx: args.fx,
      // inputParams: args.inputParser,
      // outputParams: args.outputParser,
      description: args.description,
    });
  }

  addBroadcaster(args: {
    namespace: string;
    event: string;
    eventKey: (args: { context: GlobalContext }) => string;
    filter?: (args: { context: GlobalContext }) => boolean;
    description?: string;
    // outputParser: z.ZodType<any>;
  }) {
    this.namespace(args.namespace).broadcast.set(args.event, {
      key: args.eventKey,
      filter: args.filter ?? (() => true),
      // outputParams: args.outputParser,
      description: args.description,
    });
  }
}
