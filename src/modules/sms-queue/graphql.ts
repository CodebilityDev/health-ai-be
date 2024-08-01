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
        name: "QueuePendingMessage",
        isMain: true,
        schema: z.array(
          z.object({
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
        ),
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

      const returnObject = delayedJobs.map((job) => {
        return {
          id: job.id,
          data: job.data as QueueJobTypeSMS,
          delay: job.timestamp - Date.now(),
          delayString: msToTime(job.timestamp - Date.now()),
        };
      });

      return returnObject;
    },
  }),
);

export { messageQueueGqlDeclaration };
