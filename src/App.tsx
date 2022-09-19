import { createTheme, PaletteMode, ThemeProvider, useMediaQuery } from "@mui/material";
import React, { useEffect, useReducer } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MenuBar } from "./components";
import { loadLocal, useLocal } from "./hooks";
import { AppContext, getDesignTokens, initialAppState, voidFn } from "./interfaces";
import { LoginPage, StatisticsPage, StudentDatabasePage } from "./pages";
import { reducer } from "./reducers";

export const ColorModeContext = React.createContext({
  toggleColorMode: voidFn,
});

export const App = () => {
  const { save } = useLocal("appState");
  const [appState, appDispatch] = useReducer(reducer(save), initialAppState);
  const isDarkPreference = useMediaQuery("(prefers-color-scheme: dark)");
  const localColorMode = loadLocal("colorMode");
  const [mode, setMode] = React.useState<PaletteMode>(
    (localColorMode || (isDarkPreference ? "dark" : "light")) as PaletteMode,
  );
  const colorMode = React.useMemo(() => {
    return {
      toggleColorMode: () => {
        setMode((prevMode: PaletteMode) => {
          return prevMode === "light" ? "dark" : "light";
        });
      },
    };
  }, []);

  useEffect(() => {
    !localColorMode && setMode(isDarkPreference ? "dark" : "light");
  }, [isDarkPreference, localColorMode]);

  const theme = React.useMemo(() => {
    return createTheme(getDesignTokens(mode));
  }, [mode]);

  const contextValue = React.useMemo(() => {
    return { appDispatch, appState };
  }, [appDispatch, appState]);

  return (
    <div style={{ background: theme.palette.background.default, overflowY: "clip" }}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <AppContext.Provider value={contextValue}>
            <BrowserRouter>
              <Routes>
                <Route
                  element={
                    <>
                      <MenuBar pageName="Student Database" />
                      <StudentDatabasePage />
                    </>
                  }
                  path="/epd"
                />
                <Route
                  element={
                    <>
                      <MenuBar pageName="Statistics" />
                      <StatisticsPage />
                    </>
                  }
                  path="/stats"
                />
                <Route element={<LoginPage />} path="/" />
              </Routes>
            </BrowserRouter>
          </AppContext.Provider>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </div>
  );
};
