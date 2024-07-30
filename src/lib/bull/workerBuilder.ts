import { Job, Worker } from "bullmq";
import { CONFIG } from "~/common/env";

export const buildlWorker = <T>(args: {
  name: string;
  process: (job: Job<T>) => Promise<void>;
  completed: (job: Job<T>) => Promise<void>;
}) => {
  const worker = new Worker(
    args.name,
    async (job: Job<T>) => {
      await args.process(job);
    },
    {
      connection: {
        host: CONFIG.REDISQUEUE_HOST,
        port: parseInt(CONFIG.REDISQUEUE_PORT),
        password: CONFIG.REDISQUEUE_PASS,
      },
    },
  );

  worker.on("completed", (job) => {
    args.completed(job);
  });
};
