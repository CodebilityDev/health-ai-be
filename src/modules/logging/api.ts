import { GlobalContext } from "~/common/context";
import {
  RouteDeclarationList,
  RouteDeclarationMetadata,
} from "~/lib/rest/declarations";
import { NO_INPUT } from "~/lib/rest/types";

export const responseAnalytics = async (context: GlobalContext) => {
  // get the average, min, and max response time for the last 12 hours
  const logs = await context.prisma.serverLog.findMany({
    where: {
      createdAt: {
        gte: new Date(Date.now() - 1000 * 60 * 60 * 12),
      },
    },
  });

  const responseTimes = logs.map((log) => parseInt(log.elapsed));
  const averageResponseTime =
    responseTimes.reduce((acc, curr) => acc + curr, 0) / responseTimes.length;
  const minResponseTime = Math.min(...responseTimes);
  const maxResponseTime = Math.max(...responseTimes);

  // get the 25%, 50%, and 75% response time
  const sortedResponseTimes = responseTimes.sort((a, b) => a - b);
  const firstQuartile =
    sortedResponseTimes[Math.floor(sortedResponseTimes.length / 4)];
  const median =
    sortedResponseTimes[Math.floor(sortedResponseTimes.length / 2)];
  const thirdQuartile =
    sortedResponseTimes[Math.floor((sortedResponseTimes.length / 4) * 3)];

  // get memory usage and cpu usage
  const memoryUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();

  return {
    averageResponseTime,
    minResponseTime,
    maxResponseTime,
    firstQuartile,
    median,
    thirdQuartile,
    requestCount: logs.length,
    memoryUsage,
    cpuUsage,
  };
};

const responseAnalyticsRouteDeclaration = new RouteDeclarationList({
  path: "/logs",
});

responseAnalyticsRouteDeclaration.routes.set(
  "/analytics",
  new RouteDeclarationMetadata({
    inputParser: NO_INPUT,

    func: async ({ context, res }) => {
      const analytics = await responseAnalytics(context);
      res.json(analytics);
    },
  }),
);

responseAnalyticsRouteDeclaration.routes.set(
  "/errortest",
  new RouteDeclarationMetadata({
    inputParser: NO_INPUT,
    func: async ({ context }) => {
      throw new Error("This is a test error");
    },
  }),
);

export { responseAnalyticsRouteDeclaration };
