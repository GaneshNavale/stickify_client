import { blue, teal, deepOrange, grey } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

const main = createTheme({
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          // Ensure link color does not change when visited
          "&:visited": {
            color: teal[700],
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: "#fcfdff",
          color: teal[700],
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          // backgroundColor: blue[700],
          color: teal[700],
        },
      },
    },
  },
  palette: {
    primary: {
      light: teal[500],
      main: teal[700],
      dark: teal[900],
      contrastText: "#fff",
    },
    // secondary: {
    //   light: deepOrange[300],
    //   main: deepOrange[600],
    //   dark: deepOrange[900],
    //   contrastText: "#fff",
    // },
  },
});

export default main;
