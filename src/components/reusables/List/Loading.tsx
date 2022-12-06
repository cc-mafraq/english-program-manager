import { Box, useTheme } from "@mui/material";
import React from "react";
import ReactLoading from "react-loading";
import { useAppStore } from "../../../hooks";

export const Loading: React.FC = () => {
  const theme = useTheme();
  const loading = useAppStore((state) => {
    return state.loading;
  });

  return loading ? (
    <Box margin="auto" marginTop="1%" width="5%">
      <ReactLoading color={theme.palette.primary.main} type="spin" />
    </Box>
  ) : (
    <></>
  );
};
