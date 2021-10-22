import AddIcon from "@mui/icons-material/Add";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import {
  AppBar,
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Toolbar,
} from "@mui/material";
import React from "react";
import { Searchbar } from ".";

export const StudentDatabaseToolbar = () => {
  return (
    <AppBar color="default" elevation={0} position="sticky">
      <Toolbar
        sx={{
          justifyContent: "space-between",
          paddingTop: "1vh",
        }}
      >
        <FormControl sx={{ width: "7vw" }} variant="standard">
          <InputLabel>Sort By</InputLabel>
          <Select
            label="Sort By"
            value="name"
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
    </AppBar>
  );
};
