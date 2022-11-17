import { Box, Typography, useTheme } from "@mui/material";
import { countBy, get } from "lodash";
import React, { useContext, useMemo } from "react";
import { useStore } from "zustand";
import { AppContext } from "../../App";
import { useColors } from "../../hooks";

export const WaitingListCounter: React.FC = () => {
  const store = useContext(AppContext);
  const waitingList = useStore(store, (state) => {
    return state.waitingList;
  });
  const { iconColor } = useColors();
  const theme = useTheme();
  const numWaiting = useMemo(() => {
    return get(countBy(waitingList, "waiting"), "true");
  }, [waitingList]);

  return (
    <Box
      sx={{
        position: "absolute",
        right: "calc(128px + 3vw)",
        top: "12px",
        [theme.breakpoints.up("sm")]: { top: "17px" },
      }}
    >
      <Typography color={iconColor || "white"} fontWeight={600} variant="h6">
        {numWaiting}
      </Typography>
    </Box>
  );
};
