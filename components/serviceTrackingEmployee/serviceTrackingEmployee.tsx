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
  Modal,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
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
  useUploadWorkingFilesLazyQuery,
  useUploadBusFilesLazyQuery,
  useUploadMultitrackFilesLazyQuery,
} from "../../generated/graphql";
import { formatBytesNumber } from "./utils/formatBytes";
import moment from "moment";
import { secondsToTime } from "../../utility/helpers";
import { ColorButton } from "../Button";

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
  const [uploadWorkingQuery] = useUploadWorkingFilesLazyQuery();
  const [uploadBusQuery] = useUploadBusFilesLazyQuery();
  const [uploadMultitrackQuery] = useUploadMultitrackFilesLazyQuery();
  const [uploadRevisionFiles] = useUploadRevisionFilesMutation();
  const [getS3URL] = useGetS3SignedUrlLazyQuery();
  const [initFileUploadQuery] = useInitFileUploadLazyQuery();
  const [multipartPresignedQuery] = useGetMultipartPreSignedUrlsLazyQuery();
  const [finalizeMultipartUploadQuery] = useFinalizeMultipartUploadLazyQuery();
  const [addDeliveryFile] = useAddDeliveryFilesLazyQuery();
  const handleUploadSubmit = async (
    e: any,
    serviceId: string,
    revisionNumberF?: number
  ) => {
    try {
      // For showing the upload progess
      let percentage: number | undefined = undefined;
      // Final zip file name uploaded to aws
      const finalFileName = revisionNumberF
        ? `revisionFiles_${revisionNumberF}_${serviceId}`
        : `deliveredFiles_${serviceId}`;
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

      if (revisionNumberF) {
        const { data: revisionUploadData, errors: revisionUploadErrors } =
          await uploadRevisionFiles({
            variables: {
              revisionNumber: revisionNumberF,
              fileUrl: finalUploadedUrl,
              serviceId: serviceId,
            },
          });

        if (revisionUploadErrors) {
          setSnackMessage(revisionUploadErrors[0].message);
          setShowSnack(true);
          setLoadingButton(false);
          return;
        }

        if (!revisionUploadData || !revisionUploadData.uploadRevisionFiles) {
          setLoadingButton(false);
          return;
        }
        let arr = [...data];
        setData(
          arr.map((el) => ({
            ...el,
            statusType:
              el._id === serviceId
                ? UserServiceStatus.Revisiondelivered
                : el.statusType,
          }))
        );
        setLoadingButton(false);
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
      field: "deliveryDaysRemaining",
      headerName: "Delivery Days Remaining",
      width: 200,
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
      field: "download",
      headerName: "Download",
      width: 150,
      renderCell: (cellValues) => {
        return (
          <ColorButton
            variant="contained"
            onClick={() => {
              const downloadA = document.createElement("a");
              downloadA.href = String(cellValues.row.uploadedFiles[0]);
              downloadA.download = "true";
              downloadA.click();
            }}
          >
            Download
          </ColorButton>
        );
      },
    },
    {
      field: "Confirm",
      headerName: "Confirm",
      width: 150,
      renderCell: (cellValues) => {
        return (
          <ColorButton
            variant="contained"
            disabled={
              cellValues.row.statusType === UserServiceStatus.Underreview
                ? false
                : true
            }
            onClick={
              () => {
                setSelectedService(cellValues.row);
                setConfimationDialog(true);
              }
              // handleConfirm(cellValues.row.deliveryDays, cellValues.row.id)
            }
            // loading={confirmButton === cellValues.row.id ? true : false}
          >
            Confirm
          </ColorButton>
        );
      },
    },
    {
      field: "Request Reupload",
      headerName: "Request Reupload",
      width: 200,
      renderCell: (cellValues) => {
        return (
          <ColorButton
            variant="contained"
            onClick={() => requestReupload(cellValues.row.id)}
            disabled={
              cellValues.row.statusType === UserServiceStatus.Underreview
                ? false
                : true
            }
          >
            Request Reupload
          </ColorButton>
        );
      },
    },
    {
      field: "Upload",
      headerName: "Upload",
      width: 200,
      renderCell: (cellValues) => {
        return (
          <>
            <ColorButton
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
              {cellValues.row.revisionFiles.length > 0
                ? "Upload Revision"
                : "Upload"}
            </ColorButton>
          </>
        );
      },
    },
    {
      field: "uploadMultitrack",
      headerName: "Upload Multitrack Export",
      width: 200,
      renderCell: (cellValues) => {
        return (
          <>
            <ColorButton
              variant="contained"
              onClick={(e) => {
                setId(cellValues.row._id);
                setOpenUploadMultitrack(true);
              }}
              disabled={
                cellValues.row.statusType !== UserServiceStatus.Completed ||
                !cellValues.row.addOnExportsMultitrack ||
                cellValues.row.multitrackFile
              }
            >
              Upload
            </ColorButton>
          </>
        );
      },
    },
    {
      field: "uploadBusStems",
      headerName: "Upload Bus Stems Export",
      width: 200,
      renderCell: (cellValues) => {
        return (
          <>
            <ColorButton
              variant="contained"
              onClick={(e) => {
                setId(cellValues.row._id);
                setOpenUploadBus(true);
              }}
              disabled={
                cellValues.row.statusType !== UserServiceStatus.Completed ||
                !cellValues.row.addOnExportsBusStems ||
                cellValues.row.stemsFiles
              }
            >
              Upload
            </ColorButton>
          </>
        );
      },
    },
    {
      field: "Upload Working Files",
      headerName: "Upload Working Files",
      width: 200,
      renderCell: (cellValues) => {
        return (
          <>
            <ColorButton
              variant="contained"
              onClick={(e) => {
                setId(cellValues.row._id);
                setOpenUploadWorking(true);
              }}
              disabled={
                cellValues.row.statusType !== UserServiceStatus.Completed ||
                cellValues.row.workingFile
              }
            >
              Upload
            </ColorButton>
          </>
        );
      },
    },
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
      field: "revisionNotesByMaster",
      headerName: "Internal Notes",
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
      field: "revisionTimeByMaster",
      headerName: "Internal Notes Time",
      width: 180,
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
      field: "revisionFor",
      headerName: "Revision Requested For",
      width: 180,
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
    setConfimationDialog(false);
    setSelectedService(undefined);
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
  const [openUploadWorking, setOpenUploadWorking] = useState<boolean>(false);
  const [openUploadBus, setOpenUploadBus] = useState<boolean>(false);
  const [openUploadMultitrack, setOpenUploadMultitrack] =
    useState<boolean>(false);
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

  // Upload Working Files
  const handleUploadWorkingFiles = async (serviceId: string) => {
    try {
      // For showing the upload progess
      let percentage: number | undefined = undefined;
      // Final zip file name uploaded to aws
      const finalFileName = `workingFiles_${serviceId}`;
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
          setSnackMessage(finalMultipartError.message);
          setShowSnack(true);
          return;
        }
        if (
          !finalMultipartData ||
          !finalMultipartData.finalizeMultipartUpload
        ) {
          setSnackMessage("Something went wrong try again later");
          setShowSnack(true);
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
        setSnackMessage("Something went wrong try again later");
        setShowSnack(true);
        return;
      }

      const { data: workingData, error: workingError } =
        await uploadWorkingQuery({
          variables: {
            fileUrl: finalUploadedUrl,
            serviceId: serviceId,
          },
        });

      if (workingError) {
        setSnackMessage(workingError.message);
        setShowSnack(true);
        setLoadingButton(false);
        return;
      }

      if (!workingData || !workingData.uploadWorkingFiles) {
        setLoadingButton(false);
        return;
      }
      let arr = [...data];
      setData(
        arr.map((el) => ({
          ...el,
          workingFile: finalUploadedUrl,
        }))
      );

      setStatusForUploading(null);
      setRevisionNumber(0);
      setLoadingButton(false);
      setOpenUploadWorking(false);
      setSnackMessage("Files Uploaded Successfully");
      setShowSnack(true);
    } catch (error: any) {
      setSnackMessage(error.toString());
      setShowSnack(true);
      setLoadingButton(false);
    }
  };

  // Upload Bus Stems Export
  const handleUploadBusFiles = async (serviceId: string) => {
    try {
      // For showing the upload progess
      let percentage: number | undefined = undefined;
      // Final zip file name uploaded to aws
      const finalFileName = `busStemsExport_${serviceId}`;
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

      const { data: workingData, error: workingError } = await uploadBusQuery({
        variables: {
          fileUrl: finalUploadedUrl,
          serviceId: serviceId,
        },
      });

      if (workingError) {
        setSnackMessage(workingError.message);
        setShowSnack(true);
        setLoadingButton(false);
        return;
      }

      if (!workingData || !workingData.uploadBusFiles) {
        setLoadingButton(false);
        return;
      }
      let arr = [...data];
      setData(
        arr.map((el) => ({
          ...el,
          stemsFiles: finalUploadedUrl,
        }))
      );

      setStatusForUploading(null);
      setRevisionNumber(0);
      setLoadingButton(false);
      setOpenUploadBus(false);
      setSnackMessage("Files Uploaded Successfully");
      setShowSnack(true);
    } catch (error: any) {
      setSnackMessage(error.toString());
      setShowSnack(true);
      setLoadingButton(false);
    }
  };

  // Upload Multitrack Export
  const handleUploadMultitrackFiles = async (serviceId: string) => {
    try {
      // For showing the upload progess
      let percentage: number | undefined = undefined;
      // Final zip file name uploaded to aws
      const finalFileName = `multitrackExports_${serviceId}`;
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

      const { data: workingData, error: workingError } =
        await uploadMultitrackQuery({
          variables: {
            fileUrl: finalUploadedUrl,
            serviceId: serviceId,
          },
        });

      if (workingError) {
        setSnackMessage(workingError.message);
        setShowSnack(true);
        setLoadingButton(false);
        return;
      }

      if (!workingData || !workingData.uploadMultitrackFiles) {
        setLoadingButton(false);
        return;
      }
      let arr = [...data];
      setData(
        arr.map((el) => ({
          ...el,
          multitrackFile: finalUploadedUrl,
        }))
      );

      setStatusForUploading(null);
      setRevisionNumber(0);
      setLoadingButton(false);
      setOpenUploadMultitrack(false);
      setSnackMessage("Files Uploaded Successfully");
      setShowSnack(true);
    } catch (error: any) {
      setSnackMessage(error.toString());
      setShowSnack(true);
      setLoadingButton(false);
    }
  };

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      const response = await getAllServiceForEmployee({
        fetchPolicy: "network-only",
      });
      if (response.data?.getAllServiceForEmployee) {
        setData(
          response.data?.getAllServiceForEmployee.map((ind) => {
            let sObj = {
              ...ind,
              id: ind._id,
              deliveryDaysRemaining: ind.estDeliveryDate
                ? moment().diff(moment(ind.estDeliveryDate), "days") > 0
                  ? moment().diff(moment(ind.estDeliveryDate), "days")
                  : [
                      UserServiceStatus.Completed,
                      UserServiceStatus.Delivered,
                    ].includes(ind.statusType)
                  ? "Delivered"
                  : "Past Delivery Date"
                : "",
              customerNotes: ind.notes ?? "",
              customerReuploadCount: ind.requestReuploadCounter ?? 0,
              revisionTimeByMaster: ind.revisionTimeByMaster
                ? moment(ind.revisionTimeByMaster).format("MMM Do YY, hh:mm a")
                : "",
              allotedTo: ind.assignedTo !== null ? ind.assignedTo!.name : "",
              allotedBy: ind.assignedBy !== null ? ind.assignedBy!.name : "",
              revisionNotesByUser:
                ind.revisionFiles.length !== 0
                  ? ind.revisionFiles[ind.revisionFiles.length - 1].description
                  : "",
              revisionFor:
                ind.revisionFiles.length !== 0
                  ? ind.revisionFiles[ind.revisionFiles.length - 1]
                      .revisionFor === 0
                    ? "Original Upload"
                    : `Revision - ${
                        ind.revisionFiles[ind.revisionFiles.length - 1]
                          .revisionFor
                      }`
                  : "",
              revisionNumber:
                ind.revisionFiles.length !== 0
                  ? ind.revisionFiles[ind.revisionFiles.length - 1].revision
                  : 0,
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
          }) ?? []
        );
      }
      setLoading(false);
    };
    fetchServices();
  }, []);
  const [loading, setLoading] = useState<boolean>(false);
  const [showSnack, setShowSnack] = useState<boolean>(false);
  const [snackMessage, setSnackMessage] = useState<string>();
  const [confimationDialog, setConfimationDialog] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<UserServices>();
  const [showrefModal, setShowrefModal] = useState<boolean>(false);
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
      {/* Revision And Delivery Upload Modal */}
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
              onClick={(e) => handleUploadSubmit(e, id, revisionNumber)}
              loading={loadingButton}
            >
              Submit
            </LoadingButton>
          </Stack>
        </Box>
      </Modal>

      {/* Working Files Upload */}
      <Modal
        open={openUploadWorking}
        onClose={() => {
          setLoading(false);
          setOpenUploadWorking(false);
        }}
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
              onClick={(e) => handleUploadWorkingFiles(id)}
              loading={loadingButton}
            >
              Submit
            </LoadingButton>
          </Stack>
        </Box>
      </Modal>

      {/* Bus Stems Export */}
      <Modal
        open={openUploadBus}
        onClose={() => {
          setLoading(false);
          setOpenUploadBus(false);
        }}
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
              onClick={(e) => handleUploadBusFiles(id)}
              loading={loadingButton}
            >
              Submit
            </LoadingButton>
          </Stack>
        </Box>
      </Modal>

      {/* Multitrack Export */}
      <Modal
        open={openUploadMultitrack}
        onClose={() => {
          setLoading(false);
          setOpenUploadMultitrack(false);
        }}
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
              onClick={(e) => handleUploadMultitrackFiles(id)}
              loading={loadingButton}
            >
              Submit
            </LoadingButton>
          </Stack>
        </Box>
      </Modal>

      {/* Engineer Rejection Note */}
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
            Once you confirm the project status will change to work in progress
            and the estimated delivery date will be updated.
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
                handleConfirm(
                  selectedService.deliveryDays ?? 0,
                  selectedService._id
                );
              }
            }}
            autoFocus
            disabled={loading}
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>

      {/* Revision Dialog */}
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
