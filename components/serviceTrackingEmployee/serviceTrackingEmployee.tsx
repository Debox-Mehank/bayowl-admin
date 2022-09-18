import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  LinearProgress,
  Modal,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import {
  useGetAllServiceForEmployeeLazyQuery,
  useRequestReuploadLazyQuery,
  UserServices,
  UserServiceStatus,
  useConfirmUploadLazyQuery,
  FinalMultipartUploadPartsInput,
  MultipartSignedUrlResponse,
  useFinalizeMultipartUploadLazyQuery,
  useGetMultipartPreSignedUrlsLazyQuery,
  useGetS3SignedUrlLazyQuery,
  useInitFileUploadLazyQuery,
  useAddDeliveryFilesLazyQuery,
  useUploadRevisionFilesMutation,
} from "../../generated/graphql";
import { formatBytesNumber } from "./utils/formatBytes";
import moment from "moment";

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

interface refFileList {
  name?: string;
  file?: File;
  url?: string;
  isAddedByUpload: boolean;
}

export default function ServiceTrackingEmployee() {
  const [filesArray, setFilesArray] = useState<File[]>();
  const [revisionNumber, setRevisionNumber] = useState<number>(0);
  const [statusForUploading, setStatusForUploading] =
    useState<UserServiceStatus | null>(null);
  const [uploadRevisionFiles] = useUploadRevisionFilesMutation();
  const [getS3URL] = useGetS3SignedUrlLazyQuery();
  const [initFileUploadQuery] = useInitFileUploadLazyQuery();
  const [multipartPresignedQuery] = useGetMultipartPreSignedUrlsLazyQuery();
  const [finalizeMultipartUploadQuery] = useFinalizeMultipartUploadLazyQuery();
  const [addDeliveryFile] = useAddDeliveryFilesLazyQuery();
  const handleUploadSubmit = async (e: any, serviceId: string) => {
    try {
      // For showing the upload progess
      let percentage: number | undefined = undefined;
      // Final zip file name uploaded to aws
      const finalFileName = `deliveredFiles_${serviceId}`;
      const file = filesArray![0];

      let finalUploadedUrl: undefined | string = undefined;

      setLoadingButton(true);
      // Check if file size is bigger than 5 MB
      if (formatBytesNumber(file.size) > 5) {
        // Initializing the upload from server
        const { data: initData, error: initError } = await initFileUploadQuery({
          variables: { fileName: finalFileName + ".zip" },
        });

        // Handling Errors
        if (initError) {
          //error handling left
          return;
        }
        if (!initData || !initData.initFileUpload) {
          return;
        }

        // Multipart upload part (dividing the file into chunks and upload the chunks)
        const chunkSize = 10 * 1024 * 1024; // 10 MiB
        const chunkCount = Math.floor(file.size / chunkSize) + 1;

        // Getting multiple urls
        const { data: multipleSignedUrlData, error: multipleSignedUrlError } =
          await multipartPresignedQuery({
            variables: {
              fileId: initData.initFileUpload.fileId ?? "",
              fileKey: initData.initFileUpload.fileKey ?? "",
              parts: chunkCount,
            },
          });

        // Handling Errors
        if (multipleSignedUrlError) {
          return;
        }
        if (
          !multipleSignedUrlData ||
          !multipleSignedUrlData.getMultipartPreSignedUrls
        ) {
          return;
        }

        let multipartUrls: MultipartSignedUrlResponse[] =
          multipleSignedUrlData.getMultipartPreSignedUrls.map((el) => ({
            signedUrl: el.signedUrl,
            PartNumber: el.PartNumber,
          }));

        let partsUploadArray: FinalMultipartUploadPartsInput[] = [];

        for (let index = 1; index < chunkCount + 1; index++) {
          let start = (index - 1) * chunkSize;
          let end = index * chunkSize;
          let fileBlob =
            index < chunkCount ? file.slice(start, end) : file.slice(start);
          let signedUrl = multipartUrls[index - 1].signedUrl ?? "";
          let partNumber = multipartUrls[index - 1].PartNumber ?? 0;

          let uploadChunk = await fetch(signedUrl, {
            method: "PUT",
            body: fileBlob,
          });
          let etag = uploadChunk.headers.get("etag");
          partsUploadArray.push({
            ETag: etag ?? "",
            PartNumber: partNumber,
          });
        }

        // Finalize multipart upload
        const { data: finalMultipartData, error: finalMultipartError } =
          await finalizeMultipartUploadQuery({
            variables: {
              input: {
                fileId: initData.initFileUpload.fileId ?? "",
                fileKey: initData.initFileUpload.fileKey ?? "",
                parts: partsUploadArray,
              },
            },
          });

        // Handling Errors
        if (finalMultipartError) {
          return;
        }
        if (
          !finalMultipartData ||
          !finalMultipartData.finalizeMultipartUpload
        ) {
          return;
        }

        finalUploadedUrl = finalMultipartData.finalizeMultipartUpload;
      } else {
        // Direct Upload The Zip File To S3 using pre signed url
        const { data: s3Url, error: s3Error } = await getS3URL({
          variables: { fileName: finalFileName },
        });

        // Handling Errors
        if (s3Error) {
          return;
        }
        if (!s3Url || !s3Url.getS3SignedURL) {
          return;
        }

        await fetch(s3Url.getS3SignedURL, {
          method: "PUT",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: file,
        });
        const imageUrl = s3Url.getS3SignedURL.split("?")[0];

        finalUploadedUrl = imageUrl;
      }

      // Update user status and uploadedFiles Array
      if (!finalUploadedUrl) {
        return;
      }

      if (statusForUploading === null) {
        //throw error
        return;
      }

      if (statusForUploading === UserServiceStatus.Revisionrequest) {
        const { data, errors } = await uploadRevisionFiles({
          variables: {
            revisionNumber: revisionNumber,
            fileUrl: finalUploadedUrl,
            serviceId: serviceId,
          },
        });
        if (!data || !data.uploadRevisionFiles) {
          setLoadingButton(false);
          return;
        }
      } else {
        const { data: finalData, error } = await addDeliveryFile({
          variables: {
            serviceId: serviceId?.toString() ?? "",
            url: finalUploadedUrl,
          },
        });

        //Handling Errors
        if (error) {
          setLoadingButton(false);
          return;
        }
        if (!finalData || !finalData.addDeliverFiles) {
          setLoadingButton(false);
          return;
        }

        let arr = [...data];
        setData(
          arr.map((el) => ({
            ...el,
            statusType:
              el._id === serviceId
                ? UserServiceStatus.Underreviewinternal
                : el.statusType,
          }))
        );
        setLoadingButton(false);
      }
      //Handling Errors
      setStatusForUploading(null);
      setRevisionNumber(0);
      setLoadingButton(false);
      setOpenUpload(false);
      setSnackMessage("Files Uploaded Successfully");
      setShowSnack(true);
    } catch (error: any) {}
  };
  const [confirmUpload] = useConfirmUploadLazyQuery();
  const requestReupload = (serviceId: string) => {
    setOpen(true);
    setId(serviceId);
  };
  let inputFile: HTMLInputElement;
  const [reuploadedNote, setReuploadedNote] = useState<string>("");
  const columns: GridColDef[] = [
    { field: "projectName", headerName: "Project Name", width: 150 },
    {
      field: "download",
      headerName: "Download",
      width: 150,
      renderCell: (cellValues) => {
        return (
          <Button
            variant="contained"
            onClick={() => {
              const downloadA = document.createElement("a");
              downloadA.href = String(cellValues.row.uploadedFiles[0]);
              downloadA.download = "true";
              downloadA.click();
            }}
          >
            Download
          </Button>
          // <a href={String(cellValues.row.uploadedFiles[0])} download>
          //   Download
          // </a>
        );
      },
    },
    {
      field: "Confirm",
      headerName: "Confirm",
      width: 150,
      renderCell: (cellValues) => {
        return (
          <LoadingButton
            variant="contained"
            disabled={
              cellValues.row.statusType === UserServiceStatus.Underreview
                ? false
                : true
            }
            onClick={() =>
              handleConfirm(cellValues.row.deliveryDays, cellValues.row.id)
            }
            loading={confirmButton === cellValues.row.id ? true : false}
          >
            Confirm
          </LoadingButton>
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
            disabled={
              cellValues.row.statusType === UserServiceStatus.Underreview
                ? false
                : true
            }
          >
            Request Reupload
          </Button>
        );
      },
    },
    {
      field: "Upload",
      headerName: "Upload",
      width: 150,
      renderCell: (cellValues) => {
        return (
          <>
            <Button
              variant="contained"
              onClick={(e) =>
                uploadOnOpen(
                  cellValues.row._id,
                  cellValues.row.statusType,
                  cellValues.row.revisionNumber
                )
              }
              disabled={
                cellValues.row.statusType ===
                  UserServiceStatus.Workinprogress ||
                cellValues.row.statusType === UserServiceStatus.Revisionrequest
                  ? false
                  : true
              }
            >
              Upload
            </Button>
          </>
        );
      },
    },
    // {
    //   field: "Request Reupload",
    //   headerName: "Request Reupload",
    //   width: 200,
    //   renderCell: (cellValues) => {
    //     return (
    //       <Button
    //         variant="contained"
    //         onClick={() => requestReupload(cellValues.row.id)}
    //         disabled={
    //           cellValues.row.statusType === UserServiceStatus.Underreview
    //             ? false
    //             : true
    //         }
    //       >
    //         Request Reupload
    //       </Button>
    //     );
    //   },
    // },
    {
      field: "revisionNotesByMaster",
      headerName: "Notes",
      width: 150,
    },
    {
      field: "revisionTimeByMaster",
      headerName: "Note Time",
      width: 180,
    },
    {
      field: "revisionNotesByUser",
      headerName: "User Revision Notes",
      width: 150,
    },
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
  const [confirmButton, setConfirmButton] = useState<string>("");

  const handleConfirm = async (deliverDays: number, serviceId: string) => {
    setConfirmButton(serviceId);
    const response = await confirmUpload({
      variables: {
        deliveryDays: deliverDays,
        serviceId: serviceId,
      },
    });
    setConfirmButton("");
    if (!response.data) {
      //throw error
      return;
    }

    let arr = [...data];
    setData(
      arr.map((el) => ({
        ...el,
        statusType:
          el._id === serviceId
            ? UserServiceStatus.Workinprogress
            : el.statusType,
      }))
    );
  };
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

    if (!response.data?.requestReupload) {
      return;
    }

    let arr = [...data];
    setData(
      arr.map((el) => ({
        ...el,
        statusType:
          el._id === id ? UserServiceStatus.Pendingupload : el.statusType,
      }))
    );
    onClose();
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
  const [openUpload, setOpenUpload] = useState<boolean>(false);
  const uploadOnOpen = (
    serviceId: string,
    status: UserServiceStatus,
    rNum: number
  ) => {
    setId(serviceId);
    setOpenUpload(true);
    setStatusForUploading(status);
    setRevisionNumber(rNum);
  };
  const uploadOnClose = () => {
    setLoading(false);
    setOpenUpload(false);
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
            revisionTimeByMaster: ind.revisionTimeByMaster
              ? moment(ind.revisionTimeByMaster).format("MMM Do YY, hh:mm a")
              : "",
            allotedTo: ind.assignedTo !== null ? ind.assignedTo!.name : "",
            allotedBy: ind.assignedBy !== null ? ind.assignedBy!.name : "",
            revisionNotesByUser:
              ind.revisionFiles.length !== 0
                ? ind.revisionFiles[ind.revisionFiles.length - 1].description
                : "",
            revisionNumber:
              ind.revisionFiles.length !== 0
                ? ind.revisionFiles[ind.revisionFiles.length - 1].revision
                : 0,
          })) ?? []
        );
      }
      setLoading(false);
    };
    fetchServices();
  }, []);
  const [loading, setLoading] = useState<boolean>(false);
  const [showSnack, setShowSnack] = useState<boolean>(false);
  const [snackMessage, setSnackMessage] = useState<string>();
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
        open={openUpload}
        onClose={uploadOnClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Stack spacing={2}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Upload a .zip File
            </Typography>
            <label htmlFor="contained-button-file">
              <input
                ref={(input) => {
                  inputFile = input!;
                }}
                accept={".zip"}
                id="contained-button-file"
                type="file"
                onChange={(e) => {
                  if (e.target.files) {
                    const fileList = e.target.files;
                    let finalFileArr: File[] = [];
                    for (const file of Array.from(fileList)) {
                      finalFileArr.push(file);
                    }
                    setFilesArray(finalFileArr);
                  }
                }}
              />
            </label>
            <LoadingButton
              variant="contained"
              onClick={(e) => handleUploadSubmit(e, id)}
              loading={loadingButton}
            >
              Submit
            </LoadingButton>
          </Stack>
        </Box>
      </Modal>
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
