import { Grid, Typography } from "@mui/material";
import React from "react";
import { lightPrimaryColor } from "../../interfaces";

interface FGRHeaderProps {
  borderSize: number;
  scale: number;
  smallBorderSize: number;
  spacing: number;
}

export const FGRHeader: React.FC<FGRHeaderProps> = ({ borderSize, smallBorderSize, spacing, scale }) => {
  const englishFontSize = `${20 * scale}pt`;
  const arabicFontSize = `${18 * scale}pt`;
  const logoSize = `${60 * scale}px`;

  return (
    <Grid
      container
      padding={spacing}
      sx={{
        border: borderSize,
        borderBottom: smallBorderSize,
        borderColor: lightPrimaryColor,
        borderTopWidth: 0,
      }}
    >
      <Grid item marginBottom="auto" marginTop="auto" xs={1}>
        <img alt="EP Logo" src="./assets/ep-logo-full.png" width={logoSize} />
      </Grid>
      <Grid item xs={7}>
        <Typography color="black" fontSize={englishFontSize} fontWeight="bold" textAlign="center">
          CCM English Program: Final Grade Report
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography color="black" fontSize={arabicFontSize} textAlign="right">
          برنامج الانجليزي: تقرير العلامات في الصف
        </Typography>
      </Grid>
    </Grid>
  );
};
