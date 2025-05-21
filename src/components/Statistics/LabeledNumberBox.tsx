import { Box, BoxProps, Typography, useTheme } from "@mui/material";
import React from "react";

interface LabeledNumberBoxProps {
  color: string;
  containerProps?: BoxProps;
  label: string;
  number: number;
}

export const LabeledNumberBox: React.FC<LabeledNumberBoxProps> = ({ color, label, number, containerProps }) => {
  const theme = useTheme();

  return (
    <Box
      display="flex"
      flexDirection="column"
      marginLeft="3.5%"
      marginTop="1%"
      maxWidth="150px"
      minWidth="120px"
      textAlign="center"
      {...containerProps}
    >
      <Box
        alignItems="center"
        bgcolor={color}
        display="flex"
        height="30%"
        justifyContent="center"
        paddingBottom={0.25}
        paddingLeft={1}
        paddingRight={1}
        paddingTop={0.5}
      >
        <Typography fontSize={14} lineHeight="15px">
          {label}
        </Typography>
      </Box>
      <Box border={2} borderColor={color}>
        <Typography color={theme.palette.text.primary} fontSize={48} fontWeight="bold">
          {number}
        </Typography>
      </Box>
    </Box>
  );
};
