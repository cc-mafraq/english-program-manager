import { FilterAlt, MoreHoriz, VisibilityOff } from "@mui/icons-material";
import { AppBar, Box, Divider, IconButton, TablePagination, Toolbar, Tooltip } from "@mui/material";
import React, { Dispatch, SetStateAction } from "react";
import { FilterDrawer, Searchbar } from ".";
import { DataVisibilityPopover } from "..";
import { useColors } from "../../hooks";
import { Student } from "../../interfaces";

const handlePopoverClick = (setFn: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>) => {
  return (event: React.MouseEvent<HTMLButtonElement>) => {
    setFn(event.currentTarget);
  };
};

const handlePopoverClose = (setFn: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>) => {
  return () => {
    setFn(null);
  };
};

interface StudentDatabaseToolbarProps {
  handleChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSearchStringChange: (value: string) => void;
  page: number;
  rowsPerPage: number;
  searchString: string;
  setShowActions: Dispatch<SetStateAction<boolean>>;
  showActions: boolean;
  students: Student[];
}

export const StudentDatabaseToolbar: React.FC<StudentDatabaseToolbarProps> = ({
  students,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  handleSearchStringChange,
  showActions,
  setShowActions,
  searchString,
}) => {
  const [dataVisibilityAnchorEl, setDataVisibilityAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [filterAnchorEl, setFilterAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const { iconColor } = useColors();

  return (
    <AppBar color="default" elevation={0} position="sticky">
      <Toolbar
        sx={{
          justifyContent: "space-between",
          paddingTop: "1vh",
        }}
      >
        <Tooltip arrow placement="right" title={`${showActions ? "Hide" : "Show"} Actions`}>
          <IconButton
            onClick={() => {
              setShowActions(!showActions);
            }}
          >
            <MoreHoriz color="primary" />
          </IconButton>
        </Tooltip>
        <Box>
          <Searchbar handleSearchStringChange={handleSearchStringChange} searchString={searchString} />
          <Tooltip arrow title="Filter Students">
            <IconButton onClick={handlePopoverClick(setFilterAnchorEl)}>
              <FilterAlt sx={{ color: iconColor }} />
            </IconButton>
          </Tooltip>
          <Tooltip arrow title="Hide Student Data">
            <IconButton onClick={handlePopoverClick(setDataVisibilityAnchorEl)}>
              <VisibilityOff sx={{ color: iconColor }} />
            </IconButton>
          </Tooltip>
          <DataVisibilityPopover
            anchorEl={dataVisibilityAnchorEl}
            handleClose={handlePopoverClose(setDataVisibilityAnchorEl)}
          />
          <FilterDrawer anchorEl={filterAnchorEl} handleClose={handlePopoverClose(setFilterAnchorEl)} />
        </Box>
        <TablePagination
          component="div"
          count={students.length}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10, 50, 100, 200, { label: "All", value: -1 }]}
        />
      </Toolbar>
      <Divider />
    </AppBar>
  );
};
