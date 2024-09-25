import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Grid } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import * as API from "../../../utils/api";
import Notification from "../../../utils/notification";

const UpdateShippingAddress = ({ open, onClose, address }) => {
  const navigate = useNavigate();
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

  const [errors, setErrors] = useState({});
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    if (address) {
      setShippingAddress({
        full_name: address.full_name || "",
        mobile: address.mobile || "",
        address_line_1: address.address_line_1 || "",
        address_line_2: address.address_line_2 || "",
        landmark: address.landmark || "",
        city: address.city || "",
        state: address.state || "",
        zip_code: address.zip_code || "",
      });
    }
  }, [address]);

  // Handle input change for all fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  // Validation function for specific fields
  const validateField = (fieldName, value) => {
    let fieldErrors = { ...errors };

    switch (fieldName) {
      case "full_name":
        if (!value) {
          fieldErrors.full_name = "Full name is required.";
        } else {
          fieldErrors.full_name = "";
        }
        break;
      case "mobile":
        if (!/^\d{10}$/.test(value)) {
          fieldErrors.mobile = "Mobile number must be 10 digits.";
        } else {
          fieldErrors.mobile = "";
        }
        break;
      case "zip_code":
        if (!/^\d{5,6}$/.test(value)) {
          fieldErrors.zip_code = "Zip code must be 5 or 6 digits.";
        } else {
          fieldErrors.zip_code = "";
        }
        break;
      case "address_line_1":
        if (!value) {
          fieldErrors.address_line_1 = "Address Line 1 is required.";
        } else {
          fieldErrors.address_line_1 = "";
        }
        break;
      case "address_line_2":
        if (!value) {
          fieldErrors.address_line_2 = "Address Line 2 is required.";
        } else {
          fieldErrors.address_line_2 = "";
        }
        break;
      case "city":
        if (!value) {
          fieldErrors.city = "City is required.";
        } else {
          fieldErrors.city = "";
        }
        break;
      case "state":
        if (!value) {
          fieldErrors.state = "State is required.";
        } else {
          fieldErrors.state = "";
        }
        break;
      case "zip_code":
        if (!value) {
          fieldErrors.zip_code = "Zip Code is required.";
        } else if (value.length < 6 && value.length > 6) {
          fieldErrors.zip_code = "Zip Code Should Contain 6 Digits.";
        } else {
          fieldErrors.zip_code = "";
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
    Object.keys(shippingAddress).forEach((key) => {
      const errorsForField = validateField(key, shippingAddress[key]);
      fieldErrors[key] = errorsForField[key] || "";
    });
    return fieldErrors;
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    validateField(name, value);
  };

  // Handle form submission
  const handleSubmit = () => {
    const fieldErrors = validateAllFields();

    if (Object.values(fieldErrors).every((error) => error === "")) {
      const shippingParams = {
        full_name: shippingAddress.full_name,
        mobile: shippingAddress.mobile,
        address_line_1: shippingAddress.address_line_1,
        address_line_2: shippingAddress.address_line_2,
        landmark: shippingAddress.landmark,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zip_code: shippingAddress.zip_code,
      };

      API.updateShippingAddress(address.id, shippingParams)
        .then((response) => {
          console.log("Shipping Address Updated Successfully:", response);
          onClose();
          navigate("/user_account_settings", {
            state: {
              alert: {
                message: "Shipping address updated successfully!",
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
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      aria-labelledby="update-shipping-address-title"
    >
      <DialogTitle id="update-shipping-address-title">
        Update Shipping Address
      </DialogTitle>

      {alert.message && alert.type === "error" && (
        <Notification alert={alert} setAlert={handleAlertClose} />
      )}

      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Full Name *"
              name="full_name"
              size="small"
              fullWidth
              value={shippingAddress.full_name}
              onChange={handleInputChange}
              onBlur={handleBlur}
              error={Boolean(errors.full_name)}
              helperText={errors.full_name}
              margin="dense"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Mobile *"
              name="mobile"
              size="small"
              fullWidth
              value={shippingAddress.mobile}
              onChange={handleInputChange}
              onBlur={handleBlur}
              error={Boolean(errors.mobile)}
              helperText={errors.mobile}
              margin="dense"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Address Line 1 *"
              name="address_line_1"
              size="small"
              fullWidth
              value={shippingAddress.address_line_1}
              onChange={handleInputChange}
              onBlur={handleBlur}
              error={Boolean(errors.address_line_1)}
              helperText={errors.address_line_1}
              margin="dense"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Address Line 2 *"
              name="address_line_2"
              size="small"
              fullWidth
              value={shippingAddress.address_line_2}
              onChange={handleInputChange}
              onBlur={handleBlur}
              error={Boolean(errors.address_line_2)}
              helperText={errors.address_line_2}
              margin="dense"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Landmark"
              name="landmark"
              size="small"
              fullWidth
              value={shippingAddress.landmark}
              onChange={handleInputChange}
              onBlur={handleBlur}
              error={Boolean(errors.landmark)}
              helperText={errors.landmark}
              margin="dense"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="City *"
              name="city"
              size="small"
              fullWidth
              value={shippingAddress.city}
              onChange={handleInputChange}
              onBlur={handleBlur}
              error={Boolean(errors.city)}
              helperText={errors.city}
              margin="dense"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="State *"
              name="state"
              size="small"
              fullWidth
              value={shippingAddress.state}
              onChange={handleInputChange}
              onBlur={handleBlur}
              error={Boolean(errors.state)}
              helperText={errors.state}
              margin="dense"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Zip Code *"
              name="zip_code"
              size="small"
              fullWidth
              value={shippingAddress.zip_code}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  handleInputChange(e);
                }
              }}
              onBlur={handleBlur}
              error={Boolean(errors.zip_code)}
              helperText={errors.zip_code}
              margin="dense"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateShippingAddress;
