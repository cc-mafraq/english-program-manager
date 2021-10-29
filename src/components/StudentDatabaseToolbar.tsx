import AddIcon from "@mui/icons-material/Add";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import UploadIcon from "@mui/icons-material/Upload";
import { AppBar, Box, IconButton, Popover, TablePagination, Toolbar } from "@mui/material";
import React, { ChangeEvent } from "react";
import { LabeledIconButton, Searchbar } from ".";
import { Student } from "../interfaces";

interface RefObject {
  click: () => void;
}

export const StudentDatabaseToolbar = ({
  students,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  handleImportClick,
}: {
  handleChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  handleChangeRowsPerPage: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  handleImportClick: (e: ChangeEvent<HTMLInputElement>) => void;
  page: number;
  rowsPerPage: number;
  students: Student[];
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const fileInput = React.useRef<HTMLInputElement>();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

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
              marginRight: "0.5vw",
              maxWidth: "15vw",
            }}
          >
            <LabeledIconButton label="ADD STUDENT">
              <AddIcon color="primary" />
            </LabeledIconButton>
            <label htmlFor="importSpreadsheet">
              <input
                accept=".txt"
                hidden
                id="importSpreadsheet"
                onChange={handleImportClick}
                type="file"
              />
              <LabeledIconButton label="IMPORT SPREADSHEET">
                <UploadIcon color="primary" />
              </LabeledIconButton>
            </label>
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
