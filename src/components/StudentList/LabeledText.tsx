import { Box, BoxProps, Typography, TypographyProps } from "@mui/material";
import React from "react";

interface LabeledTextProps {
  condition?: boolean;
  containerProps?: BoxProps;
  label: string;
  labelProps?: TypographyProps;
  showWhenEmpty?: boolean;
  textProps?: TypographyProps;
}

const defaultContainerProps: BoxProps = {
  sx: { float: "left", marginRight: "5vw" },
};

const defaultLabelProps: TypographyProps = {
  color: "text.secondary",
  fontSize: "small",
  variant: "subtitle2",
};

const defaultTextProps: TypographyProps = {
  fontSize: "medium",
};

export const LabeledText: React.FC<LabeledTextProps> = ({
  condition,
  containerProps,
  labelProps,
  label,
  showWhenEmpty,
  textProps,
  children,
}) => {
  return condition && (children || showWhenEmpty) ? (
    <Box {...defaultContainerProps} {...containerProps}>
      <Typography {...defaultLabelProps} {...labelProps}>
        {label}
      </Typography>
      <Typography {...defaultTextProps} {...textProps}>
        {children}
      </Typography>
    </Box>
  ) : (
    <></>
  );
};

LabeledText.defaultProps = {
  condition: true,
  containerProps: defaultContainerProps,
  labelProps: defaultLabelProps,
  showWhenEmpty: false,
  textProps: defaultTextProps,
};
