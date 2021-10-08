import React from 'react';
import { Typography, IconButton, Toolbar } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { MenuDrawer } from '.';

const pageName = 'Home';

export const MenuBar = () => {
  return (
    <Toolbar sx={{ justifyContent: 'space-between' }}>
      <MenuDrawer />
      <Typography
        color="primary"
        variant="h6"
        fontWeight="bold"
        display="inline"
        textAlign="center"
      >
        {pageName}
      </Typography>
      <IconButton>
        <LogoutIcon color="primary" />
      </IconButton>
    </Toolbar>
  );
};
