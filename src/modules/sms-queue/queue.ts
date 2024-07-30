import { JobsOptions, Queue } from "bullmq";
import moment from "moment";
import { GlobalContext } from "~/common/context";
import { buildQueue } from "~/lib/bull/queueBuilder";

export const QUEUEKEY_SMS = "sms-queue";

export type QueueJobTypeSMS = {
  groupID: string;
  contactID: string;
  message: string;
  offTimeConfig?: {
    timezone: string;
  };
  forceSend?: boolean;
};

const queueObject: {
  queue: Queue | null;
} = {
  queue: null,
};

export const addSMSJob = async (job: QueueJobTypeSMS, opts?: JobsOptions) => {
  if (!queueObject.queue) {
    queueObject.queue = await buildQueue({ name: QUEUEKEY_SMS });
  }
  queueObject.queue.add(Date.now().toString(), job, opts);
};

function msToTime(duration: number) {
  let milliseconds = (duration % 1000) / 100,
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = hours < 10 ? 0 + hours : hours;
  minutes = minutes < 10 ? 0 + minutes : minutes;
  seconds = seconds < 10 ? 0 + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds;
}

export async function scheduleDelay(params: {
  context: GlobalContext;
  groupID: string;
  timezone: string;
  data: QueueJobTypeSMS;
  queueSendIfEmpty?: boolean;
}) {
  // check if its 5pm onward in the group timezone
  const groupTime = new Date().toLocaleString("en-US", {
    timeZone: params.timezone,
  });

  const groupData = await params.context.prisma.group.findFirst({
    where: {
      id: params.groupID,
    },
  });

  if (groupData?.availability_enabled) {
    const availability_start = groupData.availability_start ?? 8; // 8am
    const availability_end = groupData.availability_end ?? 18; // 6pm

    const currentHour = new Date(groupTime).getHours();

    if (currentHour < availability_start || currentHour >= availability_end) {
      // reschedule sms for the next day
      let delay;
      if (currentHour >= availability_end) {
        // Schedule for the next day
        const nextAvailableTime = moment()
          .add(1, "days")
          .set({ hour: availability_start, minute: 0, second: 0 });
        delay = nextAvailableTime.diff(moment());
      } else {
        // Schedule for later today
        const nextAvailableTime = moment().set({
          hour: availability_start,
          minute: 0,
          second: 0,
        });
        delay = nextAvailableTime.diff(moment());
      }

      // delay = 60000; // 60 seconds for testing

      console.log("Rescheduling SMS for later", msToTime(delay));

      await addSMSJob(
        {
          ...params.data,
          // forceSend: true,
        },
        {
          delay,
        },
      );

      return true;
    } else if (params.queueSendIfEmpty) {
      // console.log("Group availability is disabled");
      await addSMSJob(params.data);
    }
  } else if (params.queueSendIfEmpty) {
    // console.log("Group availability is disabled");
    await addSMSJob(params.data);
  }

  return false;
}

export const updateQueuedSMSJob = async (args: {
  context: GlobalContext;
  newStartTime: number;
  newEndTime: number;
}) => {
  if (!queueObject.queue) {
    queueObject.queue = await buildQueue({ name: QUEUEKEY_SMS });
  }

  const delayedJobs = await queueObject.queue.getDelayed();

  for (const job of delayedJobs) {
    await job.remove(); // Remove the delayed job

    // console.log("Rescheduling job", job.data);

    if (!job.data?.message) {
      continue;
    }

    await scheduleDelay({
      context: args.context,
      groupID: job.data?.groupID,
      timezone: job.data?.offTimeConfig?.timezone,
      data: job.data,
      queueSendIfEmpty: true,
    });
  }
};
