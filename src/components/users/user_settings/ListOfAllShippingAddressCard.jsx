import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { ListItem, ListItemText, Grid, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as API from "../../../utils/api";
import UpdateShippingAddress from "./updateShippingAddress";
import CreateShippingAddress from "./CreateShippingAddress";
import { Link } from "react-router-dom";
import Notification from "../../../utils/notification";

const ListOfAllShippingAddressCard = ({ open, onClose }) => {
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [selectedShippingAddress, setSelectedShippingAddress] = useState(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    if (open) {
      fetchShippingAddresses();
    }
  }, [open]);

  const fetchShippingAddresses = () => {
    API.listAllShippingAddress()
      .then((response) => {
        setShippingAddresses(response.data);
      })
      .catch((error) => {
        console.log("Shipping address error", error);
      });
  };

  const handleAddressUpdate = (updatedAddress) => {
    setShippingAddresses((prevAddresses) =>
      prevAddresses.map((address) =>
        address.id === updatedAddress.id ? updatedAddress : address
      )
    );
    setIsUpdateDialogOpen(false);
  };

  const handleAddNewAddress = (newAddress) => {
    setShippingAddresses((prevAddresses) => [...prevAddresses, newAddress]);
    setIsCreateDialogOpen(false);
  };

  const handleMakeDefaultClick = (id) => {
    API.makeDefaulsShippingAddress(id)
      .then((response) => {
        setShippingAddresses((prevAddresses) =>
          prevAddresses.map((address) =>
            address.id === id
              ? { ...address, default: true }
              : { ...address, default: false }
          )
        );
        setAlert({
          message: "Default Address Changed Successfully.",
          type: "success",
        });
      })
      .catch((error) => {
        console.error("Display Error :", error);
        setAlert({
          message: "Failed to change default address.",
          type: "error",
        });
      });
  };

  const handleEditClick = (address) => {
    setSelectedShippingAddress(address);
    setIsUpdateDialogOpen(true);
  };

  const handleCloseUpdateDialog = () => {
    setIsUpdateDialogOpen(false);
    setSelectedShippingAddress(null);
  };

  const handleCreateClick = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
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
          List of All Shipping Addresses
        </DialogTitle>

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
        <Divider style={{ margin: "6px 0" }} />
        <DialogContent>
          {shippingAddresses.length > 0 ? (
            <Grid container spacing={2}>
              {shippingAddresses.map((address, index) => (
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
                      {address.default ? (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            disabled={true}
                          >
                            Default
                          </Button>
                        </Box>
                      ) : (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            onClick={() => handleMakeDefaultClick(address.id)}
                          >
                            Make Default
                          </Button>
                        </Box>
                      )}
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
                  {index < shippingAddresses.length - 1 && (
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
                No shipping addresses found.
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
          Add New Shipping Address
        </Button>

        <Divider style={{ margin: "3px 0" }} />
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <UpdateShippingAddress
        open={isUpdateDialogOpen}
        onClose={handleCloseUpdateDialog}
        address={selectedShippingAddress}
        onUpdateAddress={handleAddressUpdate}
        setAlert={setAlert}
      />

      <CreateShippingAddress
        open={isCreateDialogOpen}
        onClose={handleCloseCreateDialog}
        onUpdateAddress={handleAddNewAddress}
        setAlert={setAlert}
      />
    </>
  );
};

export default ListOfAllShippingAddressCard;
