import { FilterList, MoreHoriz } from "@mui/icons-material";
import { AppBar, Box, IconButton, Toolbar, Tooltip, Typography, useTheme } from "@mui/material";
import React, { Attributes, Dispatch, SetStateAction, useCallback } from "react";
import { ActionsMenu } from "../..";
import { saveLocal, useAppStore, useColors } from "../../../hooks";
import { FilterValue } from "../../../interfaces";
import { Searchbar } from "./Searchbar";

interface CustomToolbarProps<T> {
  addButtonTooltip?: string;
  filter: FilterValue<T>[];
  filterComponent: React.ReactNode;
  handleDialogOpen?: () => void;
  handleSearchStringChange: (value: string) => void;
  list: T[];
  otherActions?: React.ReactNode;
  setShowActions: Dispatch<SetStateAction<boolean>>;
  showActions: boolean;
  tooltipObjectName?: string;
}

export const CustomToolbar = <T,>({
  list,
  handleSearchStringChange,
  showActions,
  setShowActions,
  tooltipObjectName,
  filterComponent,
  filter,
  handleDialogOpen,
  otherActions,
  addButtonTooltip,
}: CustomToolbarProps<T>) => {
  const [filterAnchorEl, setFilterAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const { iconColor } = useColors();
  const role = useAppStore((state) => {
    return state.role;
  });
  const theme = useTheme();
  const tooltipObjectNameSafe = tooltipObjectName ? ` ${tooltipObjectName}` : "";

  const handlePopoverClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterAnchorEl(event.currentTarget);
  }, []);

  const handlePopoverClose = useCallback(() => {
    setFilterAnchorEl(null);
  }, []);

  return (
    <>
      <AppBar color="default" elevation={1} position="sticky">
        <Toolbar
          sx={{
            justifyContent: "space-between",
            paddingTop: "1vh",
          }}
        >
          {(role === "admin" || role === "faculty") && (
            <Box>
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
            <Box sx={{ whiteSpace: "nowrap" }}>
              <Searchbar
                handleSearchStringChange={handleSearchStringChange}
                placeholder={`Search${tooltipObjectNameSafe.toLowerCase()}`}
              />
              <Tooltip arrow title={`Filter${tooltipObjectNameSafe}`}>
                <IconButton
                  onClick={handlePopoverClick}
                  size="small"
                  sx={{
                    "&:hover": {
                      backgroundColor: filter?.length
                        ? theme.palette.mode === "dark"
                          ? theme.palette.secondary.light
                          : theme.palette.secondary.dark
                        : undefined,
                    },
                    backgroundColor: filter?.length ? theme.palette.secondary.main : undefined,
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
                  handleClose: handlePopoverClose,
                  tooltipObjectName,
                } as Partial<unknown> & Attributes)}
            </Box>
          </Box>
          <Box textAlign="right">
            <Typography>{list.length} results</Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <ActionsMenu
        addButtonTooltip={addButtonTooltip}
        handleDialogOpen={handleDialogOpen}
        otherActions={otherActions}
        showActions={showActions}
        tooltipObjectName={tooltipObjectName}
      />
    </>
  );
};

CustomToolbar.defaultProps = {
  addButtonTooltip: undefined,
  handleDialogOpen: undefined,
  otherActions: undefined,
  tooltipObjectName: undefined,
};
