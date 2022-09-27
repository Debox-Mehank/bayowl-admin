import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
  Snackbar,
  Switch,
  Tab,
  Tabs,
} from "@mui/material";
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridToolbar,
} from "@mui/x-data-grid";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  Payment,
  PaymentConfig,
  useGetAllPaymentConfigLazyQuery,
  useGetAllPaymentLazyQuery,
  useUpdatePaymentConfigLazyQuery,
} from "../../generated/graphql";

export type PaymentConfigFinal = Omit<PaymentConfig, "createdAt">;

const CELL_WIDTH = 180;

export default function Payments() {
  const [getAllPayment] = useGetAllPaymentLazyQuery();
  const [getAllPaymentConfig] = useGetAllPaymentConfigLazyQuery();
  const [updatePaymentConfigQuery] = useUpdatePaymentConfigLazyQuery();

  const [data, setData] = useState<Payment[]>([]);
  const [configData, setConfigData] = useState<PaymentConfigFinal[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [confimationDialog, setConfimationDialog] = useState<boolean>(false);
  const [selectedConfig, setSelectedConfig] = useState<PaymentConfig>();
  const [showSnack, setShowSnack] = useState<boolean>(false);
  const [snackMessage, setSnackMessage] = useState<string>("");

  useEffect(() => {
    const fetchServices = async () => {
      if (selectedTab === 0) {
        setLoading(true);
        const response = await getAllPayment({ fetchPolicy: "network-only" });
        if (response.data?.getAllPayment) {
          setData(
            response.data?.getAllPayment.map((ind) => ({
              ...ind,
              id: ind._id,
              createdAt: moment(ind.createdAt).format("MMM Do YY, hh:mm a"),
              updatedAt: moment(ind.updatedAt).format("MMM Do YY, hh:mm a"),
            })) ?? []
          );
        }
        setLoading(false);
      } else if (selectedTab === 1) {
        setLoading(true);
        const response = await getAllPaymentConfig({
          fetchPolicy: "network-only",
        });
        if (response.data?.getAllPaymentConfig) {
          setConfigData(
            response.data?.getAllPaymentConfig.map((ind) => ({
              ...ind,
              id: ind._id,
              lastUpdatedByString: ind.lastUpdatedBy?.name ?? "",
              updatedAtString: moment(ind.updatedAt).format(
                "MMM Do YY, hh:mm a"
              ),
            })) ?? []
          );
        }
        setLoading(false);
      }
    };
    fetchServices();
  }, [selectedTab]);

  const [columns, setColumns] = useState<GridColDef[]>([
    { field: "email", headerName: "Email", width: CELL_WIDTH },
    { field: "orderId", headerName: "Order Id", width: CELL_WIDTH },
    { field: "paymentId", headerName: "Payment Id", width: CELL_WIDTH },
    {
      field: "paymentLinkId",
      headerName: "Payment Link Id",
      width: CELL_WIDTH,
    },
    { field: "signature", headerName: "Signature", width: CELL_WIDTH },
    {
      field: "userServiceId",
      headerName: "User Service Id",
      width: CELL_WIDTH,
    },
    { field: "amount", headerName: "Amount", width: CELL_WIDTH },
    { field: "status", headerName: "Status", width: CELL_WIDTH },
    { field: "createdAt", headerName: "Created At", width: CELL_WIDTH },
    { field: "updatedAt", headerName: "Updated At", width: CELL_WIDTH },
  ]);
  const [columns1, setColumns1] = useState<GridColDef[]>([
    {
      field: "active",
      headerName: "Active",
      width: 180,
      renderCell: (cellValues: GridCellParams<PaymentConfigFinal>) => {
        return (
          <Switch
            checked={cellValues.row.active}
            inputProps={{ "aria-label": "controlled" }}
            onChange={(e) => {
              setSelectedConfig(cellValues.row);
              setConfimationDialog(true);
            }}
          />
        );
      },
    },
    { field: "type", headerName: "Type", width: CELL_WIDTH },
    { field: "value", headerName: "Value", width: CELL_WIDTH },
    {
      field: "lastUpdatedByString",
      headerName: "Last Updated By",
      width: CELL_WIDTH,
    },
    {
      field: "updatedAtString",
      headerName: "Last Updated At",
      width: CELL_WIDTH,
    },
  ]);

  const handleConfirm = async () => {
    if (!selectedConfig) {
      setSelectedConfig(undefined);
      setConfimationDialog(false);
      setShowSnack(true);
      setSnackMessage("Something went wrong, try again later.");
      return;
    }

    setLoading(true);

    const { data, error } = await updatePaymentConfigQuery({
      variables: { gst: !selectedConfig.active },
    });

    // Handling Errors
    if (error) {
      setLoading(false);
      setSnackMessage(error.message.toString());
      setShowSnack(true);
      return;
    }
    if (!data || !data.updatePaymentConfig) {
      setLoading(false);
      setSnackMessage("Something went wrong, try again later.");
      setShowSnack(true);
      return;
    }

    const oldArr = [...configData];
    const findElemIdx = oldArr.findIndex((el) => el._id === selectedConfig._id);
    if (findElemIdx >= 0) {
      oldArr[findElemIdx].active = !selectedConfig.active;
    }

    setConfigData(oldArr);
    setSelectedConfig(undefined);
    setConfimationDialog(false);
    setShowSnack(true);
    setSnackMessage("Data updated successfully");
    setLoading(false);
  };

  return (
    <div
      style={{
        height: "82.3vh",
        color: "black",
      }}
    >
      <Tabs value={selectedTab} centered>
        <Tab label="Transactions" onClick={() => setSelectedTab(0)} />
        <Tab label="Configs" onClick={() => setSelectedTab(1)} />
      </Tabs>
      {selectedTab === 0 && (
        <DataGrid
          rows={data}
          columns={columns}
          components={{
            Toolbar: GridToolbar,
            LoadingOverlay: LinearProgress,
          }}
          pageSize={10}
          rowsPerPageOptions={[5]}
          checkboxSelection
          loading={loading}
        />
      )}
      {selectedTab === 1 && (
        <DataGrid
          rows={configData}
          columns={columns1}
          components={{
            Toolbar: GridToolbar,
            LoadingOverlay: LinearProgress,
          }}
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection
          loading={loading}
        />
      )}

      {/* Alert Dialog */}
      <Dialog
        open={confimationDialog}
        onClose={() => setConfimationDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Once you change this all the services will be shown{" "}
            {selectedConfig?.active ? "without" : "with"} the gst amount
            included in the final price.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setConfimationDialog(false);
              setSelectedConfig(undefined);
            }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={handleConfirm} autoFocus disabled={loading}>
            Continue
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={showSnack}
        autoHideDuration={2000}
        onClose={() => setShowSnack(false)}
        message={snackMessage}
      />
    </div>
  );
}
