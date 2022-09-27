import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  LinearProgress,
  MenuItem,
  Modal,
  Select,
  Snackbar,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridToolbar,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import {
  AdminRole,
  DashboardContent,
  useAddAdminMutation,
  useAddDashboardContentLazyQuery,
  useAllDashboardContentLazyQuery,
  useDeleteDashboardContentLazyQuery,
  useGetContentUploadUrlLazyQuery,
  useToggleDashboardContentLazyQuery,
} from "../../generated/graphql";
import { LoadingButton } from "@mui/lab";
import DeleteIcon from "@mui/icons-material/Delete";
import moment from "moment";
import { ColorButton } from "../Button";

export default function DashboardContentPage() {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };
  const [deleteContentQuery] = useDeleteDashboardContentLazyQuery();
  const [toggleContentQuery] = useToggleDashboardContentLazyQuery();
  const [getAllContent] = useAllDashboardContentLazyQuery();
  const [getContentUploadUrlQuery] = useGetContentUploadUrlLazyQuery();
  const [data, setData] = useState<DashboardContent[]>([]);
  const [content, setContent] = useState<string>("");
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      const response = await getAllContent({ fetchPolicy: "network-only" });
      if (response.data?.allDashboardContent) {
        setData(
          response.data?.allDashboardContent.map((ind) => ({
            ...ind,
            id: ind._id!,
            lastUpdatedByName:
              ind.lastUpdatedBy !== null ? ind.lastUpdatedBy.name : "",
            createdByName: ind.createdBy !== null ? ind.createdBy.name : "",
            createdAt:
              ind.createdAt !== null
                ? moment(ind.createdAt).format("MMM Do YY, hh:mm a")
                : "",
            updatedAt:
              ind.updatedAt !== null
                ? moment(ind.updatedAt).format("MMM Do YY, hh:mm a")
                : "",
          })) ?? []
        );
      }
      setLoading(false);
    };
    fetchServices();
  }, []);
  const [columns, setColumns] = useState<GridColDef[]>([
    {
      field: "active",
      headerName: "Active",
      width: 180,
      renderCell: (cellValues: GridCellParams<DashboardContent>) => {
        return (
          <Switch
            checked={cellValues.row.active}
            inputProps={{ "aria-label": "controlled" }}
            onChange={(e) => {
              setSelectedContent(cellValues.row);
              setConfimationDialog(true);
            }}
          />
        );
      },
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 100,
      renderCell: (cellValues: GridCellParams<DashboardContent>) => {
        return (
          <IconButton
            aria-label="delete"
            onClick={() => {
              setSelectedContent(cellValues.row);
              setConfimationDialogDelete(true);
            }}
          >
            <DeleteIcon />
          </IconButton>
        );
      },
    },
    { field: "image", headerName: "Image", width: 180 },
    { field: "lastUpdatedByName", headerName: "Last Updated By", width: 180 },
    { field: "createdByName", headerName: "Created By", width: 180 },
    { field: "createdAt", headerName: "Created At", width: 180 },
    { field: "updatedAt", headerName: "Updated At", width: 180 },
  ]);
  const [open, setOpen] = useState<boolean>(false);
  const [showSnack, setShowSnack] = useState<boolean>(false);
  const [snackMessage, setSnackMessage] = useState<string>();
  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarFilterButton />
        <GridToolbarExport />
        <Button onClick={() => setOpen(true)} startIcon={<AddIcon />}>
          Add Content
        </Button>
      </GridToolbarContainer>
    );
  }

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  const onClose = () => {
    setOpen(false);
    setContent("");
    setFile(undefined);
    setFileName("");
  };
  let inputFile: HTMLInputElement;
  const [file, setFile] = useState<File>();
  const [fileName, setFileName] = useState<string>("");
  const [addDashboardContent] = useAddDashboardContentLazyQuery();
  const handleSubmit = async () => {
    setLoadingButton(true);

    if (fileName === "" || !file) {
      //throw error
      return;
    }

    const fileType = `.${file.type.replace(/(.*)\//g, "")}`;

    const FileTypes = [".png", ".jpg", ".jpeg"];

    if (!FileTypes.includes(fileType)) {
      setSnackMessage(
        `Invalid upload format only ${FileTypes.join(", ")} are supported.`
      );
      setShowSnack(true);
      return;
    }

    let finalFileName = `dashboard_content_${Date.now()}${fileType}`;

    // Direct Upload The File To S3 using pre signed url
    const { data: s3Url, error: s3Error } = await getContentUploadUrlQuery({
      variables: { fileName: finalFileName },
    });

    // Handling Errors
    if (s3Error) {
      setLoading(false);
      setSnackMessage(s3Error.message.toString());
      setShowSnack(true);
      return;
    }
    if (!s3Url || !s3Url.getContentUploadUrl) {
      setLoading(false);
      setSnackMessage("Something went wrong, try again later.");
      setShowSnack(true);
      return;
    }

    await fetch(s3Url.getContentUploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: file,
    });
    // const imageUrl = s3Url.getContentUploadUrl.split("?")[0];

    const response = await addDashboardContent({
      variables: {
        input: {
          image: finalFileName,
        },
      },
    });

    if (response.error) {
      setSnackMessage(response.error.message);
      setShowSnack(true);
      //throw error
    }
    const respObj = response!.data!.addDashboardContent;
    const newObj = {
      ...respObj,
      id: respObj._id,
      image: `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT}/${respObj.image}`,
      lastUpdatedByName: respObj.lastUpdatedBy.name,
      createdByName: respObj.createdBy.name,
      createdAt: moment().format("MMM Do YY, hh:mm a"),
      // updatedAt: moment().format("MMM Do YY, hh:mm a"),
    };
    setData([...data, newObj]);
    onClose();
  };

  const [confimationDialog, setConfimationDialog] = useState<boolean>(false);
  const [confimationDialogDelete, setConfimationDialogDelete] =
    useState<boolean>(false);
  const [selectedContent, setSelectedContent] = useState<DashboardContent>();

  const handleConfirm = async () => {
    if (!selectedContent) {
      setConfimationDialog(false);
      setShowSnack(true);
      setSnackMessage("Something went wrong, try again later.");
      return;
    }

    setLoading(true);

    const { data: contentData, error } = await toggleContentQuery({
      variables: { toggleDashboardContentId: selectedContent._id },
      fetchPolicy: "network-only",
    });

    // Handling Errors
    if (error) {
      setLoading(false);
      setSnackMessage(error.message.toString());
      setShowSnack(true);
      return;
    }
    if (!contentData || !contentData.toggleDashboardContent) {
      setLoading(false);
      setSnackMessage("Something went wrong, try again later.");
      setShowSnack(true);
      return;
    }

    const oldArr = [...data];
    const findElemIdx = oldArr.findIndex(
      (el) => el._id === selectedContent._id
    );
    if (findElemIdx >= 0) {
      oldArr[findElemIdx].active = !oldArr[findElemIdx].active;
    }

    setData(oldArr);
    setSelectedContent(undefined);
    setConfimationDialog(false);
    setShowSnack(true);
    setSnackMessage("Data updated successfully");
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!selectedContent) {
      setConfimationDialogDelete(false);
      setShowSnack(true);
      setSnackMessage("Something went wrong, try again later.");
      return;
    }

    setLoading(true);

    const { data: contentData, error } = await deleteContentQuery({
      variables: {
        deleteDashboardContentId: selectedContent._id,
        image: new URL(selectedContent.image).pathname.toString(),
      },
      fetchPolicy: "network-only",
    });

    // Handling Errors
    if (error) {
      setLoading(false);
      setSnackMessage(error.message.toString());
      setShowSnack(true);
      return;
    }
    if (!contentData || !contentData.deleteDashboardContent) {
      setLoading(false);
      setSnackMessage("Something went wrong, try again later.");
      setShowSnack(true);
      return;
    }

    const oldArr = [...data];
    const newArr = oldArr.filter((el) => el._id !== selectedContent._id);

    setData(newArr);
    setSelectedContent(undefined);
    setConfimationDialogDelete(false);
    setShowSnack(true);
    setSnackMessage("Data deleted successfully");
    setLoading(false);
  };

  return (
    <>
      <DataGrid
        rows={data}
        columns={columns}
        components={{
          Toolbar: CustomToolbar,
          LoadingOverlay: LinearProgress,
        }}
        pageSize={10}
        rowsPerPageOptions={[5]}
        checkboxSelection
        loading={loading}
      />
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Stack spacing={2}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Content
            </Typography>
            <label htmlFor="contained-button-file">
              <input
                style={{ display: "none" }}
                ref={(input) => {
                  // assigns a reference so we can trigger it later
                  inputFile = input!;
                }}
                accept="image/*"
                id="contained-button-file"
                type="file"
                onChange={(e) => {
                  setFile(e.target.files![0]);
                  setFileName(e.target.files![0].name);
                }}
              />
            </label>
            {fileName !== "" && <Typography>{fileName}</Typography>}
            <Button
              onClick={() => inputFile.click()}
              startIcon={<FileUploadOutlinedIcon />}
            >
              Upload Image
            </Button>

            <LoadingButton
              variant="contained"
              onClick={handleSubmit}
              loading={loadingButton}
            >
              Submit
            </LoadingButton>
          </Stack>
        </Box>
      </Modal>

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
            {`Once you ${
              selectedContent?.active ? "disable" : "enable"
            } it, it will ${
              selectedContent?.active ? "not be visible" : "be visible"
            } on the dashboard`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setConfimationDialog(false);
              setSelectedContent(undefined);
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

      <Dialog
        open={confimationDialogDelete}
        onClose={() => setConfimationDialogDelete(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`Are you sure you want to delete this dashboard content?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setConfimationDialogDelete(false);
              setSelectedContent(undefined);
            }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={handleDelete} autoFocus disabled={loading}>
            Continue
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showSnack}
        autoHideDuration={4000}
        onClose={() => setShowSnack(false)}
        message={snackMessage}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      />
    </>
  );
}
