import { eventEmitter } from "~/lib/events";
import { SocketDeclarationList } from "~/lib/socket/types";

const extraSocketDeclaration = new SocketDeclarationList({
  path: "/post-ws",
});

extraSocketDeclaration.description = "This is a test socket";

extraSocketDeclaration.addListener({
  namespace: "test",
  event: "set",
  description: "Set value",
  fx: async ({ context, namespaceContext, args }) => {
    console.log("setting value with user", args);
    namespaceContext["test"] = new Date().toISOString();
    eventEmitter.emit("test", namespaceContext["test"]);
  },
});

extraSocketDeclaration.addListener({
  namespace: "test",
  event: "get",
  description: "Get value",
  fx: async ({ namespaceContext, args }) => {
    console.log("getting value", namespaceContext["test"]);
    console.log("args", args);
    if (args) {
      // @ts-ignore
      args[0](namespaceContext["test"]);
    }
  },
});

extraSocketDeclaration.addBroadcaster({
  namespace: "test",
  event: "test",
  description: "Test broadcaster",
  eventKey: () => {
    return "test";
  },
});

export { extraSocketDeclaration as postSocketDeclaration };
