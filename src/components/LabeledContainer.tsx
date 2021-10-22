import { Box, BoxProps, Typography, TypographyProps } from "@mui/material";
import { every, get, map } from "lodash";
import React from "react";

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
  const childrenChildrenArr =
    children instanceof Array ? map(children, "props.children") : [get(children, "props.children")];
  const everyChildIsEmpty = every(childrenChildrenArr, (c) => {
    return c === undefined || c === "";
  });
  return !everyChildIsEmpty ? (
    <Box display="block" sx={{ float: "left", marginRight: "2vh", marginTop: "1vh" }}>
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
