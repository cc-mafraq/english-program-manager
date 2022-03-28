import { IconButton, IconButtonProps, Typography } from "@mui/material";
import React from "react";

interface LabeledIconButtonProps {
  buttonProps?: IconButtonProps & { component?: string };
  color?: string;
  label: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

const buttonStyle = {
  alignItems: "center",
  display: "flex",
  flexDirection: "column",
  margin: "0.2vw",
  maxWidth: "4.5vw",
  textAlign: "center",
  width: "4.5vw",
};

export const LabeledIconButton: React.FC<LabeledIconButtonProps> = ({
  buttonProps,
  children,
  color,
  label,
  onClick,
}) => {
  return (
    <IconButton color="secondary" onClick={onClick} sx={buttonStyle} {...buttonProps}>
      {children}
      <Typography color={color} display="block" fontSize="6pt" fontWeight="bold">
        {label}
      </Typography>
    </IconButton>
  );
};

LabeledIconButton.defaultProps = {
  buttonProps: undefined,
  color: "primary",
  onClick: undefined,
};
