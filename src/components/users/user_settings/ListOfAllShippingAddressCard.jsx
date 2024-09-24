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

const ListOfAllShippingAddressCard = ({ open, onClose }) => {
  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [selectedShippingAddress, setSelectedShippingAddress] = useState(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

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
    setIsUpdateDialogOpen(true);
    onClose();
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
        sx={{ "& .MuiDialog-paper": { width: "80%", maxWidth: "600px" } }} // Increase dialog width
      >
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
            color: theme.palette.grey[500],
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
                          {" "}
                          {/* Add margin bottom for spacing */}
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
                        </Box>
                      }
                    />
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Button
                        variant="text"
                        color="primary"
                        onClick={() => handleEditClick(address)}
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
              <Link
                onClick={handleCreateClick}
                sx={{
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  color: "primary.main",
                  textDecoration: "none",
                  mt: 2,
                  padding: "8px 16px",
                  borderRadius: "4px",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                  },
                }}
              >
                Add New Shipping Address
              </Link>
            </Box>
          )}
        </DialogContent>
        <Divider style={{ margin: "6px 0" }} />
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <UpdateShippingAddress
        open={isUpdateDialogOpen}
        onClose={handleCloseUpdateDialog}
        address={selectedShippingAddress}
      />
      <CreateShippingAddress
        open={isCreateDialogOpen}
        onClose={handleCloseCreateDialog}
      />
    </>
  );
};

export default ListOfAllShippingAddressCard;
