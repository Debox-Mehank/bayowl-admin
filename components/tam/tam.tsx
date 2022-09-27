import {
  Box,
  Button,
  LinearProgress,
  MenuItem,
  Modal,
  Select,
  Snackbar,
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
  useResetPasswordLazyQuery,
} from "../../generated/graphql";
import { LoadingButton } from "@mui/lab";
import generate from "generate-password-ts";
import moment from "moment";
interface AdminInterface {
  name: string;
  email: string;
  id: string;
  type: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
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
  const [resetPassword] = useResetPasswordLazyQuery();
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
      const response = await getAllAdmin({ fetchPolicy: "network-only" });
      if (response.data?.allAdmins) {
        setData(
          response.data?.allAdmins.map((ind) => ({
            name: ind.name!,
            email: ind.email!,
            type: ind.type!,
            createdBy: ind.createdBy!.name!,
            createdAt: ind.createdAt
              ? moment(ind.createdAt).format("MMM Do YY, hh:mm a")
              : moment().format("MMM Do YY, hh:mm a"),
            updatedAt: ind.updatedAt
              ? moment(ind.updatedAt).format("MMM Do YY, hh:mm a")
              : moment().format("MMM Do YY, hh:mm a"),
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
    if (reset) {
      const { data, error } = await resetPassword({
        variables: {
          resetPasswordId: id,
          password: password,
        },
      });

      if (error) {
        // throw error
      }

      onClose();
    }
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
          createdBy: localStorage.getItem("admin")
            ? JSON.parse(localStorage.getItem("admin")!)?.name ?? ""
            : "",
          createdAt: moment().format("MMM Do YY, hh:mm a"),
          updatedAt: moment().format("MMM Do YY, hh:mm a"),
        });
        setData(prev);
        setShowSnack(true);
        setSnackMessage("Password updated successfully");
      }
      onClose();
    }
  };
  const [reset, setReset] = useState<boolean>(false);
  const [id, setId] = useState<string>("");
  const onResetClick = (id: string) => {
    setId(id);
    setReset(true);
  };
  const [columns, setColumns] = useState<GridColDef[]>([
    { field: "name", headerName: "Name", width: 180 },
    { field: "email", headerName: "Email", width: 180 },
    { field: "type", headerName: "type", width: 180 },
    { field: "createdBy", headerName: "Created By", width: 180 },
    { field: "createdAt", headerName: "Created At", width: 180 },
    { field: "updatedAt", headerName: "Updated At", width: 180 },
    {
      field: "resetPassword",
      headerName: "Reset Password",
      width: 150,
      renderCell: (cellValues) => {
        return (
          <Button onClick={() => onResetClick(cellValues.row.id)}>
            Reset Password
          </Button>
        );
      },
    },
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
  const [showSnack, setShowSnack] = useState<boolean>(false);
  const [snackMessage, setSnackMessage] = useState<string>("");
  const onClose = () => {
    setOpen(false);
    setName("");
    setEmail("");
    setId("");
    setReset(false);
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
        open={open || reset}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Stack spacing={2}>
            {reset === false && (
              <>
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
                  <MenuItem value={AdminRole.Manager}>
                    {AdminRole.Manager}
                  </MenuItem>
                  <MenuItem value={AdminRole.Employee}>
                    {AdminRole.Employee}
                  </MenuItem>
                </Select>
              </>
            )}
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Password
            </Typography>
            <TextField
              variant="outlined"
              id="component-outlined"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              // InputProps={{
              //   readOnly: true,
              // }}
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
