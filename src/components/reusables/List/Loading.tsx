import { Box, useTheme } from "@mui/material";
import React, { useContext } from "react";
import ReactLoading from "react-loading";
import { useStore } from "zustand";
import { AppContext } from "../../../App";

export const Loading: React.FC = () => {
  const theme = useTheme();
  const store = useContext(AppContext);
  const loading = useStore(store, (state) => {
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
