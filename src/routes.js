import Home from "./pages/Home";
import SignIn from "./components/users/SignIn";
import SignUp from "./components/users/SignUp";
import { LinkedInCallback } from "react-linkedin-login-oauth2";
import UserAccountSettings from "./pages/UserAccountSettings";
import ResetUserPassword from "./components/users/ResetUserPassword";
import AboutUs from "./pages/AboutUs";
import ProductListingPage from "./pages/Product/ProductListingPage";

const routes = [
  { path: "/", component: <Home />, exact: true },
  { path: "/sign_in", component: <SignIn />, exact: true },
  { path: "/sign_up", component: <SignUp />, exact: true },
  { path: "/linkedin", component: <LinkedInCallback />, exact: true },
  {
    path: "/products/product_listing",
    component: <ProductListingPage />,
    exact: true,
  },
  { path: "/about", component: <AboutUs />, exact: true },
  {
    path: "/user_account_settings",
    component: <UserAccountSettings />,
    exact: true,
    isProtected: true,
  },
  {
    path: "/reset_user_password",
    component: <ResetUserPassword />,
    exact: true,
  },
];

export default routes;
