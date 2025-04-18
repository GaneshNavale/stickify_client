import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import {
  Grid2 as Grid,
  Box,
  IconButton,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as API from "../utils/api";
import UpdateAddress from "../components/users/user_settings/UpdateAddress";
import CreateAddress from "../components/users/user_settings/CreateAddress";

import Notification from "../utils/notification";

const ListOfAllAddresses = ({
  open,
  type,
  onClose,
  addresses,
  setAddresses,
  setSelectedShippingAddress,
  setSelectedBillingAddress,
  addressId,
}) => {
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [selectedAddressId, setSelectedAddressId] = useState(addressId);

  const handleAddressSelect = (event) => {
    setSelectedAddressId(Number(event.target.value));
  };

  const handleAddressUpdate = (updatedAddress) => {
    setAddresses((prevAddresses) =>
      prevAddresses.map((address) =>
        address.id === updatedAddress.id ? updatedAddress : address
      )
    );
    setIsUpdateDialogOpen(false);
  };
  const handleAddNewAddress = (newAddress) => {
    setAddresses((prevAddresses) => [...prevAddresses, newAddress]);
    setIsCreateDialogOpen(false);
  };

  const handleEditClick = (address) => {
    setSelectedAddress(address);
    setIsUpdateDialogOpen(true);
  };

  const handleCloseUpdateDialog = () => {
    setIsUpdateDialogOpen(false);
    setSelectedAddress(null);
  };

  const handleCreateClick = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
  };

  const handleShippingAddressUpdate = () => {
    const address = addresses.find(
      (address) => address.id === selectedAddressId
    );
    type === "shipping"
      ? setSelectedShippingAddress(address)
      : setSelectedBillingAddress(address);
    onClose();
  };

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={onClose}
        aria-labelledby="list-shipping-address-title"
        sx={{ "& .MuiDialog-paper": { width: "80%", maxWidth: "700px" } }}
      >
        <Notification alert={alert} setAlert={setAlert} />
        <DialogTitle id="list-shipping-address-title">
          List of All Addresses
        </DialogTitle>

        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
        <Divider />
        <DialogContent sx={{ paddingBottom: 0 }}>
          {addresses.length > 0 ? (
            <RadioGroup
              value={selectedAddressId}
              onChange={handleAddressSelect}
            >
              <Grid container direction="column">
                {addresses.map((address, index) => (
                  <Grid item xs={12} key={address.id}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: 1,
                        border: "1px solid #ccc",
                        borderRadius: 2,
                        marginBottom: 2,
                      }}
                    >
                      <FormControlLabel
                        value={address.id}
                        control={
                          <Radio
                          // onChange={() => {
                          //   handleShippingAddressUpdate(address);
                          // }}
                          />
                        }
                        label={
                          <Typography>
                            {address.full_name} - {address.city},{" "}
                            {address.state} ({address.zip_code})
                          </Typography>
                        }
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleEditClick(address)}
                        sx={{ marginLeft: 1 }}
                      >
                        Edit
                      </Button>
                    </Box>
                  </Grid>
                ))}
                <Grid
                  item
                  xs={12}
                  sx={{
                    paddingBottom: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Button
                    onClick={handleShippingAddressUpdate}
                    fullWidth={false}
                    disabled={!selectedAddressId}
                    sx={{
                      textTransform: "none", // Prevents text from being uppercase
                    }}
                  >
                    Use this address
                  </Button>
                  <Typography variant="body2">OR</Typography>
                  <Button
                    onClick={handleCreateClick}
                    fullWidth={false}
                    sx={{
                      textTransform: "none", // Prevents text from being uppercase
                    }}
                  >
                    Create new address
                  </Button>
                </Grid>
              </Grid>
            </RadioGroup>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                margin: 2,
                textAlign: "center",
              }}
            >
              <Typography
                sx={{
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  color: "text.secondary",
                }}
              >
                No shipping addresses found.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <Divider style={{ margin: "3px 0" }} />
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <UpdateAddress
        open={isUpdateDialogOpen}
        onClose={handleCloseUpdateDialog}
        address={selectedAddress}
        onUpdateAddress={handleAddressUpdate}
        setAlert={setAlert}
      />

      <CreateAddress
        open={isCreateDialogOpen}
        onClose={handleCloseCreateDialog}
        onUpdateAddress={handleAddNewAddress}
        setAlert={setAlert}
      />
    </>
  );
};

export default ListOfAllAddresses;
