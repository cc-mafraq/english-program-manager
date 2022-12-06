import { Edit, WhatsApp } from "@mui/icons-material";
import { Box, Divider, IconButton, Tooltip, Typography, useTheme } from "@mui/material";
import React from "react";
import { useAppStore, useColors, useWaitingListStore } from "../../hooks";
import { WaitingListEntry } from "../../interfaces";
import { getPosition } from "../../services";

interface WaitingListHeaderProps {
  data: WaitingListEntry;
  handleEditEntryClick: () => void;
}

export const WaitingListCardHeader: React.FC<WaitingListHeaderProps> = ({
  data: wlEntry,
  handleEditEntryClick,
}) => {
  const role = useAppStore((state) => {
    return state.role;
  });
  const waitingList = useWaitingListStore((state) => {
    return state.waitingList;
  });
  const setSelectedWaitingListEntry = useWaitingListStore((state) => {
    return state.setSelectedWaitingListEntry;
  });

  const theme = useTheme();
  const { iconColor } = useColors();

  return (
    <>
      <Typography component="div" display="inline" fontSize={28} gutterBottom>
        {wlEntry.primaryPhone === -1 ? "No Number" : wlEntry.primaryPhone}
      </Typography>
      {(role === "admin" || role === "faculty") && (
        <Typography component="div" display="inline" fontSize={28} gutterBottom marginLeft="25%">
          {wlEntry.name}
        </Typography>
      )}
      <Box sx={{ flexDirection: "row", flexGrow: 1, float: "right" }}>
        {wlEntry.primaryPhone > 700000000 ? (
          <>
            <Tooltip arrow title="Contact on WhatsApp">
              <IconButton href={`https://wa.me/962${wlEntry.primaryPhone}`} target="_blank">
                <WhatsApp sx={{ color: iconColor }} />
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <Typography display="inline" marginRight="5px" variant="h5">
            WA Number Invalid
          </Typography>
        )}
        {role === "admin" && (
          <Tooltip arrow title="Edit Waiting List Entry">
            <IconButton
              onClick={() => {
                setSelectedWaitingListEntry(wlEntry);
                handleEditEntryClick();
              }}
            >
              <Edit sx={{ color: iconColor }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      <Box hidden={!wlEntry.waiting} paddingBottom={1}>
        <Typography
          color={theme.palette.mode === "light" ? theme.palette.secondary.main : theme.palette.primary.light}
          variant="h6"
        >
          {`Position: ${getPosition(waitingList, wlEntry)}`}
        </Typography>
      </Box>
      <Divider />
    </>
  );
};
