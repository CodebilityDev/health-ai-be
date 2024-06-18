import { eventEmitter } from "~/lib/events";
import { SocketDeclarationList } from "~/lib/socket/types";

const extraSocketDeclaration = new SocketDeclarationList({
  path: "/post-ws",
});

extraSocketDeclaration.description = "Test Socket Declaration";

extraSocketDeclaration.addNamespace("test", "Test Namespace");

extraSocketDeclaration.addListener({
  namespace: "test",
  event: "set",
  description: "Sets the current value as the current date",
  fx: async ({ context, namespaceContext, args }) => {
    console.log("setting value with user", args);
    namespaceContext["test"] = new Date().toISOString();
    eventEmitter.emit("test", namespaceContext["test"]);
  },
});

extraSocketDeclaration.addListener({
  namespace: "test",
  event: "get",
  description:
    "Pass a function that receives a string as an argument to receive the value",
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
  description:
    "This Event will be called when the test event is emitted (trigger by calling set event)",
  eventKey: () => {
    return "test";
  },
});

export { extraSocketDeclaration as postSocketDeclaration };
