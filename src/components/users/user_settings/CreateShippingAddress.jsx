import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import * as API from "../../../utils/api";
import { Grid2 as Grid } from "@mui/material";
import { useLocation } from "react-router-dom";
import Notification from "../../../utils/notification";

const CreateShippingAddress = ({ open, onClose }) => {
  const navigate = useLocation();
  const [shippingAddress, setShippingAddress] = useState({
    full_name: "",
    mobile: "",
    address_line_1: "",
    address_line_2: "",
    landmark: "",
    city: "",
    state: "",
    zip_code: "",
  });

  const [isFormValid, setIsFormValid] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const {
      full_name,
      mobile,
      address_line_1,
      city,
      state,
      zip_code,
    } = shippingAddress;

    const isValid =
      full_name !== "" &&
      mobile !== "" &&
      address_line_1 !== "" &&
      city !== "" &&
      state !== "" &&
      zip_code !== "";

    setIsFormValid(isValid);
  }, [shippingAddress]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const newAddress = {
      full_name: shippingAddress.full_name,
      mobile: shippingAddress.mobile,
      address_line_1: shippingAddress.address_line_1,
      address_line_2: shippingAddress.address_line_2,
      landmark: shippingAddress.landmark,
      city: shippingAddress.city,
      state: shippingAddress.state,
      zip_code: shippingAddress.zip_code,
    };

    if (isFormValid) {
      API.createShippingAddress(newAddress)
        .then((response) => {
          onClose();
          navigate("/user_account_settings", {
            state: {
              alert: {
                message: "Shipping Address Created successfully!",
                type: "success",
              },
            },
          });
        })
        .catch((error) => {
          let errorMessage = "An unknown error occurred";
          if (
            error?.response?.data?.errors &&
            error.response.data.errors.length > 0
          ) {
            errorMessage = error.response.data.errors[0];
          } else if (error?.response?.data?.message) {
            errorMessage = error.response.data.message;
          }
          navigate("/user_account_settings", {
            state: {
              alert: {
                message: errorMessage,
                type: "error",
              },
            },
          });
        });
    }
  };

  const location = useLocation();
  const [alert, setAlert] = useState({ message: "", type: "" });
  useEffect(() => {
    setAlert({
      message: location.state?.alert?.message || "",
      type: location.state?.alert?.type || "",
    });
    const timer = setTimeout(() => {
      handleAlertClose();
    }, 4500); // 4500 ms = 4.5 seconds
    return () => clearTimeout(timer);
  }, [location.state]);

  const handleAlertClose = () => {
    setAlert({ message: "", type: "" });
  };

  useEffect(() => {
    window.history.replaceState({}, "");
  }, []);

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      maxWidth="sm"
      fullWidth
      onClose={onClose}
      aria-labelledby="create-shipping-address-title"
    >
      <DialogTitle id="create-shipping-address-title">
        Create New Shipping Address
      </DialogTitle>

      {alert.message && alert.type === "error" && (
        <Notification alert={alert} setAlert={handleAlertClose} />
      )}

      <DialogContent>
        <Grid container spacing={2} direction="column">
          <Grid item md={12}>
            <TextField
              label="Full Name"
              name="full_name"
              size="small"
              fullWidth
              value={shippingAddress.full_name}
              onChange={handleInputChange}
              required
              margin="dense"
            />
          </Grid>
          <Grid item md={12}>
            <TextField
              label="Mobile"
              name="mobile"
              size="small"
              fullWidth
              value={shippingAddress.mobile}
              onChange={handleInputChange}
              required
              margin="dense"
            />
          </Grid>
          <Grid item md={12}>
            <TextField
              label="Address Line 1"
              name="address_line_1"
              size="small"
              fullWidth
              value={shippingAddress.address_line_1}
              onChange={handleInputChange}
              required
              margin="dense"
            />
          </Grid>
          <Grid item md={12}>
            <TextField
              label="Address Line 2"
              name="address_line_2"
              size="small"
              fullWidth
              value={shippingAddress.address_line_2}
              onChange={handleInputChange}
              margin="dense"
            />
          </Grid>
          <Grid item md={12}>
            <TextField
              label="Landmark"
              name="landmark"
              size="small"
              fullWidth
              value={shippingAddress.landmark}
              onChange={handleInputChange}
              margin="dense"
            />
          </Grid>
          <Grid item md={12}>
            <TextField
              label="City"
              name="city"
              size="small"
              fullWidth
              value={shippingAddress.city}
              onChange={handleInputChange}
              required
              margin="dense"
            />
          </Grid>
          <Grid item md={12}>
            <TextField
              label="State"
              name="state"
              size="small"
              fullWidth
              value={shippingAddress.state}
              onChange={handleInputChange}
              required
              margin="dense"
            />
          </Grid>
          <Grid item md={12}>
            <TextField
              label="Zip Code"
              name="zip_code"
              size="small"
              fullWidth
              value={shippingAddress.zip_code}
              onChange={handleInputChange}
              required
              margin="dense"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary" disabled={!isFormValid}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateShippingAddress;
