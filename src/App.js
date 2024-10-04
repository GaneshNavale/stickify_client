import * as React from "react";
import "./App.css";
import main from "./themes/main";
import Copyright from "./Copyright";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import Container from "@mui/material/Container";
import { Route, Routes } from "react-router-dom";
import routes from "./routes";
import { useAuth } from "./hooks/useAuth";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";
import { Grid2 as Grid } from "@mui/material";

function App() {
  const { user } = useAuth();
  return (
    <ThemeProvider theme={main}>
      <CssBaseline />
      <NavBar user={user} />
      <Container maxWidth="lg">
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
      </Container>
      <Copyright />
    </ThemeProvider>
  );
}

export default App;
