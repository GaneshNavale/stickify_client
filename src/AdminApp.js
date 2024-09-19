import React, { useState, useMemo, useEffect } from "react";
import main from "./themes/main";
import { useAdminAuth } from "./hooks/useAdminAuth";
import { useLocation, useNavigate, Route, Routes } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import ReviewsIcon from "@mui/icons-material/Reviews";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import Orders from "./orders";
import AdminSignIn from "./components/users/AdminSignIn";
import UserManagement from "./components/users";

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
    segment: "admin/users",
    title: "User Management",
    icon: <ManageAccountsIcon />,
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

  // const router = useMemo(() => {
  //   return {
  //     pathname,
  //     searchParams: new URLSearchParams(),
  //     navigate: (path) => {
  //       navigate(String(path));
  //       setPathname(String(path));
  //     },
  //   };
  // }, [pathname, navigate]);

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
      {!user && <AdminSignIn />}
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
              <Route path="/admin/users" element={<UserManagement />} />
            </Routes>
          </DashboardLayout>
        </AppProvider>
      )}
    </ThemeProvider>
  );
}

export default AdminApp;
