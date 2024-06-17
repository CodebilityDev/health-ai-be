import React from "react";
import GlobalTemplate from "../components/GlobalTemplate";

export default function CustomPage() {
  const [wsDocs, setWsDocs] = React.useState<null | any>(null);
  const loadDocs = async () => {
    const res = await fetch("/ws/docs");
    const data = await res.json();
    setWsDocs(data);
  };
  React.useEffect(() => {
    loadDocs();
  }, []);

  return (
    <GlobalTemplate headerTitle="Socket Test">
      <h1
        style={{
          width: "100%",
          textAlign: "center",
        }}
      >
        Socket.IO Tester
      </h1>
      <div className="flex w-full">
        <div className="flex-1">
          <div>
            <p>Select App</p>
            <select>
              <option>App 1</option>
              <option>App 2</option>
            </select>
          </div>
          <div>
            <p>Select Namespace</p>
            <select>
              <option>App 1</option>
              <option>App 2</option>
            </select>
          </div>
        </div>
        <div className="flex-1 p-2 font-mono whitespace-pre-wrap bg-gray-100 min-h-[65vh] overflow-y-auto">
          A
        </div>
      </div>
    </GlobalTemplate>
  );
}
