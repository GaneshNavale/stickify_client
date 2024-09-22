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
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";

const UpdateBillingAddress = ({ open, onClose, address }) => {
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
    if (address) {
      setBillingAddress({
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
      API.updateBillingAddress(address.id, userParams)
        .then((response) => {
          console.log("Billing Address Updated Successfully:", response);
        })
        .catch((error) => {
          console.error("Error occurred:", error);
        });
      onClose();
    }
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={onClose}
      aria-labelledby="update-billing-address-title"
    >
      <DialogTitle id="update-billing-address-title">
        Update Billing Address
      </DialogTitle>

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
        <TextField
          label="Address Line 2"
          name="address_line_2"
          size="small"
          fullWidth
          value={billingAddress.address_line_2}
          onChange={handleInputChange}
          margin="dense"
        />
        <TextField
          label="Landmark"
          name="landmark"
          size="small"
          fullWidth
          value={billingAddress.landmark}
          onChange={handleInputChange}
          margin="dense"
        />
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

export default UpdateBillingAddress;
