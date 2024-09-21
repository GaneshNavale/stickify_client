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
import UpdateBillingAddress from "./UpdateBillingAddress";

const ListOfAllBillingAddressCard = ({ open, onClose }) => {
  const [billingAddresses, setBillingAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    if (open) {
      API.listAllBillingAddress()
        .then((response) => {
          console.log("Billing address detail Response", response);
          setBillingAddresses(response.data);
        })
        .catch((error) => {
          console.log("billing address error", error);
        });
    }
  }, [open]);

  const handleEditClick = (address) => {
    setSelectedAddress(address);
    setIsUpdateDialogOpen(true);
  };

  const handleCloseUpdateDialog = () => {
    setIsUpdateDialogOpen(false);
    setSelectedAddress(null);
  };

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={onClose}
        aria-labelledby="list-billing-address-title"
      >
        <DialogTitle id="list-billing-address-title">
          List of All Billing Addresses
        </DialogTitle>
        <DialogContent>
          {billingAddresses.length > 0 ? (
            <Grid container spacing={2}>
              {billingAddresses.map((address, index) => (
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
                  {index < billingAddresses.length - 1 && (
                    <Divider style={{ margin: "16px 0" }} />
                  )}
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography>No billing addresses found.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <UpdateBillingAddress
        open={isUpdateDialogOpen}
        onClose={handleCloseUpdateDialog}
        address={selectedAddress}
      />
    </>
  );
};

export default ListOfAllBillingAddressCard;
