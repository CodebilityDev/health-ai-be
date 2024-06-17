import { parse, visit } from "graphql";

export const getRootMethodsFromGraphQL = (queryString: string) => {
  // Parse the GraphQL query string into an Abstract Syntax Tree (AST)
  const ast = parse(queryString);

  // Store all root methods (fields) found in the query
  const rootMethods: string[] = [];

  // Visit each node in the AST
  visit(ast, {
    OperationDefinition(node) {
      // Only look at the first level of selection set (root fields)
      if (node.selectionSet) {
        node.selectionSet.selections.forEach((selection) => {
          if (selection.kind === "Field") {
            rootMethods.push(selection.name.value);
          }
        });
      }
    },
  });

  return rootMethods;
};
