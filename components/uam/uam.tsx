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
  useGetAllUserLazyQuery,
  User,
  useUpdateFreeUserLazyQuery,
} from "../../generated/graphql";

export type CustomerUserOmit = Omit<User, "services">;

interface CustomUser extends CustomerUserOmit {
  id: string;
  numberOfService: number;
}

const CELL_WIDTH = 180;

export default function UAM() {
  const [getAllUser] = useGetAllUserLazyQuery();
  const [updateFreeUserQuery] = useUpdateFreeUserLazyQuery();

  const [data, setData] = useState<CustomUser[]>([]);
  const [confimationDialog, setConfimationDialog] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<CustomUser>();
  const [showSnack, setShowSnack] = useState<boolean>(false);
  const [snackMessage, setSnackMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      const response = await getAllUser({ fetchPolicy: "network-only" });
      console.log(response.error?.message);
      if (response.data?.getAllUser) {
        console.log(response.data?.getAllUser);
        setData(
          response.data?.getAllUser.map((el) => ({
            ...el,
            id: el._id,
            numberOfService: el.services.length,
            lastLoggedIn: moment(el.lastLoggedIn).format("MMM Do YY, hh:mm a"),
            createdAt: moment(el.createdAt).format("MMM Do YY, hh:mm a"),
            updatedAt: moment(el.updatedAt).format("MMM Do YY, hh:mm a"),
          }))
        );
      }
      setLoading(false);
    };
    fetchServices();
  }, []);

  const [columns, setColumns] = useState<GridColDef[]>([
    {
      field: "free",
      headerName: "Free Services",
      width: 180,
      renderCell: (cellValues: GridCellParams<CustomUser>) => {
        return (
          <Switch
            checked={cellValues.row.free}
            inputProps={{ "aria-label": "controlled" }}
            onChange={(e) => {
              setSelectedUser(cellValues.row);
              setConfimationDialog(true);
            }}
          />
        );
      },
    },
    { field: "name", headerName: "Name", width: CELL_WIDTH },
    { field: "email", headerName: "Email", width: CELL_WIDTH },
    { field: "number", headerName: "Number", width: CELL_WIDTH },
    {
      field: "numberOfService",
      headerName: "Number Of Service",
      width: CELL_WIDTH,
    },
    {
      field: "accountVerified",
      headerName: "Account Verified",
      width: CELL_WIDTH,
    },
    { field: "lastLoggedIn", headerName: "Last Logged In", width: CELL_WIDTH },
    { field: "createdAt", headerName: "Created At", width: CELL_WIDTH },
    { field: "updatedAt", headerName: "Updated At", width: CELL_WIDTH },
  ]);

  const handleConfirm = async () => {
    if (!selectedUser) {
      setSelectedUser(undefined);
      setConfimationDialog(false);
      setShowSnack(true);
      setSnackMessage("Something went wrong, try again later.");
      return;
    }

    setLoading(true);

    const { data: updateData, error } = await updateFreeUserQuery({
      variables: {
        free: !selectedUser.free,
        updateFreeUserId: selectedUser._id,
      },
    });

    // Handling Errors
    if (error) {
      setLoading(false);
      setSnackMessage(error.message.toString());
      setShowSnack(true);
      return;
    }
    if (!updateData || !updateData.updateFreeUser) {
      setLoading(false);
      setSnackMessage("Something went wrong, try again later.");
      setShowSnack(true);
      return;
    }

    const oldArr = [...data];
    const findElemIdx = oldArr.findIndex((el) => el._id === selectedUser._id);
    if (findElemIdx >= 0) {
      oldArr[findElemIdx].free = !selectedUser.free;
    }

    setData(oldArr);
    setSelectedUser(undefined);
    setConfimationDialog(false);
    setShowSnack(true);
    setSnackMessage("Data updated successfully");
    setLoading(false);
  };

  return (
    <>
      <DataGrid
        rows={data}
        columns={columns}
        components={{
          Toolbar: GridToolbar,
          LoadingOverlay: LinearProgress,
        }}
        pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection
        loading={loading}
      />

      {/* Confirmation Dialog */}
      <Dialog
        open={confimationDialog}
        onClose={() => setConfimationDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Once you {selectedUser?.free ? "disable" : "enable"} it{" "}
            {selectedUser?.name} will{" "}
            {selectedUser?.free ? "not be able" : "be able"} to add all the
            online services for free.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setConfimationDialog(false);
              setSelectedUser(undefined);
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
    </>
  );
}
