import { createTheme, ThemeProvider } from '@mui/material';
import React from 'react';
import './App.css';
import { MenuDrawer } from './components';

const theme = createTheme({
  palette: {
    primary: {
      main: '#002060',
    },
    secondary: {
      main: '#b3e5fc',
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <MenuDrawer />
    </ThemeProvider>
  );
};

export default App;
