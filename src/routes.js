import Home from "./pages/Home";
import SignIn from "./components/users/SignIn";
import SignUp from "./components/users/SignUp";
import { LinkedInCallback } from "react-linkedin-login-oauth2";
import AdminDashboard from "./Admin/AdminDashboard";
import AdminSignIn from "./Admin/AdminSignIn";
import UserAccountSettings from "./pages/UserAccountSettings";

const routes = [
  { path: "/", component: <Home />, exact: true },
  { path: "/sign_in", component: <SignIn />, exact: true },
  { path: "/sign_up", component: <SignUp />, exact: true },
  { path: "/linkedin", component: <LinkedInCallback />, exact: true },
  { path: "/user_account_settings", component: <UserAccountSettings />, exact: true },

  // Admin Route
  { path: "/admin", component: <AdminDashboard />, exact: true },
  { path: "/admin_sign_in", component: <AdminSignIn />, exact: true },
];

export default routes;
