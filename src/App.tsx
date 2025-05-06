import { createTheme, PaletteMode, responsiveFontSizes, ThemeProvider, useMediaQuery } from "@mui/material";
import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Authorization, MenuBar, OfflineSnackbar } from "./components";
import { ColorModeContext } from "./contexts";
import { loadLocal, useAppStore, useDatabase, useStudentStore, useWaitingListStore } from "./hooks";
import { getDesignTokens } from "./interfaces";
import { ClassListsPage, LoginPage, StatisticsPage, StudentDatabasePage, WaitingListPage } from "./pages";

export const App = () => {
  const isDarkPreference = useMediaQuery("(prefers-color-scheme: dark)");
  const localColorMode = loadLocal("colorMode");
  const [mode, setMode] = React.useState<PaletteMode>(
    (localColorMode || (isDarkPreference ? "dark" : "light")) as PaletteMode,
  );
  const online = useAppStore((state) => {
    return state.online;
  });
  const setOnline = useAppStore((state) => {
    return state.setOnline;
  });
  window.addEventListener("online", () => {
    setOnline(true);
  });
  window.addEventListener("offline", () => {
    if (online) {
      setOnline(false);
    }
  });

  const colorMode = React.useMemo(() => {
    return {
      toggleColorMode: () => {
        setMode((prevMode: PaletteMode) => {
          return prevMode === "light" ? "dark" : "light";
        });
      },
    };
  }, []);

  const setStudents = useStudentStore((state) => {
    return state.setStudents;
  });
  const setWaitingList = useWaitingListStore((state) => {
    return state.setWaitingList;
  });

  useEffect(() => {
    !localColorMode && setMode(isDarkPreference ? "dark" : "light");
  }, [isDarkPreference, localColorMode]);

  useDatabase({ collectionName: "students", setData: setStudents });
  useDatabase({ collectionName: "waitingList", setData: setWaitingList });

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
          <OfflineSnackbar />
        </ThemeProvider>
      </ColorModeContext.Provider>
    </div>
  );
};
