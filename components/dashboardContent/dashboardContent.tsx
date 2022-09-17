import {
  Box,
  Button,
  LinearProgress,
  MenuItem,
  Modal,
  Select,
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
} from "../../generated/graphql";
import { LoadingButton } from "@mui/lab";

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
  const [getAllContent] = useAllDashboardContentLazyQuery();
  const [data, setData] = useState<DashboardContent[]>([]);
  const [content, setContent] = useState<string>("");
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      const response = await getAllContent();
      if (response.data?.allDashboardContent) {
        setData(
          response.data?.allDashboardContent.map((ind) => ({
            ...ind,
            id: ind._id!,
            lastUpdatedByName:
              ind.lastUpdatedBy !== null ? ind.lastUpdatedBy.name : "",
            createdByName: ind.createdBy !== null ? ind.createdBy.name : "",
          })) ?? []
        );
      }
      setLoading(false);
    };
    fetchServices();
  }, []);

  //   const handleSubmit = async () => {
  //     setLoadingButton(true);
  //     if (!validateEmail(email)) {
  //       //throw something
  //       setLoadingButton(false);
  //     }
  //     if (!name || !password || !type) {
  //       //throw error
  //       setLoadingButton(false);
  //     } else {
  //       const response = await addAdmin({
  //         variables: {
  //           input: {
  //             name: name,
  //             email: email,
  //             password: password,
  //             type: type,
  //           },
  //         },
  //       });

  //       if (response.data) {
  //         const prev = [...data];
  //         prev.push({
  //           id: response.data!.addUser,
  //           name: name,
  //           email: email,
  //           type: type,
  //         //   createdBy: "Yash",
  //           createdAt: new Date(),
  //           updatedAt: new Date(),
  //         });
  //         setData(prev);
  //       }
  //       onClose();
  //     }
  //   };
  const [columns, setColumns] = useState<GridColDef[]>([
    {
      field: "active",
      headerName: "Active",
      width: 150,
      renderCell: (cellValues: GridCellParams<DashboardContent>) => {
        return (
          <Switch
            checked={cellValues.row.active}
            inputProps={{ "aria-label": "controlled" }}
          />
        );
      },
    },
    { field: "text", headerName: "Text", width: 150 },
    { field: "image", headerName: "Image", width: 150 },
    { field: "lastUpdatedByName", headerName: "Last Updated By", width: 150 },
    { field: "createdByName", headerName: "Created By", width: 150 },
    { field: "createdAt", headerName: "Created At", width: 150 },
    { field: "updatedAt", headerName: "Updated At", width: 150 },
  ]);
  const [open, setOpen] = useState<boolean>(false);
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
    if (!content || fileName === "" || !file) {
      //throw error
    }
    let uploadedData;
    const formData = new FormData();
    formData.append("file", file!);
    formData.append("upload_preset", "login-content-uploads");
    formData.append(
      "public_id",
      fileName + "_" + Math.round(Date.now() / 1000)
    );

    uploadedData = await fetch(
      "https://api.cloudinary.com/v1_1/inradiuscloud/image/upload",
      { method: "POST", body: formData }
    ).then((r) => r.json());

    const response = await addDashboardContent({
      variables: {
        input: {
          text: content,
          image: uploadedData.secure_url,
        },
      },
    });

    if (response.error) {
      //throw error
    }
    const respObj = response!.data!.addDashboardContent;
    const newObj = {
      ...respObj,
      id: respObj._id,
      lastUpdatedByName: respObj.lastUpdatedBy.name,
      createdByName: respObj.createdBy.name,
    };
    setData([...data, newObj]);
    onClose();
  };
  // const [servicesData, setServicesData] = useState<Services[]>([]);
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
            <TextField
              variant="outlined"
              id="component-outlined"
              value={content}
              fullWidth
              onChange={(e) => setContent(String(e.target.value))}
              label="Content"
            />
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
    </>
  );
}
