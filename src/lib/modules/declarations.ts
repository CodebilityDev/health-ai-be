import type { Lists } from ".keystone/types";
import {
  GraphqlMethodDeclarationList,
  GraphqlSchemaInjection,
} from "../graphql/declarations";
import { RouteDeclarationList } from "../rest/declarations";
import { SocketDeclarationList } from "../socket/types";

export class Module {
  schema: Lists[];
  graphqlExtensions: (GraphqlMethodDeclarationList | GraphqlSchemaInjection)[];
  restExtensions: RouteDeclarationList[];
  socketExtensions?: SocketDeclarationList[];

  constructor(args: {
    schema: Lists[];
    graphqlExtensions: (
      | GraphqlMethodDeclarationList
      | GraphqlSchemaInjection
    )[];
    restExtensions: RouteDeclarationList[];
    socketExtensions?: SocketDeclarationList[];
  }) {
    this.schema = args.schema;
    this.graphqlExtensions = args.graphqlExtensions;
    this.restExtensions = args.restExtensions;
    this.socketExtensions = args.socketExtensions;
  }
}
