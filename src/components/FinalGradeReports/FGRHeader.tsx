import { Grid, Typography, useTheme } from "@mui/material";
import React from "react";

interface FGRHeaderProps {
  borderSize: number;
  scale: number;
  smallBorderSize: number;
  spacing: number;
}

export const FGRHeader: React.FC<FGRHeaderProps> = ({ borderSize, smallBorderSize, spacing, scale }) => {
  const theme = useTheme();
  const primaryColor = theme.palette.primary.main;
  const englishFontSize = `${20 * scale}pt`;
  const arabicFontSize = `${18 * scale}pt`;
  const logoSize = `${60 * scale}px`;

  return (
    <Grid
      border={borderSize}
      borderBottom={smallBorderSize}
      borderColor={primaryColor}
      borderTop={smallBorderSize}
      container
      padding={spacing}
    >
      <Grid item marginBottom="auto" marginTop="auto" xs={1}>
        <img alt="EP Logo" src="./assets/ep-logo-full.png" width={logoSize} />
      </Grid>
      <Grid item xs={7}>
        <Typography fontSize={englishFontSize} fontWeight="bold" textAlign="center" variant="h5">
          CCM English Program: Final Grade Report
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography fontSize={arabicFontSize} textAlign="right" variant="h5">
          برنامج الانجليزي: تقرير العلامات في الصف
        </Typography>
      </Grid>
    </Grid>
  );
};
