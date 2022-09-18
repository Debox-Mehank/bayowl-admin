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
import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import {
  Admin,
  AdminRole,
  useAddAdminMutation,
  useAllAdminsLazyQuery,
} from "../../generated/graphql";
import { LoadingButton } from "@mui/lab";
import generate from "generate-password-ts";
interface AdminInterface {
  name: string;
  email: string;
  id: string;
  type: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function TAM() {
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
  const [getAllAdmin] = useAllAdminsLazyQuery();
  const [addAdmin] = useAddAdminMutation();
  const [data, setData] = useState<AdminInterface[]>([]);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [type, setType] = useState<AdminRole>(AdminRole.Employee);
  const [password, setPassword] = useState<string>(
    generate.generate({
      length: 10,
      numbers: true,
      symbols: true,
      lowercase: true,
      uppercase: true,
      strict: true,
    })
  );
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      const response = await getAllAdmin();
      if (response.data?.allAdmins) {
        setData(
          response.data?.allAdmins.map((ind) => ({
            name: ind.name!,
            email: ind.email!,
            type: ind.type!,
            createdBy: ind.createdBy!.name!,
            createdAt: ind.createdAt!,
            updatedAt: ind.updatedAt!,
            id: ind._id!,
          })) ?? []
        );
      }
      setLoading(false);
    };
    fetchServices();
  }, []);
  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
  const handleSubmit = async () => {
    setLoadingButton(true);
    if (!validateEmail(email)) {
      //throw something
      setLoadingButton(false);
    }
    if (!name || !password || !type) {
      //throw error
      setLoadingButton(false);
    } else {
      const response = await addAdmin({
        variables: {
          input: {
            name: name,
            email: email,
            password: password,
            type: type,
          },
        },
      });

      if (response.data) {
        const prev = [...data];
        prev.push({
          id: response.data!.addUser,
          name: name,
          email: email,
          type: type,
          createdBy: "Yash",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        setData(prev);
      }
      onClose();
    }
  };
  const [columns, setColumns] = useState<GridColDef[]>([
    { field: "name", headerName: "Name", width: 150 },
    { field: "email", headerName: "Email", width: 150 },
    { field: "type", headerName: "type", width: 150 },
    { field: "createdBy", headerName: "Created By", width: 150 },
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
          Add Admin
        </Button>
      </GridToolbarContainer>
    );
  }

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  const onClose = () => {
    setOpen(false);
    setName("");
    setEmail("");
    setPassword(
      generate.generate({
        length: 10,
        numbers: true,
        symbols: true,
        lowercase: true,
        uppercase: true,
        strict: true,
      })
    );
    setLoadingButton(false);
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
              Name
            </Typography>
            <TextField
              variant="outlined"
              id="component-outlined"
              value={name}
              fullWidth
              onChange={(e) => setName(String(e.target.value))}
              label="Name"
            />
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Email
            </Typography>
            <TextField
              variant="outlined"
              id="component-outlined"
              value={email}
              fullWidth
              onChange={(e) => setEmail(String(e.target.value))}
              label="Email"
            />
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Type
            </Typography>
            <Select
              value={type}
              onChange={(e) => setType(e.target.value as AdminRole)}
            >
              <MenuItem value={AdminRole.Manager}>{AdminRole.Manager}</MenuItem>
              <MenuItem value={AdminRole.Employee}>
                {AdminRole.Employee}
              </MenuItem>
            </Select>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Password
            </Typography>
            <TextField
              variant="outlined"
              id="component-outlined"
              value={password}
              InputProps={{
                readOnly: true,
              }}
              fullWidth
              label="Password"
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
