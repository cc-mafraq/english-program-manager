import { Box, Typography, useTheme } from "@mui/material";
import { countBy, get } from "lodash";
import React, { useContext, useMemo } from "react";
import { useColors } from "../../hooks";
import { AppContext } from "../../interfaces";

export const WaitingListCounter: React.FC = () => {
  const {
    appState: { waitingList },
  } = useContext(AppContext);
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
