import { z } from "zod";
import { GlobalDataType } from "../../common/types";
import {
  GraphqlActionMetadata,
  GraphqlMethods,
  GraphqlScalarType,
  array,
  graphqlFields,
} from "../../server/graphqlObject";
import { ModuleDefinition } from "../definition";
import { postSocketDeclaration } from "./socket";

export const testDefinition: ModuleDefinition = {
  schema: [],
  graphqlExtensions: [
    graphqlFields({
      actions: [
        new GraphqlActionMetadata({
          root: GraphqlMethods.Query,
          name: "TestMethod",
          input: z.object({
            input: z.string().default("test"),
            x: z.number().default(1),
          }),
          output: [
            {
              name: "TestMethodOutput",
              isMain: true,
              fields: {
                output: GraphqlScalarType.String,
                args: "TestMethodOutput_Args",
                posts: array(GlobalDataType("Post")),
              },
            },
            {
              name: "TestMethodOutput_Args",
              schema: z.object({
                input: z.string(),
                x: z.number(),
              }),
            },
          ],
          resolve: async (_, args, context) => {
            return {
              output: "Hello",
              args,
            };
          },
        }),
        new GraphqlActionMetadata({
          root: GraphqlMethods.Mutation,
          name: "TestMethodMutation",
          output: [
            {
              name: "TestMethodMutationOutput",
              isMain: true,
              schema: z.object({
                post: z.string(),
                details: z.object({
                  id: z.string(),
                  name: z.string(),
                }),
              }),
            },
          ],
          resolve: async (_, args, context) => {
            const _post = await context.prisma.post.findFirst();
            return {
              post: _post?.id || "",
              details: { id: "1", name: "test" },
            };
          },
        }),
        new GraphqlActionMetadata({
          root: "TestMethodMutationOutput",
          name: "sub",
          output: [
            {
              name: "SubOutput",
              isMain: true,
              schema: z.object({
                parentID: z.string(),
                sum: z.number(),
              }),
            },
          ],
          input: z.object({
            x: z.number(),
            y: z.number(),
          }),
          resolve: async (parent, args) => {
            return {
              parentID: parent.post,
              sum: args.x + args.y,
            };
          },
        }),
      ],
    }),
  ],
  restExtensions: [],
  socketExtensions: [postSocketDeclaration],
};
