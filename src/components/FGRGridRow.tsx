import { Grid, Typography, TypographyProps } from "@mui/material";
import React from "react";

export interface FGRGridRowProps {
  colText1: string;
  colText2: string;
  colText3: string;
  colText3Props?: TypographyProps;
  labelBackgroundColor: string;
  scale?: number;
  smallBorderSize?: number;
}

export const FGRGridRow: React.FC<FGRGridRowProps> = ({
  colText1,
  colText2,
  colText3,
  colText3Props,
  labelBackgroundColor,
  scale,
  smallBorderSize,
}) => {
  const spacing = scale;
  const fontSize = `${12 * (scale || 1)}pt`;

  return (
    <Grid borderBottom={smallBorderSize} borderColor="#222222" container>
      <Grid item padding={spacing} sx={{ backgroundColor: labelBackgroundColor }} xs={4}>
        <Typography fontSize={fontSize} fontWeight="bold" variant="body1">
          {colText1}
        </Typography>
      </Grid>
      <Grid item padding={spacing} sx={{ backgroundColor: labelBackgroundColor }} xs={4}>
        <Typography fontSize={fontSize} fontWeight="bold" textAlign="right" variant="body1">
          {colText2}
        </Typography>
      </Grid>
      <Grid item marginBottom="auto" marginTop="auto" padding={spacing} xs={4}>
        <Typography fontSize={fontSize} textAlign="center" variant="body1" {...colText3Props}>
          {colText3}
        </Typography>
      </Grid>
    </Grid>
  );
};
