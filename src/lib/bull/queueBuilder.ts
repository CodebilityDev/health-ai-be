import { Queue } from "bullmq";
import { CONFIG } from "~/common/env";

export const buildQueue = (args: { name: string }) => {
  // console.log("Starting queue", args.name);

  const q = new Queue(args.name, {
    connection: {
      host: CONFIG.REDISQUEUE_HOST,
      port: parseInt(CONFIG.REDISQUEUE_PORT),
      password: CONFIG.REDISQUEUE_PASS,
    },
  });

  // console.log("Queue started", args.name);

  return q;
};
