import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  TextField,
  Typography,
  Stack,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import Card from "@mui/material/Card";
import { useNavigate, useLocation } from "react-router-dom";
import * as API from "../../utils/api";
import Notification from "../../utils/notification";

const ResetUserPassword = (props) => {
  const [user, setUser] = useState("");
  const [errors, setErrors] = useState("");
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [openBackdrop, setOpenBackdrop] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const accessToken = queryParams.get("access-token");
  const client = queryParams.get("client");
  const expiry = queryParams.get("expiry");
  const resetPassword = queryParams.get("reset_password");
  const uid = queryParams.get("uid");

  const handleSubmit = (event) => {
    event.preventDefault();

    const fieldErrors = validateAllFields();
    setErrors(fieldErrors);
    setAlert({ message: "", type: "" });

    const isFormValid = Object.values(fieldErrors).every(
      (error) => error === ""
    );

    if (isFormValid) {
      setOpenBackdrop(true);
      API.resetUserPassword(
        {
          password: user.password,
          password_confirmation: user.confirmPassword,
        },
        {
          "access-token": accessToken,
          client,
          expiry,
          "reset_password": resetPassword,
          uid,
        }
      )
        .then((response) => {
          navigate("/sign_in", {
            replace: true,
            state: {
              alert: {
                message: "Your password has been successfully updated.",
                type: "success",
              },
            },
          });
        })
        .catch((error) => {
          console.log("User Error :", error.response);
          setAlert({
            message:
              error.response?.data?.errors?.[0] ||
              "Something went wrong, please try again",
            type: "error",
          });
        })
        .finally(() => {
          setOpenBackdrop(false);
        });
    }
  };

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
        if (!value) {
          fieldErrors.confirmPassword = "Password is required";
        } else {
          fieldErrors.confirmPassword =
            value === user.password ? "" : "Passwords do not match";
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
          Reset Password
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
            <FormLabel htmlFor="password">Password</FormLabel>
            <TextField
              key="password"
              id="password"
              name="password"
              type="password"
              value={user.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.password}
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
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              placeholder="Confirm your password"
              fullWidth
              variant="outlined"
              size="small"
            />
          </FormControl>
          <Button type="submit" fullWidth variant="contained">
            Reset Password
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

export default ResetUserPassword;
