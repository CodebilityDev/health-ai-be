import { GlobalContext } from "~/common/context";
import { buildlWorker } from "~/lib/bull/workerBuilder";
import { sendGHLMessage } from "~modules/gohighlevel/service/sendGHLMessage";
import { QueueJobTypeSMS, QUEUEKEY_SMS, scheduleDelay } from "./queue";

export async function smsQueueWorker(args: { context: GlobalContext }) {
  console.log("Starting SMS queue worker");

  await buildlWorker({
    name: QUEUEKEY_SMS,
    async process(job) {
      // console.log("Processing job", job.data);
      const data = job.data as QueueJobTypeSMS;

      if (data.offTimeConfig?.timezone && !data.forceSend) {
        if (
          await scheduleDelay({
            context: args.context,
            groupID: data.groupID,
            timezone: data.offTimeConfig.timezone,
            data,
          })
        ) {
          return;
        }
      }

      (async () => {
        // Send the app in the background
        await sendGHLMessage({
          context: args.context,
          groupID: data.groupID,
          input: {
            contactID: data.contactID,
            message: data.message,
            type: data.type,
          },
        });
      })();
    },
    async completed(job) {
      // console.log("Completed job", job.id);
      return;
    },
  });
}
