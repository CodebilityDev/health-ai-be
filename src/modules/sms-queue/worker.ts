import { GlobalContext } from "~/common/context";
import { buildlWorker } from "~/lib/bull/workerBuilder";
import { QueueJobTypeSMS, QUEUEKEY_SMS } from "./queue";
import { sendSMS } from "./service/sendSMS";

export async function smsQueueWorker(args: { context: GlobalContext }) {
  console.log("Starting SMS queue worker");

  await buildlWorker({
    name: QUEUEKEY_SMS,
    async process(job) {
      await sendSMS({
        data: job.data as QueueJobTypeSMS,
        context: args.context,
      });
    },
    async completed(job) {
      // console.log("Completed job", job.id);
      return;
    },
  });
}
