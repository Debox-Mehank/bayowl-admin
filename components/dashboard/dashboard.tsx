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
      case DashboardEnum.NumberOfPaidService:
        return (
          data.find((el) => el.label === DashboardEnum.NumberOfPaidService)
            ?.data ?? 0
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
      case DashboardEnum.NumberOfServicesPendingAcceptanceCustomer:
        return (
          data.find(
            (el) =>
              el.label ===
              DashboardEnum.NumberOfServicesPendingAcceptanceCustomer
          )?.data ?? 0
        );
      case DashboardEnum.NumberOfServicesForRevision:
        return (
          data.find(
            (el) => el.label === DashboardEnum.NumberOfServicesForRevision
          )?.data ?? 0
        );
      default:
        return 0;
    }
  };

  const getTitleFor = (f: DashboardEnum): string => {
    switch (f) {
      case DashboardEnum.NumberOfCustomersRegistered:
        return "Total Customers Registered";
      case DashboardEnum.NumberOfCustomersWithPaidService:
        return "Total Paid Cutomers";
      case DashboardEnum.NumberOfPaidService:
        return "Total Services Bought";
      case DashboardEnum.NumberOfServicesCompleted:
        return "Total Services Completed";
      case DashboardEnum.NumberOfServicesInProgress:
        return "Total Services In Progress";
      case DashboardEnum.NumberOfServicesPendingAcceptance:
        return "Total Services Pending QA";
      case DashboardEnum.NumberOfServicesPendingAcceptanceCustomer:
        return "Total Services Confirmation Pending";
      case DashboardEnum.NumberOfServicesForRevision:
        return "Total Services For Revision";
      default:
        return "";
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <GridItem
          title={getTitleFor(DashboardEnum.NumberOfCustomersRegistered)}
          value={getValueFor(DashboardEnum.NumberOfCustomersRegistered)}
        />
      </Grid>
      <Grid item xs={4}>
        <GridItem
          title={getTitleFor(DashboardEnum.NumberOfCustomersWithPaidService)}
          value={getValueFor(DashboardEnum.NumberOfCustomersWithPaidService)}
        />
      </Grid>
      <Grid item xs={4}>
        <GridItem
          title={getTitleFor(DashboardEnum.NumberOfPaidService)}
          value={getValueFor(DashboardEnum.NumberOfPaidService)}
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
      <Grid item xs={6}>
        <GridItem
          title={getTitleFor(
            DashboardEnum.NumberOfServicesPendingAcceptanceCustomer
          )}
          value={getValueFor(
            DashboardEnum.NumberOfServicesPendingAcceptanceCustomer
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <GridItem
          title={getTitleFor(DashboardEnum.NumberOfServicesForRevision)}
          value={getValueFor(DashboardEnum.NumberOfServicesForRevision)}
        />
      </Grid>
    </Grid>
  );
};

export default Dashboard;
