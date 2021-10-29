import { Grid, Typography, TypographyProps } from "@mui/material";
import React from "react";

const SPACING = 1;

export const FGRGridRow = ({
  colText1,
  colText2,
  colText3,
  colText3Props,
  labelBackgroundColor,
}: {
  colText1: string;
  colText2: string;
  colText3: string;
  colText3Props?: TypographyProps;
  labelBackgroundColor: string;
}) => {
  return (
    <Grid borderBottom={1} borderColor="#222222" container>
      <Grid item padding={SPACING} sx={{ backgroundColor: labelBackgroundColor }} xs={4}>
        <Typography fontSize="12pt" fontWeight="bold" variant="body1">
          {colText1}
        </Typography>
      </Grid>
      <Grid item padding={SPACING} sx={{ backgroundColor: labelBackgroundColor }} xs={4}>
        <Typography fontWeight="bold" textAlign="right" variant="body1">
          {colText2}
        </Typography>
      </Grid>
      <Grid item marginBottom="auto" marginTop="auto" padding={SPACING} xs={4}>
        <Typography fontSize="12pt" textAlign="center" variant="body1" {...colText3Props}>
          {colText3}
        </Typography>
      </Grid>
    </Grid>
  );
};

FGRGridRow.defaultProps = {
  colText3Props: undefined,
};
