import { createTheme, ThemeProvider } from "@mui/material";
import React, { useReducer } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { MenuBar } from "./components";
import { useLocal } from "./hooks";
import { AppContext, initialAppState } from "./interfaces";
import { LoginPage, StudentDatabasePage } from "./pages";
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
        <BrowserRouter>
          <Routes>
            <Route
              element={
                <>
                  <MenuBar />
                  <StudentDatabasePage />
                </>
              }
              path="/epd"
            />
            <Route element={<LoginPage />} path="/" />
          </Routes>
        </BrowserRouter>
      </AppContext.Provider>
    </ThemeProvider>
  );
};
