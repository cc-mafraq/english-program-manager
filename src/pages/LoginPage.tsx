import { Avatar, Box, Button, Card, Container, useTheme } from "@mui/material";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { loginWithGoogle } from "../services";

export const LoginPage = () => {
  const navigate = useNavigate();
  const handleLogin = async () => {
    await loginWithGoogle();
    navigate("/epd");
  };
  const theme = useTheme();

  return (
    <Container
      component="main"
      sx={{
        backgroundImage: `url(./assets/login-background.jpg)`,
        backgroundSize: "100%",
        height: "100vh",
        justifyContent: "center",
        minHeight: "100vh",
        minWidth: "100vw",
        width: "100vw",
      }}
    >
      <Card
        sx={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          left: "50%",
          paddingBottom: 3,
          paddingTop: 2,
          position: "fixed",
          top: "30%",
          transform: "translate(-50%, -50%)",
          width: "30vw",
        }}
      >
        <Avatar src="./assets/ep-logo-full-white.png" sx={{ height: 56, width: 56 }} />
        <Box sx={{ mt: 1 }}>
          <Button
            fullWidth
            onClick={handleLogin}
            sx={{ backgroundColor: theme.palette.mode === "light" ? "primary.main" : "primary.dark" }}
            variant="contained"
          >
            Sign In With Google
          </Button>
        </Box>
      </Card>
    </Container>
  );
};
