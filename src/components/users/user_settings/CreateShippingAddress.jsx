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
import { Grid } from "@mui/material";
import Notification from "../../../utils/notification";

const CreateShippingAddress = ({ open, onClose, onUpdateAddress }) => {
  const [alert, setAlert] = useState({ message: "", type: "" });
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
    // Reset form and errors when dialog opens
    setShippingAddress({
      full_name: "",
      mobile: "",
      address_line_1: "",
      address_line_2: "",
      landmark: "",
      city: "",
      state: "",
      zip_code: "",
    });
    setErrors({});
  }, [open]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

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
          fieldErrors.zip_code =
            "Zip code must be a valid 6-digit Indian PIN code.";
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

      API.createShippingAddress(shippingParams)
        .then((response) => {
          console.log("Shipping Address Created Successfully:", response);
          onUpdateAddress(shippingParams);

          setAlert({
            message: "New Address Created Shipping Successfully.",
            type: "success",
          });
          setTimeout(() => {
            setAlert({ message: "", type: "" });
          }, 3000);

          onClose();
        })
        .catch((error) => {
          console.log("Error while creating shipping address:", error);
          setAlert({
            message: "Failed to create shipping address.",
            type: "error",
          });

          setTimeout(() => {
            setAlert({ message: "", type: "" });
          }, 3000);
        });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      aria-labelledby="create-shipping-address-title"
    >
      <DialogTitle id="create-shipping-address-title">
        Create New Shipping Address
      </DialogTitle>

      <Notification alert={alert} setAlert={setAlert} />

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
              label="Address Line 2"
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
              onChange={handleInputChange}
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
          Create Address
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateShippingAddress;
