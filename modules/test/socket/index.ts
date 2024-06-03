import { SocketDeclarationList } from "../../../server/declarations";

const extraSocketDeclaration: SocketDeclarationList = {
  name: "/post-ws",
  socket: new Map([
    [
      "test",
      new Map([
        [
          "set",
          async ({ namespaceContext }) => {
            console.log("setting test");
            namespaceContext["test"] = new Date().toISOString();
          },
        ],
        [
          "get",
          async ({ namespaceContext, args }) => {
            console.log("getting test", namespaceContext["test"]);
            if (args.callback) {
              args.callback(namespaceContext["test"]);
            }
          },
        ],
      ]),
    ],
  ]),
};

export { extraSocketDeclaration as postSocketDeclaration };
