import { Typography, TypographyProps } from "@mui/material";
import React from "react";

interface StudentFormLabelProps {
  children?: React.ReactNode;
  textProps?: TypographyProps;
}

export const FormLabel: React.FC<StudentFormLabelProps> = ({ children, textProps }) => {
  return (
    <Typography fontWeight={600} variant="h6" {...textProps}>
      {children}
    </Typography>
  );
};

FormLabel.defaultProps = {
  children: undefined,
  textProps: {},
};
