import React from 'react';
import { Typography, IconButton, Toolbar, useTheme } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { MenuDrawer } from '.';

const pageName = 'Student Database';

export const MenuBar = () => {
  const theme = useTheme();
  return (
    <Toolbar
      sx={{
        color: theme.palette.primary.main,
        justifyContent: 'space-between',
      }}
    >
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
