import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Prompt, sans-serif',
  },
  palette: {
    primary: {
      main: '#6e5353ff', 
    },
    secondary: {
      main: '#1b413cff',
    },
    info:{
      main:'#ffffffff'
    },
    error:{
      main: '#cf3e3eff'
    },
    success:{
      main:'#159e75ff'
    },
    warning:{
      main:'#c0bd1aff'
    },
    background: {
      default: '#6e5353ff',
      
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0, // ไม่มีมุมโค้ง
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;
