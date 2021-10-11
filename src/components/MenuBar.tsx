import React from 'react';
import {
  Typography,
  IconButton,
  Toolbar,
  useTheme,
  AppBar,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { MenuDrawer } from '.';

const pageName = 'Student Database';

export const MenuBar = () => {
  const theme = useTheme();
  return (
    <AppBar position="static">
      <Toolbar
        sx={{
          justifyContent: 'space-between',
        }}
      >
        <MenuDrawer />
        <Typography
          color="white"
          variant="h6"
          fontWeight="bold"
          display="inline"
          textAlign="center"
        >
          {pageName}
        </Typography>
        <IconButton>
          <LogoutIcon sx={{ color: 'white' }} />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};
