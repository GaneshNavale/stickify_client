import { createTheme } from "@mui/material/styles";

const main = createTheme({
  components: {
    MuiListItemButton: {
      styleOverrides: {
        root: {
          "&.MuiListItemButton-root .MuiSvgIcon-root": {
            color: "#fe4816", // Change to your desired color
          },
        },
      },
    },
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
          backgroundColor: "#ffffff",
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
      main: "#b71c1c",
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
