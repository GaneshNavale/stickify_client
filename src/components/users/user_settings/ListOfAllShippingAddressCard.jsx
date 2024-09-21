import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { ListItem, ListItemText, Grid, Box } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as API from "../../../utils/api";
import UpdateShippingAddress from "./updateShippingAddress";

const ListOfAllShippingAddressCard = ({ open, onClose }) => {
  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [selectedShippingAddress, setSelectedShippingAddress] = useState(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    if (open) {
      API.listAllShippingAddress()
        .then((response) => {
          console.log("Shipping address detail Response", response);
          setShippingAddresses(response.data);
        })
        .catch((error) => {
          console.log("Shipping address error", error);
        });
    }
  }, [open]);

  const handleEditClick = (address) => {
    setSelectedShippingAddress(address);
    console.log("Selected Shipping Address = ", address);
    setIsUpdateDialogOpen(true);
  };

  const handleCloseUpdateDialog = () => {
    setIsUpdateDialogOpen(false);
    setSelectedShippingAddress(null);
  };

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={onClose}
        aria-labelledby="list-shipping-address-title"
      >
        <DialogTitle id="list-shipping-address-title">
          List of All Shipping Addresses
        </DialogTitle>
        <DialogContent>
          {shippingAddresses.length > 0 ? (
            <Grid container spacing={2}>
              {shippingAddresses.map((address, index) => (
                <Grid item xs={12} key={address.id}>
                  <ListItem
                    secondaryAction={
                      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button
                          variant="text"
                          color="primary"
                          onClick={() => handleEditClick(address)}
                        >
                          Edit
                        </Button>
                      </Box>
                    }
                  >
                    <ListItemText
                      primary={address.full_name}
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {address.mobile}
                          <br />
                          {address.address_line_1}
                          <br />
                          {address.address_line_2 &&
                            `${address.address_line_2}`}
                          <br />
                          {address.landmark && `${address.landmark}`}
                          <br />
                          {address.city}, {address.state} - {address.zip_code}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < shippingAddresses.length - 1 && (
                    <Divider style={{ margin: "16px 0" }} />
                  )}
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography>No shipping addresses found.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <UpdateShippingAddress
        open={isUpdateDialogOpen}
        onClose={handleCloseUpdateDialog}
        address={selectedShippingAddress} // Pass selected address here
      />
    </>
  );
};

export default ListOfAllShippingAddressCard;
