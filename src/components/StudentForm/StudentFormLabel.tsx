import { Typography, TypographyProps } from "@mui/material";
import React from "react";

interface StudentFormLabelProps {
  children?: React.ReactNode;
  textProps?: TypographyProps;
}

export const StudentFormLabel: React.FC<StudentFormLabelProps> = ({ children, textProps }) => {
  return (
    <Typography fontWeight={600} variant="h6" {...textProps}>
      {children}
    </Typography>
  );
};

StudentFormLabel.defaultProps = {
  children: undefined,
  textProps: {},
};
