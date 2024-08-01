import { z } from "zod";
import { buildQueue } from "~/lib/bull/queueBuilder";
import {
  GraphqlActionMetadata,
  GraphqlMethodDeclarationList,
} from "~/lib/graphql/declarations";
import { msToTime, QueueJobTypeSMS, QUEUEKEY_SMS, queueObject } from "./queue";

const messageQueueGqlDeclaration = new GraphqlMethodDeclarationList();

messageQueueGqlDeclaration.add(
  new GraphqlActionMetadata({
    root: "Query",
    name: "queue_getPendingMessages",
    input: z.object({
      groupID: z.string(),
    }),
    output: [
      {
        name: "QueuePendingMessages",
        isMain: true,
        fields: {
          queue: "[QueuePendingMessage]",
        },
      },
      {
        name: "QueuePendingMessage",
        schema: z.object({
          id: z.string(),
          data: z.object({
            groupID: z.string().optional(),
            groupName: z.string().optional(),
            contactID: z.string().optional(),
            contactName: z.string().optional(),
            type: z.string().optional(),
            message: z.string().optional(),
            offTimeConfig: z
              .object({
                timezone: z.string().optional(),
              })
              .optional(),
            forceSend: z.boolean().optional(),
          }),
          delay: z.number(),
          delayString: z.string(),
        }),
      },
    ],
    inputRequired: false,
    resolve: async (_, input, context) => {
      if (!context.session) {
        throw new Error("Unauthorized");
      }

      const group = await context.prisma.group.findFirst({
        where: {
          id: input.groupID,
          members: {
            some: {
              userId: context.session.itemId,
            },
          },
        },
      });

      if (!group) {
        throw new Error("Unauthorized");
      }

      if (!queueObject.queue) {
        queueObject.queue = await buildQueue({ name: QUEUEKEY_SMS });
      }

      const delayedJobs = await queueObject.queue.getDelayed();

      const returnObject = delayedJobs
        .filter((job) => job.data.groupID === input.groupID)
        .map((job) => {
          const remTime = job.timestamp + (job.opts.delay ?? 0) - Date.now();
          return {
            id: job.id,
            data: job.data as QueueJobTypeSMS,
            delay: remTime,
            delayString: msToTime(remTime ?? 0),
          };
        });
      // console.log("returnObject", returnObject);

      return { queue: returnObject };
    },
  }),
);

messageQueueGqlDeclaration.add(
  new GraphqlActionMetadata({
    root: "Mutation",
    name: "queue_deletePendingMessage",
    input: z.object({
      groupID: z.string(),
      ids: z.array(z.string()),
    }),
    output: [
      {
        name: "QueuePendingMessages",
        isMain: true,
        fields: {
          queue: "[QueuePendingMessage]",
        },
      },
      {
        name: "QueuePendingMessage",
        schema: z.object({
          id: z.string(),
          data: z.object({
            groupID: z.string().optional(),
            groupName: z.string().optional(),
            contactID: z.string().optional(),
            contactName: z.string().optional(),
            type: z.string().optional(),
            message: z.string().optional(),
            offTimeConfig: z
              .object({
                timezone: z.string().optional(),
              })
              .optional(),
            forceSend: z.boolean().optional(),
          }),
          delay: z.number(),
          delayString: z.string(),
        }),
      },
    ],
    inputRequired: false,
    resolve: async (_, input, context) => {
      if (!context.session) {
        throw new Error("Unauthorized");
      }

      const group = await context.prisma.group.findFirst({
        where: {
          id: input.groupID,
          members: {
            some: {
              userId: context.session.itemId,
            },
          },
        },
      });

      if (!group) {
        throw new Error("Unauthorized");
      }

      if (!queueObject.queue) {
        queueObject.queue = await buildQueue({ name: QUEUEKEY_SMS });
      }

      const delayedJobs = await queueObject.queue.getDelayed();

      const deletedJobs = [];

      for (const id of input.ids) {
        const job = delayedJobs.find((j) => j.id === id);
        if (job) {
          await queueObject.queue.remove(id);
          deletedJobs.push(job);
        }
      }

      return { queue: deletedJobs };
    },
  }),
);

export { messageQueueGqlDeclaration };
