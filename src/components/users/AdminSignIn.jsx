import React, { useState, useEffect } from "react";
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
  Backdrop,
  CircularProgress,
  Container,
} from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";
import Card from "@mui/material/Card";
import ForgotPassword from "./ForgotPassword";
import * as AdminAPI from "../../utils/adminApi";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import Notification from "../../utils/notification";

const AdminSignIn = () => {
  const { login } = useAdminAuth();
  const location = useLocation();
  const [alert, setAlert] = useState({
    message: location.state?.alert?.message,
    type: location.state?.alert?.type,
  });

  useEffect(() => {
    // removing persisted state to remove alert on page refresh
    window.history.replaceState({}, "");
  }, []);

  const [open, setOpen] = useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(false);

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleBackdropClose = () => setOpenBackdrop(false);
  const handleBackdropOpen = () => setOpenBackdrop(true);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleBlur = (event) => {
    const { name, value } = event.target;
    validateField(name, value);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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

  const validateAllFields = () => {
    const fieldErrors = {};

    Object.keys(user).forEach((key) => {
      const errorsForField = validateField(key, user[key]);
      fieldErrors[key] = errorsForField[key] || "";
    });

    return fieldErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const fieldErrors = validateAllFields();

    setErrors(fieldErrors);

    const isFormValid = Object.values(fieldErrors).every((error) => !error);

    if (isFormValid) {
      handleBackdropOpen();
      setAlert({ message: "", type: "" });

      try {
        const userParams = {
          email: user.email,
          password: user.password,
        };
        const response = await AdminAPI.adminSignIn(userParams);
        const userInfo = {
          token: response.headers?.authorization,
          ...response.data?.data,
        };
        login(userInfo);
      } catch (error) {
        const message =
          error.response?.data?.errors?.[0] ||
          "Something went wrong, please try again";
        setAlert({ message, type: "error" });
      } finally {
        handleBackdropClose();
      }
    }
  };

  return (
    <Container>
      <Stack
        direction="column"
        justifyContent="space-between"
        sx={{
          height: "100%",
          paddingTop: 20,
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
            "width": "85%",
            "padding": 5,
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
          {/* <SitemarkIcon />  */}
          {/* Todo: Add Logo */}
          <Typography
            component="h1"
            variant="h4"
            sx={{
              textAlign: "center",
              width: "100%",
              fontSize: "clamp(2rem, 10vw, 2.15rem)",
            }}
          >
            Admin Login
          </Typography>
          <ForgotPassword
            open={open}
            handleClose={handleClose}
            setAlert={setAlert}
            isAdmin
          />
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
          </Box>
        </Card>
        <Backdrop
          sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
          open={openBackdrop}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Stack>
    </Container>
  );
};

export default AdminSignIn;
