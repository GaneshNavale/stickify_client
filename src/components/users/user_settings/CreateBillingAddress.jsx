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
import { Grid2 as Grid, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useLocation } from "react-router-dom";
import Notification from "../../../utils/notification";

const CreateBillingAddress = ({ open, onClose }) => {
  const navigate = useLocation();
  const [billingAddress, setBillingAddress] = useState({
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
  const [change, setChange] = useState(false);

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
    } = billingAddress;

    const isValid =
      full_name !== "" &&
      mobile !== "" &&
      address_line_1 !== "" &&
      city !== "" &&
      state !== "" &&
      zip_code !== "";

    setIsFormValid(isValid);
  }, [billingAddress]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillingAddress((prev) => ({ ...prev, [name]: value }));
    setChange(true); // Set to true when any field is changed
  };

  const handleSubmit = () => {
    const userParams = {
      full_name: billingAddress.full_name,
      mobile: billingAddress.mobile,
      address_line_1: billingAddress.address_line_1,
      address_line_2: billingAddress.address_line_2,
      landmark: billingAddress.landmark,
      city: billingAddress.city,
      state: billingAddress.state,
      zip_code: billingAddress.zip_code,
    };

    if (isFormValid) {
      API.createBillingAddress(userParams)
        .then((response) => {
          onClose();
          navigate("/user_account_settings", {
            state: {
              alert: {
                message: "Billing address Created successfully!",
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
      onClose();
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
      aria-labelledby="create-billing-address-title"
    >
      <DialogTitle id="create-billing-address-title">
        Create New Billing Address
      </DialogTitle>

      {alert.message && alert.type === "error" && (
        <Notification alert={alert} setAlert={handleAlertClose} />
      )}

      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <Grid container spacing={2} direction="column">
          <Grid item md={12}>
            <TextField
              label="Full Name"
              name="full_name"
              size="small"
              fullWidth
              value={billingAddress.full_name}
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
              value={billingAddress.mobile}
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
              value={billingAddress.address_line_1}
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
              value={billingAddress.address_line_2}
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
              value={billingAddress.landmark}
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
              value={billingAddress.city}
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
              value={billingAddress.state}
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
              value={billingAddress.zip_code}
              onChange={handleInputChange}
              required
              margin="dense"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary" disabled={!change}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateBillingAddress;
