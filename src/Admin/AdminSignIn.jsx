import React, { useState } from "react";
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
// import ForgotPassword from "./ForgotPassword";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GoogleIcon from "@mui/icons-material/Google";
// import { useGoogleLoginHook } from "../../hooks/useGoogleLoginHook";
import { useNavigate } from "react-router-dom";
import * as API from "../utils/api";

const AdminSignIn = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [open, setOpen] = useState(false);
  const [formIsValid, setFormIsValid] = useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(false);

  const linkedInRedirectUri = `${window.location.origin}/linkedin`;
  const googleRedirectUri = `${window.location.origin}`;
  const navigate = useNavigate();

  const handleBackdropClose = () => setOpenBackdrop(false);
  const handleBackdropOpen = () => setOpenBackdrop(true);

  const handleSuccess = (platform) => (data) => {
    console.log(`${platform} login successful: `, data);
    navigate("/", { replace: true });
  };

  const handleError = (platform) => (error) => {
    console.error(`${platform} login failed: `, error);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (formIsValid) {
      console.log("Form submitted", user);
      // Handle Submit Logic......................................
      const userParams = {
        email: user.email,
        password: user.password,
      };

      API.adminLogin(userParams).then((response) => {
        console.log("Successfull Login", response);
      });
    }
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
    checkFormValidity(fieldErrors);
  };

  const checkFormValidity = (fieldErrors) => {
    const isValid =
      Object.values(fieldErrors).every((error) => error === "") &&
      Object.values(user).every((val) => val !== "");
    setFormIsValid(isValid);
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
        paddingTop: 10,
        paddingLeft: 3,
        paddingRight: 3,
        backgroundImage:
          "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          alignSelf: "center",
          width: "100%",
          padding: 4,
          gap: 2,
          margin: "auto",
          boxShadow:
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
          Admin Sign in
        </Typography>
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

export default AdminSignIn;
