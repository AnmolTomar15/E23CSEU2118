import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0A1628', // Dark navy primary
    },
    secondary: {
      main: '#1E88E5', // Accent blue
    },
    success: {
      main: '#00C853', // Success green
    },
    warning: {
      main: '#FF9800', // Orange for Result
    },
    info: {
      main: '#2196F3', // Blue for Event
    },
    background: {
      default: '#040b14',
      paper: '#0A1628',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeightBold: 700,
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        },
      },
    },
  },
});

export default theme;
