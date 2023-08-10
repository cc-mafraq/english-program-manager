import { createTheme, PaletteMode, responsiveFontSizes, ThemeProvider, useMediaQuery } from "@mui/material";
import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Authorization, MenuBar } from "./components";
import { loadLocal } from "./hooks";
import { getDesignTokens, voidFn } from "./interfaces";
import { ClassListsPage, LoginPage, StatisticsPage, StudentDatabasePage, WaitingListPage } from "./pages";

export const ColorModeContext = React.createContext({
  toggleColorMode: voidFn,
});

export const App = () => {
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
    return responsiveFontSizes(createTheme(getDesignTokens(mode)));
  }, [mode]);

  return (
    <div style={{ background: theme.palette.background.default, overflowY: "clip" }}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <Authorization>
              <Routes>
                <Route element={<StudentDatabasePage />} path="/epd" />
                <Route element={<WaitingListPage />} path="/waitlist" />
                <Route element={<ClassListsPage />} path="/classlists" />
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
            </Authorization>
          </BrowserRouter>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </div>
  );
};
