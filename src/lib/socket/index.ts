import { parse } from "graphql";
import { useServer as wsUseServer } from "graphql-ws/lib/use/ws";
import { Server } from "http";
import { Server as WsServer } from "socket.io";
import { WebSocketServer } from "ws";
import { GlobalContext } from "~/common/context";
import { errorJSON } from "~/functions/errorJson";
import { eventEmitter } from "../events";
import { pubSub } from "./graphql/pubsub";
import { SocketDeclarationList } from "./types";

function implementSocketDeclaration(
  io: WsServer,
  commonContext: GlobalContext,
  data: SocketDeclarationList,
) {
  if (data.socket) {
    for (const [namespace, fxList] of data.socket) {
      console.log("✅ Socket namespace", `/ws${data.name}/${namespace}`);
      io.of(`/ws${data.name}/${namespace}`).on("connection", async (socket) => {
        // console.log("connected fx");
        const sessionContext = {};

        const context = await commonContext.withRequest(socket.request);
        let emitters: {
          key: string;
          emitter: any;
        }[] = [];

        for (const [event, k] of fxList.broadcast) {
          const eventEmitterKey = k.key({ context });
          const fx = async (data: any) => {
            try {
              if (await k.filter({ context })) socket.emit(event, data);
            } catch (error) {
              (async function () {
                await context.prisma.serverError.create({
                  data: {
                    method: "SOCKETIO",
                    url: socket.request.url,
                    status: "400",
                    userID: context.session?.itemId || "",
                    errorMessage: JSON.stringify(errorJSON(error)),
                  },
                });
              })();
            }
          };
          eventEmitter.on(eventEmitterKey, fx);
          emitters.push({
            key: eventEmitterKey,
            emitter: fx,
          });
        }

        for (const [event, fx] of fxList.listen) {
          socket.on(event, async (...args) => {
            try {
              const res = await fx.fx({
                context: context,
                server: io,
                socket,
                namespaceContext: sessionContext,
                args,
              });
              return res;
            } catch (e) {
              (async function () {
                await context.prisma.serverError.create({
                  data: {
                    method: "SOCKETIO",
                    url: socket.request.url,
                    status: "400",
                    userID: context.session?.itemId || "",
                    errorMessage: JSON.stringify(errorJSON(e)),
                  },
                });
              })();
            }
          });
        }

        // on disconnect, remove all the listeners
        socket.on("disconnect", () => {
          for (const emitter of emitters) {
            eventEmitter.removeListener(emitter.key, emitter.emitter);
          }
        });
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
