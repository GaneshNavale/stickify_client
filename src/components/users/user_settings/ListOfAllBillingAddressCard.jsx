import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import { ListItem, ListItemText, Grid, Box, IconButton } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as API from "../../../utils/api";
import UpdateBillingAddress from "./UpdateBillingAddress";
import CreateBillingAddress from "./CreateBillingAddress";
import Notification from "../../../utils/notification";

const ListOfAllBillingAddressCard = ({ open, onClose }) => {
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [billingAddresses, setBillingAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    if (open) {
      API.listAllBillingAddress()
        .then((response) => {
          setBillingAddresses(response.data);
        })
        .catch((error) => {
          console.log("Billing address error", error);
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

  const handleCreateClick = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
  };

  const handleAddNewAddress = (newAddress) => {
    setBillingAddresses((prevAddresses) => {
      return [...prevAddresses, newAddress];
    });
  };

  const handleUpdateAddress = (updatedAddress) => {
    setBillingAddresses((prevAddresses) =>
      prevAddresses.map((address) =>
        address.id === updatedAddress.id ? updatedAddress : address
      )
    );
  };

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={onClose}
        aria-labelledby="list-billing-address-title"
        sx={{ "& .MuiDialog-paper": { width: "80%", maxWidth: "700px" } }} // Increase dialog width
      >
        <Notification alert={alert} setAlert={setAlert} />
        <DialogTitle id="list-billing-address-title">
          List of All Billing Addresses
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

        <Divider style={{ margin: "6px 0" }} />
        <DialogContent>
          {billingAddresses.length > 0 ? (
            <Grid container spacing={2}>
              {billingAddresses.map((address, index) => (
                <Grid item xs={12} key={address.id}>
                  <ListItem>
                    <ListItemText
                      primary={address.full_name}
                      secondary={
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            {address.mobile && (
                              <Typography variant="body2" color="textSecondary">
                                {address.mobile}
                                <br />
                              </Typography>
                            )}
                            {address.address_line_1 && (
                              <Typography variant="body2" color="textSecondary">
                                {address.address_line_1}
                                <br />
                              </Typography>
                            )}
                            {address.address_line_2 && (
                              <Typography variant="body2" color="textSecondary">
                                {address.address_line_2}
                                <br />
                              </Typography>
                            )}
                            {address.landmark && (
                              <Typography variant="body2" color="textSecondary">
                                {address.landmark}
                                <br />
                              </Typography>
                            )}
                            {address.city &&
                              address.state &&
                              address.zip_code && (
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  {address.city}, {address.state} -{" "}
                                  {address.zip_code}
                                  <br />
                                </Typography>
                              )}
                          </Typography>
                        </Box>
                      }
                    />
                    <Box sx={{ display: "flex", alignItems: "center" }}>
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
                  </ListItem>
                  {index < billingAddresses.length - 1 && (
                    <Divider style={{ margin: "16px 0" }} />
                  )}
                </Grid>
              ))}
            </Grid>
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
                No billing addresses found.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <Divider style={{ margin: "3px 0" }} />
        <Button
          onClick={handleCreateClick}
          sx={{
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "1.1rem",
            color: "primary.main",
            textDecoration: "none",
            borderRadius: "1px",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          Add New Billing Address
        </Button>

        <Divider style={{ margin: "3px 0" }} />
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <UpdateBillingAddress
        open={isUpdateDialogOpen}
        onClose={handleCloseUpdateDialog}
        address={selectedAddress}
        onUpdateAddress={handleUpdateAddress}
        setAlert={setAlert}
      />

      <CreateBillingAddress
        open={isCreateDialogOpen}
        onClose={handleCloseCreateDialog}
        onAddAddress={handleAddNewAddress}
        setAlert={setAlert}
      />
    </>
  );
};

export default ListOfAllBillingAddressCard;
