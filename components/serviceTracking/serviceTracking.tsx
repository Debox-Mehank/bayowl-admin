import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
  MenuItem,
  Modal,
  Select,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import React from "react";
import { useEffect, useState } from "react";
import {
  AddOn,
  Admin,
  useAddRevisionNotesByMasterLazyQuery,
  useAllEmployeeLazyQuery,
  useApproveProjectLazyQuery,
  useAssignServiceMutation,
  useGetAllServiceForMasterLazyQuery,
  UserServices,
  UserServiceStatus,
} from "../../generated/graphql";
import moment from "moment";
import { secondsToTime } from "../../utility/helpers";
import { ColorButton } from "../Button";
import { saveAs } from "file-saver";

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

export default function ServiceTracking() {
  const assignService = (cell: any) => {
    setOpen(true);
    setId(cell.row.id);
  };
  const [openForReject, setOpenForReject] = useState<boolean>(false);
  const [noteForReject, setNoteForReject] = useState<string>("");
  const [approveLoading, setApproveLoading] = useState<string>("");
  const [approveProjQuery] = useApproveProjectLazyQuery();
  const [showSnack, setShowSnack] = useState<boolean>(false);
  const [snackMessage, setSnackMessage] = useState<string>();
  const approveProject = async (serviceId: string) => {
    setApproveLoading(serviceId);
    const response = await approveProjQuery({
      variables: {
        serviceId: serviceId,
      },
    });
    setApproveLoading("");

    setSnackMessage("Project Approved");
    setShowSnack(true);

    let arr = [...data];
    setData(
      arr.map((el) => ({
        ...el,
        masterProjectApprovalTimeMoment: moment().format("MMM Do YY, hh:mm a"),
        statusType:
          el._id === serviceId ? UserServiceStatus.Delivered : el.statusType,
      }))
    );
    setConfimationDialog(false);
    setSelectedService(undefined);
  };
  const columns: GridColDef[] = [
    { field: "projectName", headerName: "Project Name", width: 150 },
    {
      field: "paidAtMoment",
      headerName: "Service Purchase Date",
      width: 200,
    },
    {
      field: "deliveryDaysRemaining",
      headerName: "Delivery Days Remaining",
      width: 200,
    },
    {
      field: "assign",
      headerName: "Assign",
      width: 150,
      renderCell: (cellValues) => {
        return (
          <ColorButton
            disabled={
              cellValues.row.statusType === UserServiceStatus.Underreview
                ? false
                : true
            }
            variant="contained"
            onClick={() => assignService(cellValues)}
          >
            {cellValues.row.allotedTo ? "Re-Assign" : "Assign"}
          </ColorButton>
        );
      },
    },
    {
      field: "Download",
      headerName: "Engineer Delivery Files",
      width: 180,
      renderCell: (cellValues) => {
        return (
          <ColorButton
            onClick={() => {
              const downloadA = document.createElement("a");
              downloadA.href =
                cellValues.row.revisionFiles.length > 0
                  ? cellValues.row.revisionFiles[
                      cellValues.row.revisionFiles.length - 1
                    ].file
                  : String(cellValues.row.deliveredFiles[0]);
              downloadA.download = "true";
              downloadA.click();
            }}
            disabled={
              cellValues.row.statusType ===
                UserServiceStatus.Underreviewinternal ||
              cellValues.row.statusType === UserServiceStatus.Delivered ||
              cellValues.row.statusType === UserServiceStatus.Completed
                ? false
                : true
            }
            variant="contained"
          >
            Download
          </ColorButton>
        );
      },
    },
    {
      field: "Working Files",
      headerName: "Engineer Working Files",
      width: 180,
      renderCell: (cellValues) => {
        return (
          <ColorButton
            onClick={() => {
              const downloadA = document.createElement("a");
              downloadA.href = String(cellValues.row.workingFile);
              downloadA.download = "true";
              downloadA.click();
            }}
            disabled={
              cellValues.row.statusType !== UserServiceStatus.Completed ||
              !cellValues.row.workingFile
            }
            variant="contained"
          >
            Download
          </ColorButton>
        );
      },
    },
    {
      field: "reference",
      headerName: "Reference Files",
      width: 200,
      renderCell: (cellValues) => {
        return (
          <ColorButton
            variant="contained"
            onClick={() => {
              setSelectedService(cellValues.row);
              setShowrefModal(true);
            }}
            disabled={cellValues.row.referenceFiles.length <= 0}
          >
            View Reference Files
          </ColorButton>
        );
      },
    },
    {
      field: "originalCustomerFiles",
      headerName: "Customer Files",
      width: 150,
      renderCell: (cellValues) => {
        return (
          <ColorButton
            onClick={() => {
              if (cellValues.row.uploadedFiles.length > 1) {
                setSelectedService(cellValues.row);
                setshowdownloadModal(true);
              } else {
                const downloadA = document.createElement("a");
                downloadA.href = String(cellValues.row.uploadedFiles[0]);
                downloadA.download = "true";
                downloadA.click();
              }
            }}
            disabled={cellValues.row.uploadedFiles.length <= 0}
            variant="contained"
          >
            Download
          </ColorButton>
        );
      },
    },
    {
      field: "multitrackExport",
      headerName: "Exports: Multitrack",
      width: 180,
      renderCell: (cellValues) => {
        return (
          <ColorButton
            onClick={() => {
              const downloadA = document.createElement("a");
              downloadA.href = String(cellValues.row.multitrackFile);
              downloadA.download = "true";
              downloadA.click();
            }}
            disabled={
              cellValues.row.statusType !== UserServiceStatus.Completed ||
              !cellValues.row.multitrackFile
            }
            variant="contained"
          >
            Download
          </ColorButton>
        );
      },
    },
    {
      field: "stemsExport",
      headerName: "Exports: Bus Stems",
      width: 180,
      renderCell: (cellValues) => {
        return (
          <ColorButton
            onClick={() => {
              const downloadA = document.createElement("a");
              downloadA.href = String(cellValues.row.stemsFiles);
              downloadA.download = "true";
              downloadA.click();
            }}
            disabled={
              cellValues.row.statusType !== UserServiceStatus.Completed ||
              !cellValues.row.stemsFiles
            }
            variant="contained"
          >
            Download
          </ColorButton>
        );
      },
    },
    {
      field: "Approve",
      headerName: "Approve",
      width: 150,
      renderCell: (cellValues) => {
        return (
          <ColorButton
            disabled={
              cellValues.row.statusType ===
              UserServiceStatus.Underreviewinternal
                ? false
                : true
            }
            onClick={() => {
              setConfimationDialog(true);
              setSelectedService(cellValues.row);
            }}
            variant="contained"
            // loading={approveLoading === cellValues.row.id ? true : false}
          >
            Approve
          </ColorButton>
        );
      },
    },
    {
      field: "Reject",
      headerName: "Reject",
      width: 150,
      renderCell: (cellValues) => {
        return (
          <ColorButton
            disabled={
              cellValues.row.statusType ===
              UserServiceStatus.Underreviewinternal
                ? false
                : true
            }
            variant="contained"
            onClick={() => {
              setOpenForReject(true);
              setId(cellValues.row.id);
            }}
          >
            Reject
          </ColorButton>
        );
      },
    },
    { field: "statusType", headerName: "Final Project Status", width: 200 },
    {
      field: "customerNotes",
      headerName: "Customer Notes",
      width: 200,
      renderCell: (cellValues) => (
        <Tooltip title={cellValues.row.customerNotes}>
          <p style={{ overflowX: "hidden", textOverflow: "ellipsis" }}>
            {cellValues.row.customerNotes}
          </p>
        </Tooltip>
      ),
    },
    {
      field: "numberOfRevisionsByMaster",
      headerName: "Number Of Internal Revisions",
      width: 200,
    },
    {
      field: "revisionTimeByMasterMoment",
      headerName: "Internal Rejection Time",
      width: 200,
    },
    {
      field: "revisionNotesByMaster",
      headerName: "Internal Rejection Notes",
      width: 200,
      renderCell: (cellValues) => (
        <Tooltip title={cellValues.row.revisionNotesByMaster}>
          <p style={{ overflowX: "hidden", textOverflow: "ellipsis" }}>
            {cellValues.row.revisionNotesByMaster}
          </p>
        </Tooltip>
      ),
    },
    {
      field: "revisionNotesByUser",
      headerName: "Customer Revision Notes",
      width: 200,
      renderCell: (cellValues) => (
        <Tooltip title={cellValues.row.revisionNotesByUser}>
          <p style={{ overflowX: "hidden", textOverflow: "ellipsis" }}>
            {cellValues.row.revisionNotesByUser}
          </p>
        </Tooltip>
      ),
    },
    {
      field: "customerRejectionTime",
      headerName: "Customer Revision Time",
      width: 200,
    },
    {
      field: "masterProjectApprovalTimeMoment",
      headerName: "Project Approval Time",
      width: 200,
    },
    {
      field: "completionDate",
      headerName: "Customer Approval Time",
      width: 200,
    },
    {
      field: "completedForString",
      headerName: "Completed For",
      width: 200,
    },
    {
      field: "customerReuploadCount",
      headerName: "Customer Reupload Count",
      width: 200,
    },
    { field: "paid", headerName: "Paid", width: 150 },
    { field: "allotedTo", headerName: "Assigned To", width: 150 },
    { field: "allotedBy", headerName: "Assigned By", width: 150 },
    { field: "assignedTime", headerName: "Assigned At", width: 180 },
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
      field: "Extra Revision",
      headerName: "Extra Revision",
      width: 150,
    },
    {
      field: "Add on: 10 Tracks",
      headerName: "Add on: 10 Tracks",
      width: 150,
    },
    {
      field: "Add on: 30s Duration",
      headerName: "Add on: 30s Duration",
      width: 150,
    },
    {
      field: "Additional Exports: Bus Stems",
      headerName: "Additional Exports: Bus Stems",
      width: 150,
    },
    {
      field: "Additional Exports: Multitracks",
      headerName: "Additional Exports: Multitracks",
      width: 150,
    },
  ];
  const [getAllServiceForEmployee] = useGetAllServiceForMasterLazyQuery();
  const [getAllEmployees] = useAllEmployeeLazyQuery();
  const [assignServiceForEmployee] = useAssignServiceMutation();
  const [allEmp, setAllEmp] = useState<Admin[]>([]);
  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  const handleSubmit = async () => {
    setLoadingButton(true);
    if (!emp || !id) {
      //throw error
    }

    const response = await assignServiceForEmployee({
      variables: {
        adminId: emp,
        serviceId: id,
      },
    });

    if (response) {
      const assignTo = allEmp.find((el) => el._id === emp);
      const assignBy = JSON.parse(localStorage.getItem("admin")!);

      const dataArr = [...data];
      const newArr = dataArr.map((el) => {
        if (el._id === id) {
          return {
            ...el,
            allotedTo: assignTo?.name,
            allotedBy: assignBy.name,
            assignedTime: moment().format("MMM Do YY, hh:mm"),
          };
        } else {
          return { ...el };
        }
      });
      setData(newArr);
      onClose();
    }
  };
  const [data, setData] = useState<UserServices[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [emp, setEmp] = useState<string>("");
  const [empName, setEmpName] = useState<string>("");
  const [id, setId] = useState<string>("");
  const onCloseForReject = () => {
    setOpenForReject(false);
    setNoteForReject("");
    setId("");
  };
  const onClose = () => {
    setLoadingButton(false);
    setOpen(false);
    setId("");
  };

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      const response = await getAllServiceForEmployee({
        fetchPolicy: "network-only",
      });

      if (response.data?.getAllServiceForMaster) {
        const finalData = response.data?.getAllServiceForMaster.map((ind) => {
          let sObj = {
            ...ind,
            id: ind._id,
            deliveryDaysRemaining: ind.estDeliveryDate
              ? moment(ind.estDeliveryDate).diff(moment(), "days") > 0
                ? moment(ind.estDeliveryDate).diff(moment(), "days") + " Days"
                : [
                    UserServiceStatus.Completed,
                    UserServiceStatus.Delivered,
                  ].includes(ind.statusType)
                ? "Delivered"
                : "Past Delivery Date"
              : "",
            paidAtMoment: moment(ind.paidAt).format("MMM Do YY, hh:mm"),
            allotedTo: ind.assignedTo !== null ? ind.assignedTo!.name : "",
            allotedBy: ind.assignedBy !== null ? ind.assignedBy!.name : "",
            customerNotes: ind.notes ?? "",
            revisionNotesByMaster: ind.revisionNotesByMaster ?? "",
            customerReuploadCount: ind.requestReuploadCounter ?? 0,
            completionDate: ind.completionDate
              ? moment(ind.completionDate).format("MMM Do YY, hh:mm")
              : "",
            revisionNotesByUser:
              ind.revisionFiles.length !== 0
                ? ind.revisionFiles[ind.revisionFiles.length - 1].description
                : "",
            customerRejectionTime:
              ind.revisionFiles.length !== 0
                ? moment(
                    ind.revisionFiles[ind.revisionFiles.length - 1].revisionTime
                  ).format("MMM Do YY, hh:mm")
                : "",
            assignedTime: ind.assignedTime
              ? moment(ind.assignedTime).format("MMM Do YY, hh:mm")
              : "",
            revisionTimeByMasterMoment: ind.revisionTimeByMaster
              ? moment(ind.revisionTimeByMaster).format("MMM Do YY, hh:mm")
              : "",
            masterProjectApprovalTimeMoment: ind.masterProjectApprovalTime
              ? moment(ind.masterProjectApprovalTime).format("MMM Do YY, hh:mm")
              : "",
            completedForString: ind.completionDate
              ? ind.completedFor === 0
                ? "Original Upload"
                : `Revision - ${ind.completedFor}`
              : "",
            maxDuration: secondsToTime(ind.maxFileDuration ?? 0),
          };
          ind.addOn.map((elem) => {
            (sObj as any)[elem.type] = elem.value
              ? `₹${elem.value.toLocaleString("en-IN")} x ${elem.qty}`
              : "N/A";
          });
          return sObj;
        });
        setData(finalData ?? []);
      }
      const allEmps = await getAllEmployees();
      if (allEmps.data?.allEmployee) {
        setAllEmp(allEmps.data?.allEmployee);
        setEmp(allEmps.data.allEmployee[0]?._id ?? "");
        setEmpName(allEmps.data.allEmployee[0]?.name ?? "");
      }
      setLoading(false);
    };
    fetchServices();
  }, []);

  const [loading, setLoading] = useState<boolean>(false);
  const [addRevisionNote] = useAddRevisionNotesByMasterLazyQuery();
  const handleSubmitForReject = async () => {
    setLoadingButton(true);
    if (noteForReject === "" || id === "") {
      // error
    } else {
      const response = await addRevisionNote({
        variables: {
          serviceId: id,
          note: noteForReject,
        },
      });

      if (!response.data!.addRevisionNotesByMaster) {
        //Handle error
      }

      let arr = [...data];
      setData(
        arr.map((el) => ({
          ...el,
          statusType:
            el._id === id ? UserServiceStatus.Workinprogress : el.statusType,
          numberOfRevisionsByMaster:
            el._id === id
              ? (el.numberOfRevisionsByMaster ?? 0) + 1
              : el.numberOfRevisionsByMaster,
        }))
      );
      onCloseForReject();
    }
  };

  const [confimationDialog, setConfimationDialog] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<UserServices>();
  const [showrefModal, setShowrefModal] = useState<boolean>(false);
  const [showdownloadModal, setshowdownloadModal] = useState<boolean>(false);

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
              Type
            </Typography>
            <Select value={emp} onChange={(e) => setEmpName(e.target.value)}>
              {allEmp.map((ind, i) => (
                <MenuItem
                  key={i}
                  value={String(ind._id)}
                  onClick={() => setEmp(String(ind._id))}
                >
                  {ind.name}
                </MenuItem>
              ))}
            </Select>
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
      <Snackbar
        open={showSnack}
        autoHideDuration={4000}
        onClose={() => setShowSnack(false)}
        message={snackMessage}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      />
      <Modal
        open={openForReject}
        onClose={onCloseForReject}
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
              value={noteForReject}
              fullWidth
              onChange={(e) => setNoteForReject(String(e.target.value))}
              label="Note"
            />
            <LoadingButton
              variant="contained"
              onClick={handleSubmitForReject}
              loading={loadingButton}
            >
              Submit
            </LoadingButton>
          </Stack>
        </Box>
      </Modal>

      {/* Reference Modal */}
      <Modal
        open={showrefModal}
        onClose={() => setShowrefModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Stack spacing={2}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Reference Files
            </Typography>
            {selectedService?.referenceFiles.map((el, idx) => (
              <a
                key={idx}
                style={{
                  display: "block",
                  margin: "6px 0",
                  color: "#f07202",
                  fontSize: "15px",
                }}
                href={el ?? ""}
                target="_blank"
                rel="noopener noreferrer"
              >
                Reference - {idx + 1}
              </a>
            ))}
            <LoadingButton
              variant="contained"
              onClick={(e) => setShowrefModal(false)}
              loading={loadingButton}
            >
              Close
            </LoadingButton>
          </Stack>
        </Box>
      </Modal>

      {/* Downloads Modal */}
      <Modal
        open={showdownloadModal}
        onClose={() => setshowdownloadModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Stack spacing={2}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Download Files
            </Typography>
            {selectedService?.uploadedFiles.map((el, idx) => (
              <a
                key={idx}
                style={{
                  display: "block",
                  margin: "6px 0",
                  color: "#f07202",
                  fontSize: "15px",
                }}
                href={el ?? ""}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download - {idx + 1}
              </a>
            ))}
            <LoadingButton
              variant="contained"
              onClick={(e) => setshowdownloadModal(false)}
              loading={loadingButton}
            >
              Close
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
            Once you approve customer will be able to download the files for
            this project.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setConfimationDialog(false);
              setSelectedService(undefined);
            }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (selectedService) {
                approveProject(selectedService._id);
              }
            }}
            autoFocus
            disabled={loading}
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
