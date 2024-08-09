import { JobsOptions, Queue } from "bullmq";
import { GlobalContext } from "~/common/context";
import { buildQueue } from "~/lib/bull/queueBuilder";

export const QUEUEKEY_SMS = "sms-queue";

export type QueueJobTypeSMS = {
  groupID: string;
  groupName: string;
  contactID: string;
  contactName: string;
  type: string;
  message: string;
  offTimeConfig?: {
    timezone: string;
  };
  forceSend?: boolean;
};

export const queueObject: {
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

export function msToTime(duration: number) {
  let milliseconds = (duration % 1000) / 100,
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = hours < 10 ? 0 + hours : hours;
  minutes = minutes < 10 ? 0 + minutes : minutes;
  seconds = seconds < 10 ? 0 + seconds : seconds;

  return `${hours} hours, ${minutes} minutes, ${seconds} seconds`;
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

  // console.log("test");

  if (groupData?.availability_enabled) {
    const availability_start = groupData.availability_start ?? 8; // 8am
    const availability_end = groupData.availability_end ?? 18; // 6pm

    const currentHour = new Date(groupTime).getHours();

    if (currentHour < availability_start || currentHour >= availability_end) {
      // compute how many seconds until the next availability time
      let remainingHour;
      if (currentHour < availability_start) {
        remainingHour = availability_start - currentHour;
      } else {
        remainingHour = 24 - currentHour + availability_start;
      }
      const delay = remainingHour * 60 * 60 * 1000;

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
    } else {
      return false;
    }
  } else if (params.queueSendIfEmpty) {
    await addSMSJob({
      ...params.data,
      // forceSend: true,
    });
    return true;
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

  // console.log("Delayed jobs", delayedJobs.length);

  for (const job of delayedJobs) {
    await job.remove(); // Remove the delayed job

    // console.log("Rescheduling job", job.data);

    // if (!job.data?.message) {
    //   continue;
    // }

    // await scheduleDelay({
    //   context: args.context,
    //   groupID: job.data?.groupID,
    //   timezone: job.data?.offTimeConfig?.timezone,
    //   data: job.data,
    //   queueSendIfEmpty: true,
    // });
  }
};
