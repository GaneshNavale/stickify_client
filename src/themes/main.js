import { createTheme } from "@mui/material/styles";

const main = createTheme({
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          // Ensure link color does not change when visited
          "&:visited": {
            color: "#006ce5",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: "#f5fafe",
          color: "#fe4816",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          color: "#fe4816",
        },
      },
    },
  },

  palette: {
    primary: {
      main: "#fe4816",
    },
    secondary: {
      main: "#006ce5",
    },
    error: {
      main: "#f00000",
    },
    warning: {
      main: "#ed6c02",
    },
    info: {
      main: "#0288d1",
    },
  },
});

export default main;
