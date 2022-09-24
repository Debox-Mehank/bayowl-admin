import { useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useAdminLoginLazyQuery } from "../../generated/graphql";
import { Snackbar } from "@mui/material";

export default function Login() {
  const [adminLogin] = useAdminLoginLazyQuery();
  const [loading, setLoading] = useState<boolean>(false);
  const [snackMessage, setSnackMessage] = useState<string>("");
  const [showSnack, setShowSnack] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setLoading(true);
    if (!data.get("email") || !data.get("password")) {
      //throw some error
    } else {
      const { data: loginData, error: loginError } = await adminLogin({
        variables: {
          input: {
            email: data.get("email") as string,
            password: data.get("password") as string,
          },
        },
      });

      // Handling Errors
      if (loginError) {
        setLoading(false);
        setSnackMessage(loginError.message.toString());
        setShowSnack(true);
        return;
      }
      if (!loginData || !loginData.adminLogin) {
        setLoading(false);
        setSnackMessage("Something went wrong, try again later.");
        setShowSnack(true);
        return;
      }

      if (loginData.adminLogin) {
        setLoading(false);
        window.location.reload();
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: "50%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            loading={loading}
          >
            Log In
          </LoadingButton>
        </Box>
      </Box>
      <Snackbar
        open={showSnack}
        autoHideDuration={4000}
        onClose={() => setShowSnack(false)}
        message={snackMessage}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      />
    </Container>
  );
}
