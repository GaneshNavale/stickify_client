import SignIn from "./components/users/SignIn";
import SignUp from "./components/users/SignUp";
import { LinkedInCallback } from "react-linkedin-login-oauth2";
import UserAccountSettings from "./pages/UserAccountSettings";
import ResetUserPassword from "./components/users/ResetUserPassword";
import Products from "./pages/Products";
import Tools from "./pages/Tools";
import Deals from "./pages/Deals";
import SampleStickers from "./pages/SampleSticker";

const routes = [
  { path: "/", component: <SampleStickers />, exact: true },
  { path: "/sign_in", component: <SignIn />, exact: true },
  { path: "/sign_up", component: <SignUp />, exact: true },
  { path: "/linkedin", component: <LinkedInCallback />, exact: true },
  { path: "/products", component: <Products />, exact: true },
  { path: "/tools", component: <Tools />, exact: true },
  { path: "/deals", component: <Deals />, exact: true },
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
