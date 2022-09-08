import { Box, BoxProps, Typography, TypographyProps } from "@mui/material";
import { every, get, map } from "lodash";
import React, { useMemo } from "react";

interface LabeledContainerProps {
  childContainerProps?: BoxProps;
  children?: React.ReactNode;
  condition?: boolean;
  label: string;
  labelProps?: TypographyProps;
  parentContainerProps?: BoxProps;
  showWhenEmpty?: boolean;
}

const defaultChildContainerProps: BoxProps = {
  sx: { display: "flex", flexWrap: "wrap" },
};

const defaultParentContainerProps: BoxProps = {
  display: "block",
  marginRight: "2vh",
  marginTop: "1vh",
  padding: 0.5,
  sx: {
    float: "left",
  },
};

const defaultLabelProps: TypographyProps = {
  color: "text.secondary",
  fontSize: "medium",
  fontWeight: "bold",
};

export const LabeledContainer: React.FC<LabeledContainerProps> = ({
  condition,
  childContainerProps,
  labelProps,
  label,
  parentContainerProps,
  showWhenEmpty,
  children,
}) => {
  const childrenChildrenArr = useMemo(() => {
    return children instanceof Array ? map(children, "props.children") : [get(children, "props.children")];
  }, [children]);
  const everyChildIsEmpty = useMemo(() => {
    return every(childrenChildrenArr, (c) => {
      return c === undefined || c === "";
    });
  }, [childrenChildrenArr]);

  return condition && (!everyChildIsEmpty || showWhenEmpty) ? (
    <Box {...defaultParentContainerProps} {...parentContainerProps}>
      <Typography {...defaultLabelProps} {...labelProps}>
        {label}
      </Typography>
      <Box {...defaultChildContainerProps} {...childContainerProps}>
        {children}
      </Box>
    </Box>
  ) : (
    <></>
  );
};

LabeledContainer.defaultProps = {
  childContainerProps: defaultChildContainerProps,
  children: undefined,
  condition: true,
  labelProps: defaultLabelProps,
  parentContainerProps: defaultParentContainerProps,
  showWhenEmpty: false,
};
