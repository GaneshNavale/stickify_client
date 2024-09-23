import React, { useState, useMemo, useEffect } from "react";
import main from "./themes/main";
import { useAdminAuth } from "./hooks/useAdminAuth";
import { useLocation, useNavigate, Route, Routes } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import ReviewsIcon from "@mui/icons-material/Reviews";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import Orders from "./orders";
import AdminSignIn from "./components/users/AdminSignIn";
import Users from "./components/user_management/Users";
import AdminUsers from "./components/user_management/AdminUsers";
import ResetUserPassword from "./components/users/ResetUserPassword";

const NAVIGATION = [
  {
    segment: "admin/dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    segment: "admin/orders",
    title: "Order Management",
    icon: <ShoppingCartIcon />,
  },
  {
    segment: "admin/products",
    title: "Data Management",
    icon: <InventoryIcon />,
  },
  { kind: "divider" },
  {
    segment: "admin/users_management",
    title: "User Management",
    icon: <ManageAccountsIcon />,
    children: [
      {
        segment: "",
        title: "Users",
        icon: <PeopleIcon />,
      },
      {
        segment: "admin_users",
        title: "Admin Users",
        icon: <AdminPanelSettingsIcon />,
      },
    ],
  },
  {
    segment: "admin/reviews",
    title: "Reviews",
    icon: <ReviewsIcon />,
  },
];

function AdminApp(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAdminAuth();

  const [pathname, setPathname] = useState(() => {
    const matchingNav = NAVIGATION.find(({ segment }) =>
      location.pathname.startsWith(`/${segment}`)
    );
    return matchingNav ? `/${matchingNav.segment}` : "/admin/dashboard";
  });

  const router = useMemo(
    () => ({
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => {
        navigate(String(path));
        setPathname(String(path));
      },
    }),
    [navigate, pathname]
  );

  const [userDetails, setUserDetails] = useState({
    user: {
      name: user?.name,
      email: user?.email,
      image: user?.avatar_image_url,
    },
  });

  const authentication = React.useMemo(() => {
    return {
      signIn: () => {},
      signOut: () => {
        logout();
      },
    };
  }, [logout]);

  useEffect(() => {
    setUserDetails({
      user: {
        name: user?.name,
        email: user?.email,
        image: user?.avatar_image_url,
      },
    });
  }, [user]);

  return (
    <ThemeProvider theme={main}>
      <CssBaseline />
      {!user && (
        <Routes>
          <Route
            path="/admin/reset_user_password"
            element={<ResetUserPassword isAdmin />}
          />
          <Route path="/admin/*" element={<AdminSignIn />} />
        </Routes>
      )}
      {user && (
        <AppProvider
          session={userDetails}
          authentication={authentication}
          navigation={NAVIGATION}
          router={router}
          branding={{
            logo: <img src="https://mui.com/static/logo.png" alt="MUI logo" />,
            title: "Stickify",
          }}
          theme={main}
        >
          <DashboardLayout>
            <Box
              sx={{
                py: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Typography>Dashboard content for {pathname}</Typography>
            </Box>

            <Routes>
              <Route path="/admin/orders" element={<Orders />} />
              <Route path="/admin/users_management/*" element={<Users />} />
              <Route
                path="/admin/users_management/admin_users"
                element={<AdminUsers />}
              />
            </Routes>
          </DashboardLayout>
        </AppProvider>
      )}
    </ThemeProvider>
  );
}

export default AdminApp;
