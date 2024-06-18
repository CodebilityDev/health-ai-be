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

export const responseBreakdown = async (context: GlobalContext) => {
  // compute the average response time for each unique path and graphql query
  const logs = await context.prisma.serverLog.findMany({
    where: {
      createdAt: {
        gte: new Date(Date.now() - 1000 * 60 * 60 * 12),
      },
    },
  });

  const paths: {
    method: string;
    key: string;
    url: string;
    graphql: string;
    count: number;
    average: number;
    lowest: number;
    highest: number;
  }[] = [];

  const uniquePathGraphql = logs.reduce(
    (acc, curr) => {
      const key = `${curr.method} ${curr.url} ${curr.graphql}`;
      if (!acc[key]) {
        acc[key] = {
          count: 0,
          total: 0,
          lowest: 0,
          highest: 0,
        };
      }
      acc[key].count += 1;
      acc[key].total += parseInt(curr.elapsed);
      acc[key].lowest = acc[key].lowest
        ? Math.min(acc[key].lowest, parseInt(curr.elapsed))
        : parseInt(curr.elapsed);
      acc[key].highest = acc[key].highest
        ? Math.max(acc[key].highest, parseInt(curr.elapsed))
        : parseInt(curr.elapsed);
      return acc;
    },
    {} as Record<
      string,
      { count: number; total: number; lowest: number; highest: number }
    >,
  );

  for (const key in uniquePathGraphql) {
    const [method, url, graphql] = key.split(" ");
    const { count, total, lowest, highest } = uniquePathGraphql[key];
    paths.push({
      method,
      key,
      url,
      graphql,
      count,
      average: total / count,
      lowest,
      highest,
    });
  }

  // sprt the paths by average response time
  paths.sort((a, b) => b.average - a.average);

  return paths;
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
  "/breakdown",
  new RouteDeclarationMetadata({
    inputParser: NO_INPUT,

    func: async ({ context, res }) => {
      const analytics = await responseBreakdown(context);
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
