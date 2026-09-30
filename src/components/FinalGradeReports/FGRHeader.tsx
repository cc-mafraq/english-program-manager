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
  const logoSize = `${100 * scale}px`;

  return (
    <Grid
      container
      paddingLeft={spacing}
      paddingRight={spacing}
      paddingTop={spacing}
      sx={{
        border: borderSize,
        borderBottom: smallBorderSize,
        borderColor: lightPrimaryColor,
        borderTopWidth: 0,
      }}
    >
      <Grid item marginBottom="auto" marginTop="auto" xs={2}>
        <img alt="EP Logo" src="./assets/EP-Circle.png" width={logoSize} />
      </Grid>
      <Grid item xs={5.9}>
        <Typography color="black" fontSize={englishFontSize} fontWeight="bold" textAlign="center">
          English Program: Final Grade Report
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
