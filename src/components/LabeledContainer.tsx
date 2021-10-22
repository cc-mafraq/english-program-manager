import { Box, BoxProps, Typography, TypographyProps } from "@mui/material";
import { every, map } from "lodash";
import React, { ReactNode } from "react";

interface LabeledContainerProps {
  containerProps?: BoxProps;
  label: string;
  labelProps?: TypographyProps;
}

const defaultContainerProps: BoxProps = {
  sx: { display: "flex", flexWrap: "wrap" },
};

const defaultLabelProps: TypographyProps = {
  color: "text.secondary",
  fontSize: "medium",
  fontWeight: "bold",
};

export const LabeledContainer: React.FC<LabeledContainerProps> = ({
  containerProps,
  labelProps,
  label,
  children,
}) => {
  const childrenArr = map(children as ReactNode[], "props.children");
  const everyChildIsEmpty = every(childrenArr, (c) => {
    return c === undefined || c === "";
  });
  return !everyChildIsEmpty ? (
    <Box display="block" sx={{ float: "left" }}>
      <Typography {...defaultLabelProps} {...labelProps}>
        {label}
      </Typography>
      <Box {...defaultContainerProps} {...containerProps}>
        {children}
      </Box>
    </Box>
  ) : (
    <></>
  );
};

LabeledContainer.defaultProps = {
  containerProps: defaultContainerProps,
  labelProps: defaultLabelProps,
};
