import { createTheme, ThemeProvider } from '@mui/material';
import React from 'react';
import './App.css';
import { MenuBar } from './components';

const theme = createTheme({
  palette: {
    primary: {
      main: '#002060',
    },
    secondary: {
      // main: '#b3e5fc',
      main: '#196da7',
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <MenuBar />
    </ThemeProvider>
  );
};

export default App;
