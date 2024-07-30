import type { Lists } from ".keystone/types";
import { GlobalContext } from "~/common/context";
import {
  GraphqlMethodDeclarationList,
  GraphqlSchemaInjection,
} from "../graphql/declarations";
import { RouteDeclarationList } from "../rest/declarations";
import { SocketDeclarationList } from "../socket/types";

export type QueueDeclarationFunction = (args: { context: GlobalContext }) => {};

export class Module {
  schema: Lists[];
  graphqlExtensions: (GraphqlMethodDeclarationList | GraphqlSchemaInjection)[];
  restExtensions: RouteDeclarationList[];
  socketExtensions?: SocketDeclarationList[];
  queueDeclarations?: QueueDeclarationFunction[];

  constructor(args: {
    schema?: Lists[];
    graphqlExtensions?: (
      | GraphqlMethodDeclarationList
      | GraphqlSchemaInjection
    )[];
    restExtensions?: RouteDeclarationList[];
    socketExtensions?: SocketDeclarationList[];
    queueDeclarations?: QueueDeclarationFunction[];
  }) {
    this.schema = args.schema ?? [];
    this.graphqlExtensions = args.graphqlExtensions ?? [];
    this.restExtensions = args.restExtensions ?? [];
    this.socketExtensions = args.socketExtensions;
    this.queueDeclarations = args.queueDeclarations;
  }

  ignoreExtensions() {
    this.graphqlExtensions = [];
    this.restExtensions = [];
    this.socketExtensions = [];
    this.queueDeclarations = [];

    return this;
  }
}
