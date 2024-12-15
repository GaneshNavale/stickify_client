import * as React from "react";
import "./App.css";
import main from "./themes/main";
import Copyright from "./Copyright";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { Route, Routes } from "react-router-dom";
import routes from "./routes";
import { useAuth } from "./hooks/useAuth";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { user, cart } = useAuth();
  return (
    <ThemeProvider theme={main}>
      <CssBaseline />
      <NavBar user={user} cart={cart} />
      <Box marginTop={7.5}>
        <Routes>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={
                route.isProtected ? (
                  <ProtectedRoute element={route.component} />
                ) : (
                  route.component
                )
              }
            />
          ))}
        </Routes>
      </Box>
      <Copyright />
    </ThemeProvider>
  );
}

export default App;
