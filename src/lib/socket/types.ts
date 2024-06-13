import { Server, Socket } from "socket.io";
import { GlobalContext } from "~/common/context";

export type SocketFunction = (args: {
  context: GlobalContext;
  socket: Socket;
  server: Server;
  namespaceContext: Record<string, any>;
  args: {
    args1: any;
    args2: any;
    callback: any;
  };
}) => any;

export class SocketDeclarationList {
  name: string;
  socket: Map<string, Map<string, SocketFunction>>;

  constructor(args: { path: string }) {
    this.name = args.path;
    this.socket = new Map();
  }

  addNamespace(namespace: string) {
    this.socket.set(namespace, new Map());
  }

  namespace(namespace: string) {
    if (!this.socket.has(namespace)) {
      this.addNamespace(namespace);
    }
    return this.socket.get(namespace)!;
  }
}
