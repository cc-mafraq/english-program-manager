import { Grid, Typography, TypographyProps } from "@mui/material";
import React from "react";

export const FGRGridRow = ({
  colText1,
  colText2,
  colText3,
  colText3Props,
  labelBackgroundColor,
  scale,
}: {
  colText1: string;
  colText2: string;
  colText3: string;
  colText3Props?: TypographyProps;
  labelBackgroundColor: string;
  scale: number;
}) => {
  const SPACING = 1 * scale;
  return (
    <Grid borderBottom={1 * scale} borderColor="#222222" container>
      <Grid item padding={SPACING} sx={{ backgroundColor: labelBackgroundColor }} xs={4}>
        <Typography fontSize={`${12 * scale}pt`} fontWeight="bold" variant="body1">
          {colText1}
        </Typography>
      </Grid>
      <Grid item padding={SPACING} sx={{ backgroundColor: labelBackgroundColor }} xs={4}>
        <Typography
          fontSize={`${12 * scale}pt`}
          fontWeight="bold"
          textAlign="right"
          variant="body1"
        >
          {colText2}
        </Typography>
      </Grid>
      <Grid item marginBottom="auto" marginTop="auto" padding={SPACING} xs={4}>
        <Typography
          fontSize={`${12 * scale}pt`}
          textAlign="center"
          variant="body1"
          {...colText3Props}
        >
          {colText3}
        </Typography>
      </Grid>
    </Grid>
  );
};

FGRGridRow.defaultProps = {
  colText3Props: undefined,
};
