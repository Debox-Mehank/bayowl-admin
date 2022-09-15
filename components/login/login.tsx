import * as React from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useAdminLoginLazyQuery } from "../../generated/graphql";

export default function Login() {
  const [adminLogin] = useAdminLoginLazyQuery();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setLoading(true);
    if (!data.get("email") || !data.get("password")) {
      //throw some error
    } else {
      const response = await adminLogin({
        variables: {
          input: {
            email: data.get("email") as string,
            password: data.get("password") as string,
          },
        },
      });
      if (response.data?.adminLogin) {
        setLoading(false);
        window.location.reload();
      }
    }
  };

  const [loading, setLoading] = React.useState<boolean>(false);
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
    </Container>
  );
}
