import { Grid, GridProps } from "@mui/material";
import React from "react";
import { SPACING } from "../../../services";

export const GridContainer: React.FC<GridProps> = (props) => {
  const { children } = props;
  return (
    <Grid container marginBottom={SPACING * 2} marginTop={0} spacing={SPACING} {...props}>
      {children}
    </Grid>
  );
};
