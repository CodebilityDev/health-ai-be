import {
  GraphqlActionMetadata,
  GraphqlMethodDeclarationList,
} from "~/lib/graphql/declarations";

const loggingGqlDeclaration = new GraphqlMethodDeclarationList();

loggingGqlDeclaration.add(
  new GraphqlActionMetadata({
    root: "Query",
    name: "ErrorTest",
    output: "String",
    resolve: async () => {
      throw new Error("This is a test error");
    },
  }),
);

export { loggingGqlDeclaration };
