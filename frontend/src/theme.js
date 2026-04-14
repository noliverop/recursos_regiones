import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1565C0',
    },
    secondary: {
      main: '#0288D1',
    },
    background: {
      default: '#F4F6F8',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1565C0',
          color: '#ffffff',
        },
      },
    },
  },
})

export default theme
