import { Box, MenuItem, Typography } from "@mui/material";
import React from "react";

interface LabeledIconButtonProps {
  color?: string;
  label: string;
  onClick?: (e: React.MouseEvent<HTMLLIElement>) => void;
}

export const LabeledIconButton: React.FC<LabeledIconButtonProps> = ({
  children,
  color,
  label,
  onClick,
}) => {
  return (
    <Box
      sx={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        margin: "0.2vw",
        maxWidth: "4.5vw",
        textAlign: "center",
        width: "4.5vw",
      }}
    >
      <MenuItem onClick={onClick}>{children}</MenuItem>
      <Typography
        color={color}
        display="block"
        fontSize="6pt"
        fontWeight="bold"
        sx={{ marginTop: -1 }}
        variant="button"
      >
        {label}
      </Typography>
    </Box>
  );
};

LabeledIconButton.defaultProps = {
  color: "primary",
  onClick: undefined,
};
