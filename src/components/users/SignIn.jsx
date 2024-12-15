import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Link,
  TextField,
  Typography,
  Stack,
  Divider,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import Card from "@mui/material/Card";
import ForgotPassword from "./ForgotPassword";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GoogleIcon from "@mui/icons-material/Google";
import { useLinkedInLoginHook } from "../../hooks/useLinkedInLoginHook";
import { useGoogleLoginHook } from "../../hooks/useGoogleLoginHook";
import { useNavigate, useLocation } from "react-router-dom";
import * as API from "../../utils/api";
import { useAuth } from "../../hooks/useAuth";
import Notification from "../../utils/notification";

const SignIn = () => {
  const { user: isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const location = useLocation();

  const [alert, setAlert] = useState({
    message: location.state?.alert?.message,
    type: location.state?.alert?.type,
  });
  const [open, setOpen] = useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const { login } = useAuth();

  const linkedInRedirectUri = `${window.location.origin}/linkedin`;
  const googleRedirectUri = `${window.location.origin}`;

  const handleBackdropClose = () => setOpenBackdrop(false);
  const handleBackdropOpen = () => setOpenBackdrop(true);

  const handleSuccess = (platform) => (data) => {
    console.log(`${platform} login successful: `, data);
    navigate("/", { replace: true });
  };

  const handleError = (platform) => (error) => {
    console.error(`${platform} login failed: `, error);
  };

  const { googleLogin } = useGoogleLoginHook(
    googleRedirectUri,
    handleBackdropClose,
    handleBackdropOpen,
    handleSuccess("Google"),
    handleError("Google")
  );

  const { linkedInLogin } = useLinkedInLoginHook(
    linkedInRedirectUri,
    handleBackdropClose,
    handleBackdropOpen,
    handleSuccess("LinkedIn"),
    handleError("LinkedIn")
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const fieldErrors = validateAllFields();
    setErrors(fieldErrors);

    const isFormValid = Object.values(fieldErrors).every(
      (error) => error === ""
    );

    if (isFormValid) {
      handleBackdropOpen();
      const userParams = {
        email: user.email,
        password: user.password,
      };

      API.signInUser(userParams)
        .then((response) => {
          const userInfo = {
            token: response.headers?.authorization,
            ...response.data?.data,
          };
          login(userInfo);
        })
        .catch((error) => {
          console.log("User Error :", error);
          setAlert({
            message:
              error.response?.data?.errors?.[0] ||
              "Something went wrong, please try again",
            type: "error",
          });
        })
        .finally(() => {
          handleBackdropClose();
        });
    }
  };

  const validateAllFields = () => {
    const fieldErrors = {};

    Object.keys(user).forEach((key) => {
      const errorsForField = validateField(key, user[key]);
      fieldErrors[key] = errorsForField[key] || "";
    });

    return fieldErrors;
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    validateField(name, value);
  };

  const validateField = (fieldName, value) => {
    let fieldErrors = { ...errors };

    switch (fieldName) {
      case "email":
        if (!value) {
          fieldErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          fieldErrors.email = "Email is not valid";
        } else {
          fieldErrors.email = "";
        }
        break;
      case "password":
        if (!value) {
          fieldErrors.password = "Password is required";
        } else {
          fieldErrors.password = "";
        }
        break;
      default:
        break;
    }

    setErrors(fieldErrors);
    return fieldErrors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <Stack
      direction="column"
      justifyContent="space-between"
      sx={{
        height: "100%",
        paddingTop: 3,
        paddingLeft: 3,
        paddingRight: 3,
        backgroundImage:
          "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 98%), hsl(0, 0%, 200%))",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Notification alert={alert} setAlert={setAlert} />
      <Card
        sx={{
          "display": "flex",
          "flexDirection": "column",
          "alignSelf": "center",
          "width": "100%",
          "padding": 4,
          "gap": 2,
          "margin": "auto",
          "borderRadius": "2%",
          "boxShadow":
            "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
          "@media (min-width: 600px)": {
            maxWidth: "500px",
          },
        }}
        variant="outlined"
      >
        {/* <SitemarkIcon />  */}
        {/* Todo: Add Logo */}
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
        >
          Sign in
        </Typography>
        <ForgotPassword open={open} handleClose={handleClose} />
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 2,
          }}
        >
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              error={!!errors.email}
              helperText={errors.email}
              id="email"
              type="email"
              name="email"
              value={user.email}
              placeholder="your@email.com"
              autoComplete="email"
              required
              fullWidth
              variant="outlined"
              color={errors.email ? "error" : "primary"}
              size="small"
              onBlur={handleBlur}
              onChange={handleChange}
              sx={{ ariaLabel: "email" }}
            />
          </FormControl>
          <FormControl>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Link
                as={NavLink}
                component="button"
                onClick={handleClickOpen}
                variant="body2"
                sx={{ alignSelf: "baseline", textDecoration: "none" }}
              >
                Forgot your password?
              </Link>
            </Box>
            <TextField
              error={!!errors.password}
              helperText={errors.password}
              name="password"
              placeholder="••••••"
              type="password"
              id="password"
              autoComplete="current-password"
              required
              fullWidth
              variant="outlined"
              size="small"
              color={errors.password ? "error" : "primary"}
              onBlur={handleBlur}
              value={user.password}
              onChange={handleChange}
            />
          </FormControl>
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button type="submit" fullWidth variant="contained">
            Sign in
          </Button>
          <Typography sx={{ textAlign: "center" }}>
            Don&apos;t have an account?{" "}
            <span>
              <Link
                as={NavLink}
                to="/sign_up"
                variant="body2"
                sx={{ alignSelf: "center", textDecoration: "none" }}
              >
                Sign up
              </Link>
            </span>
          </Typography>
        </Box>
        <Divider>or</Divider>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Button
            type="submit"
            fullWidth
            variant="outlined"
            onClick={() => googleLogin()}
            startIcon={<GoogleIcon />}
          >
            Sign in with Google
          </Button>
          <Button
            type="submit"
            fullWidth
            variant="outlined"
            onClick={() => linkedInLogin()}
            startIcon={<LinkedInIcon />}
          >
            Sign in with LinkedIn
          </Button>
        </Box>
      </Card>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={openBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Stack>
  );
};

export default SignIn;
