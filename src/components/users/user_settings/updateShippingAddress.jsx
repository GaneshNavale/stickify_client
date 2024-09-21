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

const UpdateShippingAddress = ({ open, onClose, address }) => {
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
    const { full_name, mobile, address_line_1, city, state, zip_code } =
      shippingAddress;

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
    setChange(true); // Set to true when any field is changed
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
      API.updateShippingAddress(address.id, userParams) // Use correct API function
        .then((response) => {
          console.log("Shipping Address Updated Successfully:", response);
          onClose(); // Close the dialog after successful update
        })
        .catch((error) => {
          console.error("Error occurred:", error);
        });
    }
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={onClose}
      aria-labelledby="update-shipping-address-title"
    >
      <DialogTitle id="update-shipping-address-title">
        Update Shipping Address
      </DialogTitle>
      <DialogContent>
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
        <TextField
          label="Address Line 2"
          name="address_line_2"
          size="small"
          fullWidth
          value={shippingAddress.address_line_2}
          onChange={handleInputChange}
          margin="dense"
        />
        <TextField
          label="Landmark"
          name="landmark"
          size="small"
          fullWidth
          value={shippingAddress.landmark}
          onChange={handleInputChange}
          margin="dense"
        />
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
