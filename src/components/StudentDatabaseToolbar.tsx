import AddIcon from "@mui/icons-material/Add";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import UploadIcon from "@mui/icons-material/Upload";
import { AppBar, Box, IconButton, Popover, TablePagination, Toolbar } from "@mui/material";
import React from "react";
import { LabeledIconButton, Searchbar } from ".";
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
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const buttonLabelStyle = {
    display: "flex",
    flexDirection: "column",
  };

  return (
    <AppBar color="default" elevation={0} position="sticky">
      <Toolbar
        sx={{
          justifyContent: "space-between",
          paddingTop: "1vh",
        }}
      >
        <IconButton onClick={handleClick}>
          <MoreHorizIcon color="primary" />
        </IconButton>
        <Popover
          anchorEl={anchorEl}
          anchorOrigin={{
            horizontal: "left",
            vertical: "bottom",
          }}
          onClose={handleClose}
          open={open}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              maxWidth: "10vw",
              width: "100%",
            }}
          >
            <LabeledIconButton label="Add">
              <AddIcon color="primary" />
            </LabeledIconButton>
            <LabeledIconButton label="Import">
              <UploadIcon color="primary" />
            </LabeledIconButton>
          </Box>
        </Popover>
        <Box>
          <Searchbar />
          <IconButton>
            <FilterAltIcon />
          </IconButton>
        </Box>
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
