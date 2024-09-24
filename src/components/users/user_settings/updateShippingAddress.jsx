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
import { useLocation, useNavigate } from "react-router-dom";
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

  const [isFormValid, setIsFormValid] = useState(false);
  const [change, setChange] = useState(false);

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
    setChange(true);
  };

  const handleSubmit = () => {
    const userParams = {
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
      API.updateShippingAddress(address.id, userParams)
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
          console.error("Error occurred:", error);
          navigate("/user_account_settings", {
            state: {
              alert: {
                message: "Failed to update shipping address. Please try again.",
                type: "error",
              },
            },
          });
        });
    }
  };
  const location = useLocation();
  const [alert, setAlert] = useState({
    message: location.state?.alert?.message,
    type: location.state?.alert?.type,
  });

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
      aria-labelledby="update-shipping-address-title"
    >
      <Notification alert={alert} setAlert={setAlert} />
      <DialogTitle id="update-shipping-address-title">
        Update Shipping Address
      </DialogTitle>
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

export default UpdateShippingAddress;
