import { GlobalContext } from "~/common/context";
import { sendGHLMessage } from "~modules/gohighlevel/service/sendGHLMessage";
import { QueueJobTypeSMS, scheduleDelay } from "../queue";

export const sendSMS = async (args: {
  data: QueueJobTypeSMS;
  context: GlobalContext;
}) => {
  const data = args.data;

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
};
