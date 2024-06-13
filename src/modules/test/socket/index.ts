import { SocketDeclarationList } from "~/lib/socket/types";

const extraSocketDeclaration = new SocketDeclarationList({
  path: "/post-ws",
});

extraSocketDeclaration
  .namespace("test")
  .set("set", async ({ namespaceContext }) => {
    console.log("setting value");
    namespaceContext["test"] = new Date().toISOString();
  });

extraSocketDeclaration
  .namespace("test")
  .set("get", async ({ namespaceContext, args }) => {
    console.log("getting value", namespaceContext["test"]);
    if (args.callback) {
      args.callback(namespaceContext["test"]);
    }
  });

export { extraSocketDeclaration as postSocketDeclaration };
