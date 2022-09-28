import { FilterAlt, MoreHoriz } from "@mui/icons-material";
import { AppBar, Box, IconButton, TablePagination, Toolbar, Tooltip } from "@mui/material";
import React, { Attributes, Dispatch, SetStateAction, useContext } from "react";
import { saveLocal, useColors } from "../../../hooks";
import { AppContext } from "../../../interfaces";
import { Searchbar } from "./Searchbar";

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

interface CustomToolbarProps<T> {
  filterComponent: React.ReactNode;
  handleChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSearchStringChange: (value: string) => void;
  list: T[];
  page: number;
  rowsPerPage: number;
  searchPlaceholder: string;
  searchString: string;
  setShowActions: Dispatch<SetStateAction<boolean>>;
  showActions: boolean;
}

export const CustomToolbar = <T,>({
  list,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  handleSearchStringChange,
  showActions,
  setShowActions,
  searchString,
  searchPlaceholder,
  filterComponent,
}: CustomToolbarProps<T>) => {
  const {
    appState: { role },
  } = useContext(AppContext);
  const [filterAnchorEl, setFilterAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const { iconColor } = useColors();

  return (
    <AppBar color="default" elevation={1} position="sticky">
      <Toolbar
        sx={{
          justifyContent: "space-between",
          paddingTop: "1vh",
        }}
      >
        {(role === "admin" || role === "faculty") && (
          <Box width="10vw">
            <Tooltip arrow placement="right" title={`${showActions ? "Hide" : "Show"} Actions`}>
              <IconButton
                onClick={() => {
                  saveLocal("showActions", !showActions);
                  setShowActions(!showActions);
                }}
              >
                <MoreHoriz color="primary" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        <Box margin="auto">
          <Searchbar
            handleSearchStringChange={handleSearchStringChange}
            placeholder={searchPlaceholder}
            searchString={searchString}
          />
          <Tooltip arrow title="Filter Students">
            <IconButton onClick={handlePopoverClick(setFilterAnchorEl)}>
              <FilterAlt sx={{ color: iconColor }} />
            </IconButton>
          </Tooltip>
          {React.isValidElement(filterComponent) &&
            React.cloneElement(filterComponent, {
              anchorEl: filterAnchorEl,
              handleClose: handlePopoverClose(setFilterAnchorEl),
            } as Partial<unknown> & Attributes)}
        </Box>
        <Box width="33vw">
          <TablePagination
            component="div"
            count={list.length}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[10, 50, 100, 200, { label: "All", value: -1 }]}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};
