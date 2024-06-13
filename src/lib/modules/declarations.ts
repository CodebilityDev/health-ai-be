import type { Lists } from ".keystone/types";
import { GraphqlMethodDeclarationList } from "../graphql/declarations";
import { RouteDeclarationList } from "../rest/declarations";
import { SocketDeclarationList } from "../socket/types";

export class Module {
  schema: Lists[];
  graphqlExtensions: GraphqlMethodDeclarationList[];
  restExtensions: RouteDeclarationList[];
  socketExtensions?: SocketDeclarationList[];

  constructor(args: {
    schema: Lists[];
    graphqlExtensions: GraphqlMethodDeclarationList[];
    restExtensions: RouteDeclarationList[];
    socketExtensions?: SocketDeclarationList[];
  }) {
    this.schema = args.schema;
    this.graphqlExtensions = args.graphqlExtensions;
    this.restExtensions = args.restExtensions;
    this.socketExtensions = args.socketExtensions;
  }
}
