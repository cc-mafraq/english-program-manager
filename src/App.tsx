import { createTheme, ThemeProvider } from "@mui/material";
import React from "react";
import "./App.css";
import { MenuBar } from "./components";
import { StudentDatabasePage } from "./pages";

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
  return (
    <ThemeProvider theme={theme}>
      <MenuBar />
      <StudentDatabasePage />
    </ThemeProvider>
  );
};
