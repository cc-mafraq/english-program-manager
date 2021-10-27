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
  TablePagination,
  Toolbar,
} from "@mui/material";
import React from "react";
import { Searchbar } from ".";
import { Student } from "../interfaces";

export const StudentDatabaseToolbar = ({
  students,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
}: {
  handleChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  handleChangeRowsPerPage: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  page: number;
  rowsPerPage: number;
  students: Student[];
}) => {
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
        <TablePagination
          component="div"
          count={students.length}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10, 50, 100, 200, 500, 1000, 2000]}
        />
      </Toolbar>
    </AppBar>
  );
};
