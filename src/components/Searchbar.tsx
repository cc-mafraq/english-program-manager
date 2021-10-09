import React from 'react';
import { alpha, Box, InputBase, useTheme } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export const Searchbar = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline',
        padding: theme.spacing(1, 0),
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.black, 0.05),
        '&:hover': {
          backgroundColor: alpha(theme.palette.common.black, 0.1),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
          marginLeft: theme.spacing(1),
          width: 'auto',
        },
      }}
    >
      <Box
        sx={{
          padding: theme.spacing(0, 2),
          height: '100%',
          position: 'absolute',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <SearchIcon color="primary" />
      </Box>
      <InputBase
        placeholder="Search students"
        inputProps={{ 'aria-label': 'search' }}
        sx={{
          color: 'inherit',
          '& .MuiInputBase-input': {
            padding: theme.spacing(1, 1, 1, 0),
            // vertical padding + font size from searchIcon
            paddingLeft: `calc(1em + ${theme.spacing(4)})`,
            transition: theme.transitions.create('width'),
            width: '100%',
            [theme.breakpoints.up('sm')]: {
              width: '50ch',
              '&:focus': {
                width: '65ch',
              },
            },
          },
        }}
      />
    </Box>
  );
};
