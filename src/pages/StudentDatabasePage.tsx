import React from 'react';
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Toolbar,
} from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import AddIcon from '@mui/icons-material/Add';
import { Searchbar } from '../components';

export const StudentDatabasePage = () => {
  return (
    <Toolbar sx={{ justifyContent: 'space-between' }}>
      <FormControl variant="standard" sx={{ width: '7vw' }}>
        <InputLabel>Sort By</InputLabel>
        <Select
          value="name"
          label="Sort By"
          // onChange={handleChange}
        >
          <MenuItem value="name">Name</MenuItem>
          <MenuItem value="level">Level</MenuItem>
        </Select>
      </FormControl>

      <Box>
        <Searchbar />
        <IconButton>
          <FilterAltIcon />
        </IconButton>
      </Box>
      <IconButton>
        <AddIcon color="primary" />
      </IconButton>
    </Toolbar>
  );
};
