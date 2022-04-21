import { Brightness4, Brightness7, Logout } from "@mui/icons-material";
import { AppBar, Box, IconButton, Toolbar, Typography, useTheme } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { MenuDrawer } from "..";
import { ColorModeContext } from "../../App";
import { useColors } from "../../hooks";
import { logout } from "../../services";

interface MenuBarProps {
  pageName: string;
}

export const MenuBar: React.FC<MenuBarProps> = ({ pageName }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { iconColor } = useColors();
  const colorMode = React.useContext(ColorModeContext);

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
        <Typography
          color={iconColor || "white"}
          display="inline"
          fontWeight="bold"
          marginLeft="5%"
          textAlign="center"
          variant="h6"
        >
          {pageName}
        </Typography>
        <Box>
          {/* https://mui.com/customization/dark-mode/ */}
          <IconButton color="inherit" onClick={colorMode.toggleColorMode} sx={{ marginRight: 3 }}>
            {theme.palette.mode === "dark" ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          <IconButton onClick={handleLogout}>
            <Logout sx={{ color: iconColor || "white" }} />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
