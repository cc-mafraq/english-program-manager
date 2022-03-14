import LogoutIcon from "@mui/icons-material/Logout";
import { AppBar, IconButton, Toolbar, Typography, useTheme } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { MenuDrawer } from "..";
import { logout } from "../../services";

const pageName = "Student Database";

export const MenuBar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <AppBar
      position="static"
      sx={{ background: theme.palette.mode === "light" ? theme.palette.primary.main : "#1B2027" }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
        }}
      >
        <MenuDrawer />
        <Typography color="white" display="inline" fontWeight="bold" textAlign="center" variant="h6">
          {pageName}
        </Typography>
        <IconButton onClick={handleLogout}>
          <LogoutIcon sx={{ color: "white" }} />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};
