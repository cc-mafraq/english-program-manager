import { Snackbar, SnackbarContent } from "@mui/material";
import React from "react";
import { useAppStore } from "../hooks";

export const OfflineSnackbar: React.FC = () => {
  const online = useAppStore((state) => {
    return state.online;
  });

  return (
    <Snackbar
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      open={!online}
      sx={{
        maxWidth: "50%",
        zIndex: 1200,
      }}
    >
      <SnackbarContent message="You are offline - changes will sync once you're reconnected." />
    </Snackbar>
  );
};
