import Home from "./pages/Home";
import SignIn from "./components/users/SignIn";
import { LinkedInCallback } from "react-linkedin-login-oauth2";

const routes = [
  { path: "/", component: <Home />, exact: true },
  { path: "/sign_in", component: <SignIn />, exact: true },
  { path: "/linkedin", component: <LinkedInCallback />, exact: true },
];

export default routes;
