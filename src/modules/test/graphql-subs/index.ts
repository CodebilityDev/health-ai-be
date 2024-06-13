import { withFilter } from "graphql-subscriptions";
import { z } from "zod";
import { GlobalDataType } from "~/common/context";
import { graphqlAccessConfig } from "~/lib/graphql/access";
import {
  GraphqlActionMetadata,
  GraphqlMethodDeclarationList,
} from "~/lib/graphql/declarations";
import { array } from "~/lib/graphql/lib";
import { GraphqlMethods, GraphqlScalarType } from "~/lib/graphql/types";
import { pubSub } from "~/lib/socket/graphql/pubsub";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const testGraphqlDeclarations = new GraphqlMethodDeclarationList();

testGraphqlDeclarations.add(
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
);

testGraphqlDeclarations.add(
  new GraphqlActionMetadata({
    root: GraphqlMethods.Mutation,
    name: "TestMethodMutation",
    accessConfig: graphqlAccessConfig({}),
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
);
testGraphqlDeclarations.add(
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
);
testGraphqlDeclarations.add(
  new GraphqlActionMetadata({
    root: GraphqlMethods.Subscription,
    name: "time",
    input: z.object({
      repoFullName: z.string(),
    }),
    output: [
      {
        name: "Time",
        schema: z.object({
          iso: z.string(),
        }),
      },
    ],
    resolve: withFilter(
      () => pubSub.asyncIterator(["time"]),
      (payload, variables) => {
        return payload.time.iso.includes(variables.repoFullName);
      },
    ),
  }),
);
testGraphqlDeclarations.add(
  new GraphqlActionMetadata({
    root: GraphqlMethods.Subscription,
    name: "asyncType",
    input: z.object({
      input: z.string().default("test"),
      x: z.number().default(1),
    }),
    output: [
      {
        name: "AsyncTypeReturn",
        schema: z.object({
          word: z.string(),
          id: z.string(),
          title: z.string(),
          input: z.string(),
          x: z.number(),
        }),
      },
    ],
    //
    resolve: async function* (a, { input, x }, context) {
      for await (const word of ["Hello", "Bonjour", "Ciaso"]) {
        await sleep(200);
        const d = await context.prisma.post.findFirst();
        yield {
          asyncType: {
            word,
            id: d?.id || "",
            title: d?.title || "",
            input,
            x,
          },
        };
      }
    },
  }),
);

export { testGraphqlDeclarations };
