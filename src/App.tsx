import { createTheme, ThemeProvider } from "@mui/material";
import React, { useReducer } from "react";
import "./App.css";
import { MenuBar } from "./components";
import { useLocal } from "./hooks";
import { AppContext, initialAppState } from "./interfaces";
import { StudentDatabasePage } from "./pages";
import { reducer } from "./reducers";

const theme = createTheme({
  palette: {
    primary: {
      main: "#002060",
    },
    secondary: {
      // main: '#b3e5fc',
      main: "#196da7",
    },
  },
});

export const App = () => {
  const { save } = useLocal("appState");
  const [appState, appDispatch] = useReducer(reducer(save), initialAppState);

  return (
    <ThemeProvider theme={theme}>
      <AppContext.Provider value={{ appDispatch, appState }}>
        <MenuBar />
        <StudentDatabasePage />
      </AppContext.Provider>
    </ThemeProvider>
  );
};
