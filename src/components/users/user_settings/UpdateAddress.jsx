import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Grid, IconButton } from "@mui/material";
import * as API from "../../../utils/api";

const UpdateAddress = ({
  open,
  onClose,
  address,
  onUpdateAddress,
  setAlert,
}) => {
  const [userAddress, setAddress] = useState({
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
      setAddress({
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

  // Reset alert when dialog is closed/opened
  useEffect(() => {
    if (open) {
      setAlert({ message: "", type: "" });
    }
  }, [open]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
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
        if (!/^\d{6}$/.test(value)) {
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
    Object.keys(userAddress).forEach((key) => {
      const errorsForField = validateField(key, userAddress[key]);
      fieldErrors[key] = errorsForField[key] || "";
    });
    return fieldErrors;
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    validateField(name, value);
  };

  const handleSubmit = () => {
    const fieldErrors = validateAllFields();
    setErrors(fieldErrors);
    if (Object.values(fieldErrors).every((error) => error === "")) {
      const addressParams = {
        full_name: userAddress.full_name,
        mobile: userAddress.mobile,
        address_line_1: userAddress.address_line_1,
        address_line_2: userAddress.address_line_2,
        landmark: userAddress.landmark,
        city: userAddress.city,
        state: userAddress.state,
        zip_code: userAddress.zip_code,
      };

      API.updateAddress(address.id, addressParams)
        .then((response) => {
          onUpdateAddress({
            ...response.data.address,
            id: address.id,
          });

          setAlert({
            message: "Address Updated Successfully.",
            type: "success",
          });

          onClose();
        })
        .catch((error) => {
          console.error("Error while updating address:", error);

          setAlert({
            message: "Error updating address. Please try again.",
            type: "error",
          });
        });
    } else {
      setAlert({
        message: "Please fill all required fields correctly.",
        type: "error",
      });
    }
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      aria-labelledby="update-address-title"
    >
      <DialogTitle id="update-address-title">Update Address</DialogTitle>

      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
        })}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Full Name *"
              name="full_name"
              size="small"
              fullWidth
              value={userAddress.full_name}
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
              value={userAddress.mobile}
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
              value={userAddress.address_line_1}
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
              value={userAddress.address_line_2}
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
              value={userAddress.landmark}
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
              value={userAddress.city}
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
              value={userAddress.state}
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
              value={userAddress.zip_code}
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
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateAddress;
