import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import {
  DashboardInterfaceClass,
  useDashboardLazyQuery,
  DashboardEnum,
} from "../../generated/graphql";

const GridItem = ({ title, value }: { title: string; value: number }) => {
  return (
    <div
      style={{
        flex: 1,
        backgroundColor: "rgb(255 255 255 / 0.15)",
        borderRadius: "6px",
        height: "14.5vh",
        padding: "10px 22px 12px 13px",
        margin: "8px",
      }}
    >
      <div style={{ fontSize: "16px" }}>{title}</div>
      <div style={{ fontSize: "46px" }}>{value}</div>
    </div>
  );
};

export const Dashboard = () => {
  const [data, setData] = useState<DashboardInterfaceClass[]>([]);
  const [getDashboard] = useDashboardLazyQuery();
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const response = await getDashboard({ fetchPolicy: "network-only" });
      setLoading(false);
      if (response.data) setData(response.data!.dashboardMet);
    };
    getData();
  }, []);

  const getValueFor = (f: DashboardEnum): number => {
    switch (f) {
      case DashboardEnum.NumberOfCustomersRegistered:
        return (
          data.find(
            (el) => el.label === DashboardEnum.NumberOfCustomersRegistered
          )?.data ?? 0
        );
      case DashboardEnum.NumberOfCustomersWithPaidService:
        return (
          data.find(
            (el) => el.label === DashboardEnum.NumberOfCustomersWithPaidService
          )?.data ?? 0
        );
      case DashboardEnum.NumberOfServicesCompleted:
        return (
          data.find(
            (el) => el.label === DashboardEnum.NumberOfServicesCompleted
          )?.data ?? 0
        );
      case DashboardEnum.NumberOfServicesInProgress:
        return (
          data.find(
            (el) => el.label === DashboardEnum.NumberOfServicesInProgress
          )?.data ?? 0
        );
      case DashboardEnum.NumberOfServicesPendingAcceptance:
        return (
          data.find(
            (el) => el.label === DashboardEnum.NumberOfServicesPendingAcceptance
          )?.data ?? 0
        );
      default:
        return 0;
    }
  };

  const getTitleFor = (f: DashboardEnum): string => {
    switch (f) {
      case DashboardEnum.NumberOfCustomersRegistered:
        return "Cutomers Registered";
      case DashboardEnum.NumberOfCustomersWithPaidService:
        return "Paid Customers";
      case DashboardEnum.NumberOfServicesCompleted:
        return "Services Completed";
      case DashboardEnum.NumberOfServicesInProgress:
        return "Services In Progress";
      case DashboardEnum.NumberOfServicesPendingAcceptance:
        return "Service Pending Acceptance";
      default:
        return "";
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <GridItem
          title={getTitleFor(DashboardEnum.NumberOfCustomersRegistered)}
          value={getValueFor(DashboardEnum.NumberOfCustomersRegistered)}
        />
      </Grid>
      <Grid item xs={6}>
        <GridItem
          title={getTitleFor(DashboardEnum.NumberOfCustomersWithPaidService)}
          value={getValueFor(DashboardEnum.NumberOfCustomersWithPaidService)}
        />
      </Grid>
      <Grid item xs={4}>
        <GridItem
          title={getTitleFor(DashboardEnum.NumberOfServicesCompleted)}
          value={getValueFor(DashboardEnum.NumberOfServicesCompleted)}
        />
      </Grid>
      <Grid item xs={4}>
        <GridItem
          title={getTitleFor(DashboardEnum.NumberOfServicesInProgress)}
          value={getValueFor(DashboardEnum.NumberOfServicesInProgress)}
        />
      </Grid>
      <Grid item xs={4}>
        <GridItem
          title={getTitleFor(DashboardEnum.NumberOfServicesPendingAcceptance)}
          value={getValueFor(DashboardEnum.NumberOfServicesPendingAcceptance)}
        />
      </Grid>
    </Grid>
  );
};

export default Dashboard;
