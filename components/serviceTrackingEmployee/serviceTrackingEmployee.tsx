import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  LinearProgress,
  MenuItem,
  Modal,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import {
  Admin,
  useAllEmployeeLazyQuery,
  useAssignServiceMutation,
  useGetAllServiceForEmployeeLazyQuery,
  useRequestReuploadLazyQuery,
  UserServices,
} from "../../generated/graphql";

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

export default function ServiceTrackingEmployee() {
  const requestReupload = (serviceId: string) => {
    setOpen(true);
    setId(serviceId);
  };
  const [reuploadedNote, setReuploadedNote] = useState<string>("");
  const columns: GridColDef[] = [
    {
      field: "download",
      headerName: "Download",
      width: 150,
      renderCell: (cellValues) => {
        return (
          <Button
            variant="contained"
            // onClick={() => downloadFileFunc(cellValues.row.uploadedFiles[0])}
          >
            Download
          </Button>
        );
      },
    },
    {
      field: "Request Reupload",
      headerName: "Request Reupload",
      width: 200,
      renderCell: (cellValues) => {
        return (
          <Button
            variant="contained"
            onClick={() => requestReupload(cellValues.row.id)}
          >
            Request Reupload
          </Button>
        );
      },
    },
    { field: "projectName", headerName: "Project Name", width: 150 },
    { field: "paid", headerName: "Paid", width: 150 },
    { field: "statusType", headerName: "Status Type", width: 150 },
    { field: "mainCategory", headerName: "Main Category", width: 150 },
    { field: "subCategory", headerName: "Sub Category", width: 150 },
    { field: "serviceName", headerName: "Service Name", width: 150 },
    { field: "subService", headerName: "Sub Service", width: 150 },
    { field: "subService2", headerName: "Sub Service 2", width: 150 },
    { field: "description", headerName: "Description", width: 150 },
    {
      field: "estimatedTime",
      headerName: "Estimated time given (Hours)",
      width: 150,
    },
    { field: "price", headerName: "Price", width: 150 },
    { field: "inputTrackLimit", headerName: "Input / Track Limit", width: 150 },
    { field: "uploadFileFormat", headerName: "Upload File Format", width: 150 },
    {
      field: "deliveryFileFormat",
      headerName: "Delivery File Format",
      width: 150,
    },
    { field: "deliveryDays", headerName: "Delivery (Days)", width: 150 },
    {
      field: "maxDuration",
      headerName: "Maximum Song / File Duration",
      width: 150,
    },
    {
      field: "numberOfReferenceFileUploads",
      headerName: "Number of reference file uploads",
      width: 150,
    },
    { field: "setOfRevisions", headerName: "Set of Revisions", width: 150 },
    {
      field: "revisionsDelivery",
      headerName: "Revisions Delivery (Days)",
      width: 150,
    },
    {
      field: "mixVocalTuning",
      headerName: "Mix Processing: Vocal Tuning",
      width: 150,
    },
    {
      field: "mixProcessingReverbs",
      headerName: "Mix Processing: Reverbs",
      width: 150,
    },
    {
      field: "mixProcessingDelays",
      headerName: "Mix Processing: Delays",
      width: 150,
    },
    {
      field: "mixProcessingOtherFx",
      headerName: "Mix Processing: Other Fx",
      width: 150,
    },
    {
      field: "Add on: Extra Revision",
      headerName: "Add on: Extra Revision",
      width: 150,
    },
    {
      field: "Add on: 10 Tracks (Adds 1 day to delivery per add on)",
      headerName: "Add on: 10 Tracks (Adds 1 day to delivery per add on)",
      width: 150,
    },
    {
      field: "Add on: 30s Duration (Adds 1 day to delivery per add on)",
      headerName: "Add on: 30s Duration (Adds 1 day to delivery per add on)",
      width: 150,
    },
  ];
  const [getAllServiceForEmployee] = useGetAllServiceForEmployeeLazyQuery();
  const [reupload] = useRequestReuploadLazyQuery();
  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  const handleSubmit = async () => {
    setLoadingButton(true);
    if (!reuploadedNote || !id) {
      //throw error
    }

    const response = await reupload({
      variables: {
        reuploadNote: reuploadedNote,
        serviceId: id,
      },
    });

    if (response) onClose();
  };
  const [data, setData] = useState<UserServices[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [id, setId] = useState<string>("");
  const onClose = () => {
    setLoadingButton(false);
    setOpen(false);
    setReuploadedNote("");
    setId("");
  };

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      const response = await getAllServiceForEmployee();
      if (response.data?.getAllServiceForEmployee) {
        setData(
          response.data?.getAllServiceForEmployee.map((ind) => ({
            ...ind,
            id: ind._id,
            allotedTo: ind.assignedTo !== null ? ind.assignedTo!.name : "",
            allotedBy: ind.assignedBy !== null ? ind.assignedBy!.name : "",
          })) ?? []
        );
      }
      setLoading(false);
    };
    fetchServices();
  }, []);
  const [loading, setLoading] = useState<boolean>(false);
  // const [servicesData, setServicesData] = useState<Services[]>([]);
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
              Note
            </Typography>
            <TextField
              variant="outlined"
              id="component-outlined"
              value={reuploadedNote}
              fullWidth
              onChange={(e) => setReuploadedNote(String(e.target.value))}
              label="Note"
            />
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
    </>
  );
}
