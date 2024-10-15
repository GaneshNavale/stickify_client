import React, { useState, useMemo, useEffect } from "react";
import main from "./themes/main";
import { useAdminAuth } from "./hooks/useAdminAuth";
import { useLocation, useNavigate, Route, Routes } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category";
import DatasetIcon from "@mui/icons-material/Dataset";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import InventoryIcon from "@mui/icons-material/Inventory";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import PeopleIcon from "@mui/icons-material/People";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import ReviewsIcon from "@mui/icons-material/Reviews";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import Orders from "./orders";
import AdminSignIn from "./components/users/AdminSignIn";
import Users from "./components/user_management/Users";
import Categories from "./components/data_management/Categories";
import AdminUsers from "./components/user_management/AdminUsers";
import ResetUserPassword from "./components/users/ResetUserPassword";
import Category from "./components/data_management/Category";
import Products from "./components/data_management/Products";
import Product from "./components/data_management/Product";

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
    segment: "admin/data_management",
    title: "Catalog Management",
    icon: <DatasetIcon />,
    children: [
      {
        segment: "",
        title: "Categories",
        icon: <CategoryIcon />,
      },
      {
        segment: "products",
        title: "Products",
        icon: <InventoryIcon />,
      },
      {
        segment: "customization",
        title: "Customization",
        icon: <FormatColorFillIcon />,
      },
    ],
  },
  {
    segment: "admin/users_management",
    title: "User Management",
    icon: <ManageAccountsIcon color="primary" />,
    children: [
      {
        segment: "",
        title: "Users",
        icon: <PeopleIcon color="primary" />,
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
        <>
          <AppProvider
            session={userDetails}
            authentication={authentication}
            navigation={NAVIGATION}
            router={router}
            branding={{
              logo: <img src="/logo.png" alt="Stick IT Up logo" />,
              title: "",
            }}
            theme={main}
          >
            <DashboardLayout
              sx={{ width: "100%", flexGrow: 1, position: "relative" }}
            >
              <Box
                sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}
              >
                <Routes>
                  <Route path="/admin/orders" element={<Orders />} />
                  <Route path="/admin/users_management/*" element={<Users />} />
                  <Route
                    path="/admin/data_management/*"
                    element={<Categories />}
                  />
                  <Route
                    path="/admin/data_management/categories/:slug"
                    element={<Category />}
                  />
                  <Route
                    path="/admin/data_management/products"
                    element={<Products />}
                  />
                  <Route
                    path="/admin/data_management/products/:slug"
                    element={<Product />}
                  />
                  <Route
                    path="/admin/users_management/admin_users"
                    element={<AdminUsers />}
                  />
                </Routes>
              </Box>
            </DashboardLayout>
          </AppProvider>
        </>
      )}
    </ThemeProvider>
  );
}

export default AdminApp;
