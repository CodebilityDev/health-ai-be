import React from "react";
import GlobalTemplate from "../components/GlobalTemplate";

function byteToString(bytes: number) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i)) + " " + sizes[i];
}

function roundToTwo(num: number, precision = 2) {
  return +(Math.round(Number(num + "e" + precision)) + "e-" + precision);
}

function numberToSeconds(number: number) {
  return roundToTwo(number / 1000, 3) + " s";
}

function CardComponent({ title, data }: { title: string; data: any }) {
  return (
    <div className="p-4 border border-gray-200 rounded-md shadow-md bg-gradient-to-br from-yellow-200 to-pink-200 w-[200px]">
      {Object.keys(data).map((key) => (
        <h3 key={key} className="text-4xl font-semibold min-h-[4rem]">
          {data[key]}
        </h3>
      ))}
      <p>{title}</p>
    </div>
  );
}

const METHOD_COLORS = {
  GET: "#009b00",
  POST: "#a000009d",
  PUT: "#0000be",
  DELETE: "#a100a1",
};

export default function CustomPage() {
  const [pingData, setPingData] = React.useState<null | {
    database: boolean;
    s3: boolean;
    unified: boolean;
  }>(null);
  const [reactionData, setReactionData] = React.useState<null | {
    averageResponseTime: number;
    minResponseTime: number;
    maxResponseTime: number;
    firstQuartile: number;
    median: number;
    thirdQuartile: number;
    requestCount: number;
    memoryUsage: {
      rss: number;
      heapTotal: number;
      heapUsed: number;
      external: number;
    };
    cpuUsage: {
      user: number;
      system: number;
    };
  }>(null);
  const [breakdownData, setBreakdownData] = React.useState<
    | null
    | {
        method: string;
        key: string;
        url: string;
        graphql: string;
        count: number;
        average: number;
        lowest: number;
        highest: number;
      }[]
  >(null);

  const [serverBreakdownFilter, setServerBreakdownFilter] =
    React.useState<string>("");

  const getServerPing = async () => {
    const res = await fetch("/api/health/?database=true&s3=true&unified=false");
    const data = await res.json();
    setPingData(data);
  };
  const getReactionPing = async () => {
    const res = await fetch("/api/logs/analytics");
    const data = await res.json();
    setReactionData(data);
  };
  const getBreakdown = async () => {
    const res = await fetch("/api/logs/breakdown");
    const data = await res.json();
    setBreakdownData(data);
  };

  React.useEffect(() => {
    getServerPing();
    getReactionPing();
    getBreakdown();
  }, []);

  return (
    <GlobalTemplate headerTitle="Stats">
      <h1
        style={{
          width: "100%",
          textAlign: "center",
        }}
      >
        Server Statistics
      </h1>
      <div className="flex flex-col gap-4">
        <h2>Server Ping</h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "4.5px",
            flexDirection: "row",
          }}
        >
          <CardComponent
            title="Database"
            data={{
              Status: pingData?.database ? "✅" : "❌",
            }}
          />
          <CardComponent
            title="S3"
            data={{
              Status: pingData?.s3 ? "✅" : "❌",
            }}
          />
          <CardComponent
            title="Request Count"
            data={{
              Count: reactionData?.requestCount,
            }}
          />
          <CardComponent
            title="Memory Usage"
            data={{
              Used: byteToString(reactionData?.memoryUsage.heapUsed ?? 0),
            }}
          />
        </div>
        <h2>Server Reaction</h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "4.5px",
            flexDirection: "row",
          }}
        >
          <CardComponent
            title="Average Response Time"
            data={{
              Time: numberToSeconds(reactionData?.averageResponseTime ?? 0),
            }}
          />
          <CardComponent
            title="First Quartile"
            data={{
              Time: numberToSeconds(reactionData?.firstQuartile ?? 0),
            }}
          />
          <CardComponent
            title="Median"
            data={{
              Time: numberToSeconds(reactionData?.median ?? 0),
            }}
          />
          <CardComponent
            title="Third Quartile"
            data={{
              Time: numberToSeconds(reactionData?.thirdQuartile ?? 0),
            }}
          />
          <CardComponent
            title="Min Response Time"
            data={{
              Time: numberToSeconds(reactionData?.minResponseTime ?? 0),
            }}
          />
          <CardComponent
            title="Max Response Time"
            data={{
              Time: numberToSeconds(reactionData?.maxResponseTime ?? 0),
            }}
          />
        </div>
        <h2>Server Breakdown</h2>
        <div>
          <input
            type="text"
            value={serverBreakdownFilter}
            onChange={(e) => setServerBreakdownFilter(e.target.value)}
            placeholder="Filter"
            className="p-2 border shadow-md"
          />
        </div>
        <div>
          {breakdownData
            ?.filter((data) => data.key.includes(serverBreakdownFilter))
            ?.map((data) => (
              <div key={data.key} className="p-2 border-b">
                <div className="flex items-center gap-2">
                  <h3 className="font-mono font-bold">
                    <span
                      style={{
                        color: METHOD_COLORS[data.method],
                      }}
                    >
                      {data.method}
                    </span>{" "}
                    {data.url}{" "}
                  </h3>
                  {data.graphql && (
                    <p className="p-1 font-mono bg-gray-200 w-fit">
                      [{data.graphql}]
                    </p>
                  )}
                </div>
                <div className="flex gap-2 font-mono">
                  <p>
                    <span className="text-gray-400">Cnt:</span> {data.count}
                  </p>
                  <p>
                    <span className="text-gray-400">Low:</span>{" "}
                    {numberToSeconds(data.lowest)}
                  </p>
                  <p>
                    <span className="text-gray-400">Ave:</span>{" "}
                    {numberToSeconds(data.average)}
                  </p>
                  <p>
                    <span className="text-gray-400">Hi:</span>{" "}
                    {numberToSeconds(data.highest)}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div style={{ height: "100px" }}></div>
    </GlobalTemplate>
  );
}
