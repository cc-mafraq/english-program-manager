import { createTheme, PaletteMode, responsiveFontSizes, ThemeProvider, useMediaQuery } from "@mui/material";
import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Authorization, MenuBar, StudentDatabaseWrapper } from "./components";
import { WaitingListDatabaseWrapper } from "./components/Wrappers/WaitingListDatabaseWrapper";
import { ColorModeContext } from "./contexts";
import { loadLocal, useDatabase, useStudentStore, useWaitingListStore } from "./hooks";
import { getDesignTokens } from "./interfaces";
import { ClassListsPage, LoginPage, StatisticsPage, StudentDatabasePage, WaitingListPage } from "./pages";

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
                <Route
                  element={
                    <StudentDatabaseWrapper>
                      <StudentDatabasePage />
                    </StudentDatabaseWrapper>
                  }
                  path="/epd"
                />
                <Route
                  element={
                    <StudentDatabaseWrapper>
                      <WaitingListDatabaseWrapper>
                        <WaitingListPage />
                      </WaitingListDatabaseWrapper>
                    </StudentDatabaseWrapper>
                  }
                  path="/waitlist"
                />
                <Route
                  element={
                    <StudentDatabaseWrapper>
                      <ClassListsPage />
                    </StudentDatabaseWrapper>
                  }
                  path="/classlists"
                />
                <Route
                  element={
                    <StudentDatabaseWrapper>
                      <WaitingListDatabaseWrapper>
                        <MenuBar pageName="Statistics" />
                        <StatisticsPage />
                      </WaitingListDatabaseWrapper>
                    </StudentDatabaseWrapper>
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
