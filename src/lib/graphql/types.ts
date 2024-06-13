import { KeystoneContext } from "@keystone-6/core/types";
import { GlobalTypeInfo } from "~/common/context";

export type GraphqlActionDeclaration<T = any> = (
  root: any,
  args: T,
  context: KeystoneContext<GlobalTypeInfo>,
) => Promise<any> | any;

export type GraphqlActionArgs = {
  root: any;
  args: any;
  context: KeystoneContext<GlobalTypeInfo>;
};

export type GraphqlActionFunction = (operation: GraphqlActionArgs) => boolean;

export type GraphqlActionAccessConfigBuilder = (generatorArgs: {
  superAccess?: string[];
  conditions?: GraphqlActionFunction[];
}) => GraphqlActionFunction;

export enum GraphqlScalarType {
  Int = "Int",
  Float = "Float",
  String = "String",
  Boolean = "Boolean",
  ID = "ID",
}

export enum GraphqlMethods {
  Query = "Query",
  Mutation = "Mutation",
  Subscription = "Subscription",
}
