import { getGraphqlSchemaFromJsonSchema } from "get-graphql-from-jsonschema";

export function required(s: string) {
  return `${s}!`;
}

export function array(s: string) {
  return `[${s}]`;
}

export function jsonTypeToGraphql(
  definitions: any,
  inputName: string = "schema",
) {
  const schema = getGraphqlSchemaFromJsonSchema({
    rootName: inputName,
    schema: definitions,
  });

  return schema;
}
