import { PageContainer } from "@keystone-6/core/admin-ui/components";
import { Heading } from "@keystone-ui/core";
import React from "react";

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
    <div
      style={{
        boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)",
        padding: "10px",
        borderRadius: "5px",
        width: "200px",
        // create a background of diagonal linear gradient, beautiful color please
        background: "linear-gradient(45deg, #f3ec7877, #af426177)",
      }}
    >
      {Object.keys(data).map((key) => (
        <h3
          key={key}
          style={{
            margin: "0",
            padding: "0",
            fontSize: "2.2em",
          }}
        >
          {data[key]}
        </h3>
      ))}
      <p>{title}</p>
    </div>
  );
}

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
  const [serverLoaded, setServerLoaded] = React.useState(false);
  const [reactionLoaded, setReactionLoaded] = React.useState(false);

  const getServerPing = async () => {
    const res = await fetch("/api/health/?database=true&s3=true&unified=false");
    const data = await res.json();
    setPingData(data);
    setServerLoaded(true);
  };
  const getReactionPing = async () => {
    const res = await fetch("/api/logs/analytics");
    const data = await res.json();
    setReactionData(data);
    setReactionLoaded(true);
  };

  React.useEffect(() => {
    getServerPing();
    getReactionPing();
  }, []);

  return (
    <PageContainer header={<Heading type="h3">Stats</Heading>}>
      <h1
        style={{
          width: "100%",
          textAlign: "center",
        }}
      >
        Server Statistics
      </h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
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
      </div>
      <div style={{ height: "100px" }}></div>
    </PageContainer>
  );
}
