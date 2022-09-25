import { Edit, WhatsApp } from "@mui/icons-material";
import { Box, Divider, IconButton, Tooltip, Typography, useTheme } from "@mui/material";
import { findIndex } from "lodash";
import React, { useContext } from "react";
import { useColors } from "../../hooks";
import { AppContext, WaitingListEntry } from "../../interfaces";

interface WaitingListHeaderProps {
  data: WaitingListEntry;
  handleEditEntryClick: () => void;
}

export const WaitingListCardHeader: React.FC<WaitingListHeaderProps> = ({
  data: wlEntry,
  handleEditEntryClick,
}) => {
  const {
    appState: { role, waitingList },
    appDispatch,
  } = useContext(AppContext);

  const theme = useTheme();
  const { iconColor } = useColors();

  return (
    <>
      <Typography component="div" display="inline" fontSize={28} gutterBottom>
        {wlEntry.primaryPhone}
      </Typography>
      <Typography component="div" display="inline" fontSize={28} gutterBottom marginLeft="25%">
        {wlEntry.name}
      </Typography>
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
                // appDispatch({ payload: { selectedStudent: wlEntry } });
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
          {`Position: ${
            findIndex(waitingList, (wle) => {
              return wle.id === wlEntry.id;
            }) + 1
          }`}
        </Typography>
      </Box>
      <Divider />
    </>
  );
};
