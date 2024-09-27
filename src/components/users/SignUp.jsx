import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Link,
  TextField,
  Typography,
  Stack,
  Divider,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import Card from "@mui/material/Card";
import { NavLink } from "react-router-dom";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GoogleIcon from "@mui/icons-material/Google";
import { useLinkedInLoginHook } from "../../hooks/useLinkedInLoginHook";
import { useGoogleLoginHook } from "../../hooks/useGoogleLoginHook";
import { useNavigate } from "react-router-dom";

import * as API from "../../utils/api";
import Notification from "../../utils/notification";
import { useAuth } from "../../hooks/useAuth";

const SignUp = () => {
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const { user: isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    validateField(name, value);
  };

  const validateField = (fieldName, value) => {
    let fieldErrors = { ...errors };

    switch (fieldName) {
      case "firstName":
        fieldErrors.firstName = value ? "" : "First name is required";
        break;
      case "lastName":
        fieldErrors.lastName = value ? "" : "Last name is required";
        break;
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
        } else if (value.length < 6) {
          fieldErrors.password = "Password must be at least 6 characters long";
        } else {
          fieldErrors.password = "";
        }

        // Also check if passwords match when password field is updated
        if (user.confirmPassword && value !== user.confirmPassword) {
          fieldErrors.confirmPassword = "Passwords do not match";
        } else {
          fieldErrors.confirmPassword = "";
        }
        break;
      case "confirmPassword":
        fieldErrors.confirmPassword =
          value === user.password ? "" : "Passwords do not match";
        break;
      default:
        break;
    }

    setErrors(fieldErrors);
    return fieldErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const fieldErrors = validateAllFields();
    setAlert({ message: "", type: "" });
    setErrors(fieldErrors);

    const isFormValid = Object.values(fieldErrors).every(
      (error) => error === ""
    );
    if (isFormValid) {
      handleBackdropOpen();
      const userParams = {
        email: user.email,
        password: user.password,
        password_confirmation: user.confirmPassword,
        name: `${user.firstName} ${user.lastName}`,
        confirm_success_url: process.env.REACT_APP_CONFIRM_SUCCESS_URL,
      };

      API.signUpUser(userParams)
        .then((response) => {
          navigate("/", {
            state: {
              alert: {
                message:
                  "Thank you for registering! Please check your email for a confirmation link. You’ll need to confirm your account before logging in.",
                type: "success",
              },
            },
          });
        })
        .catch((error) => {
          console.log("User Error :", error);
          setAlert({
            message:
              error.response?.data?.errors?.full_messages?.[0] ||
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

  if (isAuthenticated) {
    navigate("/", { replace: true });
  }

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
          "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
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
          "boxShadow":
            "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
          "@media (min-width: 600px)": {
            maxWidth: "500px",
          },
        }}
        variant="outlined"
      >
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
        >
          Sign up
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 2,
          }}
        >
          <FormControl>
            <FormLabel htmlFor="firstname">First Name</FormLabel>
            <TextField
              key="first-name"
              id="firstName"
              name="firstName"
              type="text"
              value={user.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(errors.firstName)}
              helperText={errors.firstName}
              placeholder="Enter your first name"
              fullWidth
              variant="outlined"
              size="small"
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="lastname">Last Name</FormLabel>
            <TextField
              key="last-name"
              id="lastName"
              name="lastName"
              type="text"
              value={user.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(errors.lastName)}
              helperText={errors.lastName}
              placeholder="Enter your last name"
              fullWidth
              variant="outlined"
              size="small"
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              key="email"
              id="email"
              name="email"
              type="email"
              value={user.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(errors.email)}
              helperText={errors.email}
              placeholder="Enter your email"
              fullWidth
              variant="outlined"
              size="small"
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
            <TextField
              key="password"
              id="password"
              name="password"
              type="password"
              value={user.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(errors.password)}
              helperText={errors.password}
              placeholder="Enter your password"
              fullWidth
              variant="outlined"
              size="small"
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="confirm-password">Confirm Password</FormLabel>
            <TextField
              key="confirm-password"
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={user.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(errors.confirmPassword)}
              helperText={errors.confirmPassword}
              placeholder="Confirm your password"
              fullWidth
              variant="outlined"
              size="small"
            />
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Sign Up
          </Button>
          <Typography sx={{ textAlign: "center" }}>
            Already have an account?{" "}
            <span>
              <Link
                as={NavLink}
                to="/sign_in"
                variant="body2"
                sx={{ alignSelf: "center", textDecoration: "none" }}
              >
                Sign in
              </Link>
            </span>
          </Typography>
        </Box>

        <Divider>or</Divider>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Button
            type="button"
            fullWidth
            variant="outlined"
            onClick={() => googleLogin()}
            startIcon={<GoogleIcon />}
          >
            Sign up with Google
          </Button>
          <Button
            type="button"
            fullWidth
            variant="outlined"
            onClick={() => linkedInLogin()}
            startIcon={<LinkedInIcon />}
          >
            Sign up with LinkedIn
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

export default SignUp;
