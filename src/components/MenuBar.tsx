import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import React from 'react';
import { MenuDrawer } from '.';

const name = 'Jon';

export const MenuBar = () => {
  return (
    <Box flexGrow={1}>
      <AppBar position="static" color="default">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <MenuDrawer />
          <Box>
            <Box display="inline">
              <Typography
                sx={{
                  display: 'inline',
                  marginRight: '3em',
                }}
                variant="h6"
                component="div"
                color="primary"
                fontWeight="bold"
              >
                Hi, {name}
              </Typography>
            </Box>
            <IconButton size="large" color="primary">
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
