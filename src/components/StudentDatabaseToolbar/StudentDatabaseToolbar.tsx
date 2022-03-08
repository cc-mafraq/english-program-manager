import FilterAltIcon from "@mui/icons-material/FilterAlt";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { AppBar, Box, IconButton, TablePagination, Toolbar } from "@mui/material";
import React, { ChangeEvent } from "react";
import { ActionsPopover, Searchbar } from ".";
import { DataVisibilityPopover } from "..";
import { Student } from "../../interfaces";

const handlePopoverClick = (
  setFn: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>,
) => {
  return (event: React.MouseEvent<HTMLButtonElement>) => {
    setFn(event.currentTarget);
  };
};

const handlePopoverClose = (
  setFn: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>,
) => {
  return () => {
    setFn(null);
  };
};

interface StudentDatabaseToolbarProps {
  handleAddStudentClick: (e: React.MouseEvent<HTMLElement>) => void;
  handleChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  handleChangeRowsPerPage: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  handleGenerateFGRClick: (e: React.MouseEvent<HTMLElement>) => void;
  handleImportClick: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSearchStringChange: (value: string) => void;
  page: number;
  rowsPerPage: number;
  students: Student[];
}

export const StudentDatabaseToolbar: React.FC<StudentDatabaseToolbarProps> = ({
  students,
  page,
  rowsPerPage,
  handleAddStudentClick,
  handleChangePage,
  handleChangeRowsPerPage,
  handleImportClick,
  handleGenerateFGRClick,
  handleSearchStringChange,
}) => {
  const [actionsAnchorEl, setActionsAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [dataFilterAnchorEl, setDataFilterAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );

  return (
    <AppBar color="default" elevation={0} position="sticky">
      <Toolbar
        sx={{
          justifyContent: "space-between",
          paddingTop: "1vh",
        }}
      >
        <IconButton onClick={handlePopoverClick(setActionsAnchorEl)}>
          <MoreHorizIcon color="primary" />
        </IconButton>
        <ActionsPopover
          anchorEl={actionsAnchorEl}
          handleAddStudentClick={handleAddStudentClick}
          handleClose={handlePopoverClose(setActionsAnchorEl)}
          handleGenerateFGRClick={handleGenerateFGRClick}
          handleImportClick={handleImportClick}
        />
        <Box>
          <Searchbar handleSearchStringChange={handleSearchStringChange} />
          <IconButton>
            <FilterAltIcon />
          </IconButton>
          <IconButton onClick={handlePopoverClick(setDataFilterAnchorEl)}>
            <VisibilityOffIcon />
          </IconButton>
          <DataVisibilityPopover
            anchorEl={dataFilterAnchorEl}
            handleClose={handlePopoverClose(setDataFilterAnchorEl)}
          />
        </Box>
        <TablePagination
          component="div"
          count={students.length}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10, 50, 100, 200, 1000]}
        />
      </Toolbar>
    </AppBar>
  );
};
