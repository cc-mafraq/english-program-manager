import { Box, IconButton, Typography } from "@mui/material";
import React from "react";

interface LabeledIconButtonProps {
  label: string;
}

export const LabeledIconButton: React.FC<LabeledIconButtonProps> = ({ children, label }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
      }}
    >
      <IconButton>{children}</IconButton>
      <Typography color="primary" sx={{ marginTop: -1 }} variant="caption">
        {label}
      </Typography>
    </Box>
  );
};
