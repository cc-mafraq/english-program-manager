import { Box, useTheme } from "@mui/material";
import React, { useContext } from "react";
import ReactLoading from "react-loading";
import { AppContext } from "../../../interfaces";

export const Loading: React.FC = () => {
  const theme = useTheme();
  const {
    appState: { loading },
  } = useContext(AppContext);

  return loading ? (
    <Box margin="auto" marginTop="1%" width="5%">
      <ReactLoading color={theme.palette.primary.main} type="spin" />
    </Box>
  ) : (
    <></>
  );
};
