import { PaletteMode, ThemeOptions } from "@mui/material";
import { grey } from "@mui/material/colors";
import { createContext, Dispatch } from "react";
import { Student } from ".";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const voidFn = () => {};

export const defaultBorderColor = "#808080";
export const darkBlueBackground = "#12161F";
export const lightPrimaryColor = "#002060";
export const lightPrimaryDarkColor = "#000B44";

export const getDesignTokens = (mode: PaletteMode): ThemeOptions => {
  const lightSecondaryColor = "#196da7";
  const darkPrimaryColor = "#58a6ff";
  const darkSecondaryColor = "#004d9a";
  const darkBackgroundColor = "#161b22";

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
  };
};

export interface AppAction {
  payload: Partial<AppState>;
}

interface FilterValue {
  fieldFunction?: (student: Student) => unknown;
  fieldPath: string;
  values: unknown[];
}

export interface AppState {
  filter: FilterValue[];
  loading: boolean;
  selectedStudent: Student | null;
  students: Student[];
}

export const initialAppState: AppState = {
  filter: [],
  loading: true,
  selectedStudent: null,
  students: [],
};

export interface AppContext {
  appDispatch: Dispatch<AppAction> | (() => void);
  appState: AppState;
}

export const AppContext = createContext<AppContext>({
  appDispatch: voidFn,
  appState: initialAppState,
});
AppContext.displayName = "AppContext";
