import { createTheme, PaletteMode, responsiveFontSizes, ThemeProvider, useMediaQuery } from "@mui/material";
import React, { createContext, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createStore, StoreApi } from "zustand";
import { Authorization, MenuBar } from "./components";
import { loadLocal } from "./hooks";
import { AppState, getDesignTokens, voidFn } from "./interfaces";
import { LoginPage, StatisticsPage, StudentDatabasePage, WaitingListPage } from "./pages";

export const ColorModeContext = React.createContext({
  toggleColorMode: voidFn,
});

export const appStore = createStore<AppState>()((set) => {
  return {
    loading: true,
    role: "staff",
    selectedStudent: null,
    selectedWaitingListEntry: null,
    setLoading: (loading: AppState["loading"]) => {
      return set(() => {
        return { loading };
      });
    },
    setRole: (role: AppState["role"]) => {
      return set(() => {
        return { role };
      });
    },
    setSelectedStudent: (selectedStudent: AppState["selectedStudent"]) => {
      return set(() => {
        return { selectedStudent };
      });
    },
    setSelectedWaitingListEntry: (selectedWaitingListEntry: AppState["selectedWaitingListEntry"]) => {
      return set(() => {
        return { selectedWaitingListEntry };
      });
    },
    setStudentFilter: (studentFilter: AppState["studentFilter"]) => {
      return set(() => {
        return { studentFilter };
      });
    },
    setStudents: (students: AppState["students"]) => {
      return set(() => {
        return { students };
      });
    },
    setWaitingList: (waitingList: AppState["waitingList"]) => {
      return set(() => {
        return { waitingList };
      });
    },
    setWaitingListFilter: (waitingListFilter: AppState["waitingListFilter"]) => {
      return set(() => {
        return { waitingListFilter };
      });
    },
    studentFilter: [],
    students: [],
    waitingList: [],
    waitingListFilter: [],
  };
});
export const AppContext = createContext<StoreApi<AppState>>(appStore);

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
          <AppContext.Provider value={appStore}>
            <BrowserRouter>
              <Authorization>
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
                        <MenuBar pageName="Waiting List" />
                        <WaitingListPage />
                      </>
                    }
                    path="/waitlist"
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
              </Authorization>
            </BrowserRouter>
          </AppContext.Provider>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </div>
  );
};
