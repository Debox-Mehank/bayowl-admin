import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {
  DashboardInterfaceClass,
  useDashboardLazyQuery,
} from "../../generated/graphql";

export default function Dashboard() {
  const [data, setData] = useState<DashboardInterfaceClass[]>([]);
  const [getDashboard] = useDashboardLazyQuery();
  useEffect(() => {
    const getData = async () => {
      const response = await getDashboard();
      if (response.data) setData(response.data!.dashboardMet);
      console.log(response.data);
    };
    getData();
  }, []);

  return (
    <>
      {data.map((ind, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            backgroundColor: "#121212",
            borderRadius: "6px",
            height: "14.5vh",
            padding: "10px 22px 12px 13px",
            margin: "8px",
          }}
        >
          <div style={{ fontSize: "16px" }}>{ind.label}</div>
          <div style={{ fontSize: "46px" }}>{ind.data}</div>
        </div>
      ))}
    </>
  );
}
