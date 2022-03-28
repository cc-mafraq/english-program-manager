import { Avatar, Box, Button, Card, Container, useTheme } from "@mui/material";
import { grey } from "@mui/material/colors";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { lightPrimaryColor, lightPrimaryDarkColor } from "../interfaces";
import { loginWithGoogle } from "../services";

export const LoginPage = () => {
  const navigate = useNavigate();
  const handleLogin = async () => {
    await loginWithGoogle();
    navigate("/epd");
  };
  const theme = useTheme();
  const whiteOrGrey = theme.palette.mode === "light" ? "white" : grey[300];

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
          backgroundColor: whiteOrGrey,
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
        <Avatar src="./assets/ep-logo-full.png" sx={{ height: 56, width: 56 }} />
        <Box sx={{ mt: 1 }}>
          <Button
            fullWidth
            onClick={handleLogin}
            sx={{
              "&:hover": {
                backgroundColor: lightPrimaryDarkColor,
              },
              backgroundColor: lightPrimaryColor,
              color: whiteOrGrey,
            }}
            variant="contained"
          >
            Sign In With Google
          </Button>
        </Box>
      </Card>
    </Container>
  );
};
