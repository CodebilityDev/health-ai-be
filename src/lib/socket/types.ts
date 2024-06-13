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

export type SocketDeclarationList = {
  name: string;
  socket: Map<string, Map<string, SocketFunction>>;
};
