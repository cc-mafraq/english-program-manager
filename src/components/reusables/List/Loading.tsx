import { Box, useTheme } from "@mui/material";
import React from "react";
import ReactLoading from "react-loading";
import { useAppStore } from "../../../hooks";

interface LoadingProps {
  loading?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ loading }) => {
  const theme = useTheme();
  const appLoading = useAppStore((state) => {
    return state.loading;
  });

  return loading || (loading === undefined && appLoading) ? (
    <Box margin="auto" marginTop="1%" width="5%">
      <ReactLoading color={theme.palette.primary.main} type="spin" />
    </Box>
  ) : (
    <></>
  );
};
