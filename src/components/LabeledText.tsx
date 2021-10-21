import { Box, BoxProps, Typography, TypographyProps } from "@mui/material";
import React from "react";

interface LabeledTextProps {
  containerProps?: BoxProps;
  label: string;
  labelProps?: TypographyProps;
  textProps?: TypographyProps;
}

export const LabeledText: React.FC<LabeledTextProps> = ({
  containerProps,
  labelProps,
  label,
  textProps,
  children,
}) => {
  return (
    <Box {...containerProps}>
      <Typography {...labelProps}>{label}</Typography>
      <Typography {...textProps}>{children}</Typography>
    </Box>
  );
};

LabeledText.defaultProps = {
  containerProps: { sx: { float: "left", marginRight: "5%" } },
  labelProps: { color: "text.secondary", fontSize: "small", variant: "subtitle2" },
  textProps: { fontSize: "medium" },
};
