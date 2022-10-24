import { FilterList, MoreHoriz } from "@mui/icons-material";
import { AppBar, Box, IconButton, Toolbar, Tooltip, Typography, useTheme } from "@mui/material";
import { get } from "lodash";
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
  filterName: string;
  handleSearchStringChange: (value: string) => void;
  list: T[];
  searchString: string;
  setShowActions: Dispatch<SetStateAction<boolean>>;
  showActions: boolean;
  tooltipObjectName: string;
}

export const CustomToolbar = <T,>({
  list,
  handleSearchStringChange,
  showActions,
  setShowActions,
  searchString,
  tooltipObjectName,
  filterComponent,
  filterName,
}: CustomToolbarProps<T>) => {
  const {
    appState: { role },
  } = useContext(AppContext);
  const [filterAnchorEl, setFilterAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const { iconColor } = useColors();
  const { appState } = useContext(AppContext);
  const filter = get(appState, filterName);
  const theme = useTheme();

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
            placeholder={`Search ${tooltipObjectName.toLowerCase()}`}
            searchString={searchString}
          />
          <Tooltip arrow title={`Filter ${tooltipObjectName}`}>
            <IconButton
              onClick={handlePopoverClick(setFilterAnchorEl)}
              size="small"
              sx={{
                "&:hover": {
                  backgroundColor: filter?.length
                    ? theme.palette.mode === "dark"
                      ? theme.palette.primary.light
                      : theme.palette.primary.dark
                    : undefined,
                },
                backgroundColor: filter?.length ? theme.palette.primary.main : undefined,
                marginBottom: "5px",
                marginLeft: "10px",
              }}
            >
              <FilterList sx={{ color: filter?.length ? theme.palette.common.white : iconColor }} />
            </IconButton>
          </Tooltip>
          {React.isValidElement(filterComponent) &&
            React.cloneElement(filterComponent, {
              anchorEl: filterAnchorEl,
              handleClose: handlePopoverClose(setFilterAnchorEl),
              tooltipObjectName,
            } as Partial<unknown> & Attributes)}
        </Box>
        <Box paddingRight="5vw" textAlign="right" width="15vw">
          <Typography>{list.length} results</Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
