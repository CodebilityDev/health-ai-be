import { SocketDeclarationList } from "../../../server/declarations";

const authSocketDeclaration: SocketDeclarationList = {
  name: "/auth",
  socket: new Map(),
};

authSocketDeclaration.socket?.set("test", new Map());
authSocketDeclaration.socket
  ?.get("test")
  ?.set("set", async ({ namespaceContext }) => {
    console.log("setting test");
    namespaceContext["test"] = new Date().toISOString();
  });
authSocketDeclaration.socket
  ?.get("test")
  ?.set("get", async ({ namespaceContext, args }) => {
    console.log("getting test", namespaceContext["test"]);
    if (args.callback) {
      args.callback(namespaceContext["test"]);
    }
    return namespaceContext["test"];
  });

export { authSocketDeclaration };
