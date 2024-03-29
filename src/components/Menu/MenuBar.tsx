import { Brightness4, Brightness7, Logout } from "@mui/icons-material";
import { AppBar, Box, IconButton, Toolbar, Tooltip, Typography, useTheme } from "@mui/material";
import React, { RefObject } from "react";
import { useNavigate } from "react-router-dom";
import { MenuDrawer } from "..";
import { ColorModeContext } from "../../App";
import { saveLocal, useColors } from "../../hooks";
import { logout } from "../../services";

interface MenuBarProps {
  innerRef?: RefObject<HTMLDivElement>;
  pageName: string;
}

export const MenuBar: React.FC<MenuBarProps> = ({ pageName, innerRef }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { iconColor } = useColors();
  const colorMode = React.useContext(ColorModeContext);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <AppBar ref={innerRef} position="static">
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
          <Tooltip arrow title="Change Theme">
            <IconButton
              color="inherit"
              onClick={() => {
                colorMode.toggleColorMode();
                saveLocal("colorMode", theme.palette.mode === "dark" ? "light" : "dark");
              }}
              sx={{ marginRight: 3 }}
            >
              {theme.palette.mode === "dark" ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Tooltip>
          <Tooltip arrow title="Logout">
            <IconButton onClick={handleLogout}>
              <Logout sx={{ color: iconColor || "white" }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

MenuBar.defaultProps = {
  innerRef: undefined,
};
