import { PaletteMode, ThemeOptions } from "@mui/material";
import { grey } from "@mui/material/colors";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const voidFn = () => {};

export const darkBlueBackground = "#0D1117";
export const lightPrimaryColor = "#002060";
export const lightPrimaryDarkColor = "#000B44";

export const getDesignTokens = (mode: PaletteMode): ThemeOptions => {
  const lightSecondaryColor = "#196da7";
  const darkPrimaryColor = "#58a6ff";
  const darkSecondaryColor = "#004d9a";
  const darkBackgroundColor = "#0D1117";

  return {
    palette: {
      mode,
      ...(mode === "light"
        ? {
            primary: {
              main: lightPrimaryColor,
            },
            secondary: {
              main: lightSecondaryColor,
            },
          }
        : {
            background: {
              default: darkBackgroundColor,
              paper: darkBackgroundColor,
            },
            primary: {
              main: darkPrimaryColor,
            },
            secondary: {
              main: darkSecondaryColor,
            },
            text: {
              primary: grey[300],
              secondary: grey[400],
            },
          }),
    },
    typography: { h5: { fontSize: 28 } },
  };
};

export interface FilterValue<T> {
  fieldFunction?: (object: T) => unknown;
  fieldPath: string;
  values: unknown[];
}
