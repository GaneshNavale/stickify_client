import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import LayersIcon from "@mui/icons-material/Layers";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import AdminSignIn from "./AdminSignIn";
import LoginIcon from "@mui/icons-material/Login";
import { useAuth } from "../hooks/useAuth";

const NAVIGATION = [
  { kind: "header", title: "Main items" },
  { segment: "dashboard", title: "Dashboard", icon: <DashboardIcon /> },
  { segment: "orders", title: "Orders", icon: <ShoppingCartIcon /> },
  { kind: "divider" },
  { kind: "header", title: "Analytics" },
  {
    segment: "reports",
    title: "Reports",
    icon: <BarChartIcon />,
    children: [
      { segment: "sales", title: "Sales", icon: <DescriptionIcon /> },
      { segment: "traffic", title: "Traffic", icon: <DescriptionIcon /> },
      { segment: "ReportTab1", title: "ReportTab1", icon: <DescriptionIcon /> },
      { segment: "ReportTab2", title: "ReportTab2", icon: <DescriptionIcon /> },
      { segment: "ReportTab3", title: "ReportTab3", icon: <DescriptionIcon /> },
    ],
  },
  { segment: "integrations", title: "Integrations", icon: <LayersIcon /> },
  { kind: "divider" },
  { segment: "signIn", title: "Sign In", icon: <LoginIcon /> },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },

  colorSchemes: { light: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

const AdminLogIn = () => (
  <div className="admin-sign-in-container">
    <Typography variant="h5">Admin Sign In</Typography>
    <AdminSignIn />
  </div>
);

const DemoPageContent = ({ pathname }) => (
  <Box
    sx={{
      py: 4,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
    }}
  >
    <Typography>
      Dashboard content for {pathname}
      {pathname === "/signIn" && <AdminLogIn />}
    </Typography>
  </Box>
);

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

const AdminDashboard = ({ window }) => {
  const [pathname, setPathname] = React.useState("/dashboard");

  const router = React.useMemo(
    () => ({
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    }),
    [pathname]
  );

  const demoWindow = window !== undefined ? window() : undefined;

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout>
        <DemoPageContent pathname={pathname} />
      </DashboardLayout>
    </AppProvider>
  );
};

AdminDashboard.propTypes = {
  window: PropTypes.func,
};

export default AdminDashboard;
