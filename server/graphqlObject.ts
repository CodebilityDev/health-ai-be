import { mergeSchemas } from "@graphql-tools/schema";
import { KeystoneContext } from "@keystone-6/core/types";
import { getGraphqlSchemaFromJsonSchema } from "get-graphql-from-jsonschema";
import { GraphQLSchema } from "graphql";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { GlobalDataTypes, GlobalTypeInfo } from "../common/types";

export type GraphqlActionDeclaration<T = any> = (
  root: any,
  args: T,
  context: KeystoneContext<GlobalTypeInfo>,
) => Promise<any> | any;

export enum GraphqlScalarType {
  Int = "Int",
  Float = "Float",
  String = "String",
  Boolean = "Boolean",
  ID = "ID",
}

export function required(s: string) {
  return `${s}!`;
}

export function array(s: string) {
  return `[${s}]`;
}

export enum GraphqlMethods {
  Query = "Query",
  Mutation = "Mutation",
}

function jsTypeToGraphqlScalarType(type: string): GraphqlScalarType {
  switch (type) {
    case "string":
      return GraphqlScalarType.String;
    case "number":
      return GraphqlScalarType.Float;
    case "boolean":
      return GraphqlScalarType.Boolean;
    default:
      return GraphqlScalarType.String;
  }
}

function jsonTypeToGraphql(definitions: any, inputName: string = "schema") {
  const schema = getGraphqlSchemaFromJsonSchema({
    rootName: inputName,
    schema: definitions,
  });

  return schema;
}

export class GraphqlActionMetadata<T = any> {
  root: GraphqlMethods | string;
  name: string;
  args?: T;
  // @ts-expect-error T does not satisfy the constraint 'z.ZodType<any>'.
  resolve: GraphqlActionDeclaration<z.infer<T>>;
  output:
    | GraphqlScalarType
    | GlobalDataTypes
    | string
    | {
        name: string;
        isMain?: boolean;
        fields?: {
          [key: string]: GraphqlScalarType | GlobalDataTypes | string;
        };
        schema?: any;
      }[];

  description?: string;

  constructor({
    root,
    name,
    input,
    resolve,
    output,
    description,
  }: {
    root: GraphqlMethods | string;
    name: string;
    input?: T;
    inputRequired?: boolean;
    // @ts-expect-error T does not satisfy the constraint 'z.ZodType<any>'.
    resolve: GraphqlActionDeclaration<z.infer<T>>;
    output:
      | GraphqlScalarType
      | GlobalDataTypes
      | string
      | {
          name: string;
          isMain?: boolean;
          fields?: {
            [key: string]: GraphqlScalarType | GlobalDataTypes | string;
          };
          schema?: any;
        }[];
    description?: string;
  }) {
    this.root = root;
    this.name = name;
    this.args = input;
    this.resolve = resolve;
    this.output = output;
    this.description = description;
  }
}

export type GraphqlRouteParams = {
  actions: GraphqlActionMetadata[];
};

export function graphqlFields(
  args: GraphqlRouteParams,
): (schema: GraphQLSchema) => GraphQLSchema {
  let typeDefs: string[] = [];
  let resolvers: {
    [key: string]: {
      [key: string]: GraphqlActionDeclaration;
    };
  } = {};

  for (let action of args.actions) {
    // check if query or mutation exist in resolvers already
    if (!resolvers[action.root]) {
      resolvers[action.root] = {};
    }

    // ==================== Process Output

    let outputType;
    if (typeof action.output === "string") {
      outputType = action.output;
    } else {
      let outputName;
      for (let output of action.output) {
        let outName = output.name;
        if (output.isMain) {
          outputName = outName;
        }
        if (output.fields) {
          typeDefs.push(`
            type ${outName} {
              ${Object.keys(output.fields)
                // @ts-ignore
                .map((key) => `${key}: ${output.fields[key]}`)
                .join(", ")}
            }
          `);
        } else if (output.schema) {
          let jsonSchemaOutput = zodToJsonSchema(output.schema, "schema");
          // console.log(JSON.stringify(jsonSchema, null, 2));
          // @ts-ignore
          let propertiesOutput = jsonSchemaOutput?.definitions?.schema || false;
          let outputType;
          if (propertiesOutput) {
            const defs = jsonTypeToGraphql(propertiesOutput, output.name);
            for (let def of defs.typeDefinitions) {
              // replace all existence of T0 with regex
              def = def.replace(/T0/g, "");
              typeDefs.push(def);
            }
          }
        }
      }
      if (!outputName) {
        outputName = action.output[0].name;
      }
      outputType = outputName;
    }

    // ==================== Process Input
    let jsonSchema = action.args ? zodToJsonSchema(action.args, "schema") : {};
    // console.log(JSON.stringify(jsonSchema, null, 2));
    // @ts-ignore
    let properties = jsonSchema?.definitions?.schema || false;

    let inputName;

    if (properties) {
      const defs = jsonTypeToGraphql(properties, action.name + "Input");
      for (let def of defs.typeDefinitions) {
        // if def contains the inputName, then it is the input type
        def = def.replace("type ", "input ");
        def = def.replace(/T0/g, "");
        typeDefs.push(def);
      }
      defs.typeName = defs.typeName.replace("T0", "");
      inputName = defs.typeName + "!";
    }

    // Create Action Type
    typeDefs.push(`
      type ${action.root} {
        ${action.name}${
          properties ? `(input: ${inputName})` : ""
        }: ${outputType}
      }
    `);

    // add action to resolvers
    resolvers[action.root][action.name] = (root, args, context) => {
      let _args = args || {};
      // parse args
      if (action.args) {
        _args = action.args.safeParse(args.input);
        if (!_args.success) {
          throw new Error(
            "Invalid arguments: " +
              _args.error.errors[0].message +
              "." +
              JSON.stringify(_args.error.errors[0].path),
          );
        }
        _args = _args.data;
      }
      return action.resolve(root, _args, context);
    };
  }

  const stringifiedTypeDefs = typeDefs.join("\n");

  // console.log(stringifiedTypeDefs);

  return (schema) =>
    mergeSchemas({
      schemas: [schema],
      typeDefs: stringifiedTypeDefs,
      resolvers,
    });
}
