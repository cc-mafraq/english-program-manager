import LogoutIcon from "@mui/icons-material/Logout";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { MenuDrawer } from "..";
import { logout } from "../../services";

const pageName = "Student Database";

export const MenuBar = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <AppBar position="static">
      <Toolbar
        sx={{
          justifyContent: "space-between",
        }}
      >
        <MenuDrawer />
        <Typography
          color="white"
          display="inline"
          fontWeight="bold"
          textAlign="center"
          variant="h6"
        >
          {pageName}
        </Typography>
        <IconButton onClick={handleLogout}>
          <LogoutIcon sx={{ color: "white" }} />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};
