import LogoutIcon from "@mui/icons-material/Logout";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import React from "react";
import { MenuDrawer } from ".";

const pageName = "Student Database";

export const MenuBar = () => {
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
        <IconButton>
          <LogoutIcon sx={{ color: "white" }} />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};
