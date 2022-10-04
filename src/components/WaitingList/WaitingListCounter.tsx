import { Box, Typography } from "@mui/material";
import { countBy, get } from "lodash";
import React, { useContext, useMemo } from "react";
import { useColors } from "../../hooks";
import { AppContext } from "../../interfaces";

export const WaitingListCounter: React.FC = () => {
  const {
    appState: { waitingList },
  } = useContext(AppContext);
  const { iconColor } = useColors();
  const numWaiting = useMemo(() => {
    return get(countBy(waitingList, "waiting"), "true");
  }, [waitingList]);

  return (
    <Box sx={{ position: "absolute", right: "175px", top: "17px" }}>
      <Typography color={iconColor || "white"} fontWeight={600} variant="h6">
        {numWaiting}
      </Typography>
    </Box>
  );
};
