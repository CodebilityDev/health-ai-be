import { parse } from "graphql";
import { useServer as wsUseServer } from "graphql-ws/lib/use/ws";
import { Server } from "http";
import { Server as WsServer } from "socket.io";
import { WebSocketServer } from "ws";
import { GlobalContext } from "~/common/context";
import { pubSub } from "./graphql/pubsub";
import { SocketDeclarationList } from "./types";

function implementSocketDeclaration(
  io: WsServer,
  commonContext: GlobalContext,
  data: SocketDeclarationList,
) {
  if (data.socket) {
    for (const [namespace, fxList] of data.socket) {
      console.log("✅ Socket namespace", `${data.name}/${namespace}`);
      io.of(`${data.name}/${namespace}`).on("connection", (socket) => {
        // console.log("connected fx");
        const sessionContext = {};

        for (const [event, fx] of fxList) {
          socket.on(event, (arg1, arg2, callback) => {
            return fx({
              context: commonContext,
              server: io,
              socket,
              namespaceContext: sessionContext,
              args: {
                args1: arg1,
                args2: arg2,
                callback,
              },
            });
          });
        }
      });
    }
  }
}

export function bootstrapHttp(
  server: Server,
  commonContext: GlobalContext,
  socketList: SocketDeclarationList[],
) {
  const wss = new WebSocketServer({
    server: server,
    path: "/api/graphql",
  });

  console.log("✅ Websocket server started");

  // Setup the WebSocket to handle GraphQL subscriptions using 'graphql-ws'
  wsUseServer(
    {
      schema: commonContext.graphql.schema,
      // run these onSubscribe functions as needed or remove them if you don't need them
      onSubscribe: async (ctx: any, msg) => {
        const context = await commonContext.withRequest(ctx.extra.request);
        // Return the execution args for this subscription passing through the Keystone Context
        return {
          schema: commonContext.graphql.schema,
          operationName: msg.payload.operationName,
          document: parse(msg.payload.query),
          variableValues: msg.payload.variables,
          contextValue: context,
        };
      },
    },
    wss,
  );

  // Send the time every second as an interval example of pub/sub
  setInterval(() => {
    // console.log("TIME", Date.now());
    pubSub.publish("time", {
      time: {
        iso: new Date().toISOString(),
      },
    });
  }, 1000);

  const ioInstance = new WsServer(server, {
    cors: {
      origin: "*",
    },
  });

  for (const socketData of socketList) {
    implementSocketDeclaration(ioInstance, commonContext, socketData);
  }
}
