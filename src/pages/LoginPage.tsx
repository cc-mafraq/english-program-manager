import { Avatar, Box, Button, Container, Typography, TypographyProps } from "@mui/material";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { loginWithGoogle } from "../services";

// https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/sign-in/SignIn.tsx
const Copyright = (props: TypographyProps) => {
  return (
    <Typography align="center" color="text.secondary" variant="body2" {...props}>
      {"Copyright © "} CCM English Program {new Date().getFullYear()}.
    </Typography>
  );
};

export const LoginPage = () => {
  const navigate = useNavigate();
  const handleLogin = async () => {
    await loginWithGoogle();
    navigate("/epd");
  };
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          marginTop: 8,
        }}
      >
        <Avatar sx={{ bgcolor: "secondary.main", m: 1 }}>{/* <LockOutlinedIcon /> */}</Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Button fullWidth onClick={handleLogin} sx={{ mb: 2, mt: 1 }} variant="contained">
            Sign In With Google
          </Button>
        </Box>
      </Box>
      <Copyright />
    </Container>
  );
};
