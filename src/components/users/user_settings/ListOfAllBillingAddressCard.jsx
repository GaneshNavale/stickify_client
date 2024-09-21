import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { ListItem, ListItemText, Grid, Box, Link } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as API from "../../../utils/api";
import UpdateBillingAddress from "./UpdateBillingAddress";
import CreateBillingAddress from "./CreateBillingAddress";

const ListOfAllBillingAddressCard = ({ open, onClose }) => {
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
        aria-labelledby="list-billing-address-title"
        sx={{ "& .MuiDialog-paper": { width: "80%", maxWidth: "600px" } }} // Increase dialog width
      >
        <DialogTitle id="list-billing-address-title">
          List of All Billing Addresses
        </DialogTitle>
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
              <Link
                onClick={handleCreateClick}
                sx={{
                  cursor: "pointer",
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
                Add New Billing Address
              </Link>
            </Box>
          )}
        </DialogContent>
        <Divider style={{ margin: "6px 0" }} />
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <UpdateBillingAddress
        open={isUpdateDialogOpen}
        onClose={handleCloseUpdateDialog}
        address={selectedAddress}
      />
      <CreateBillingAddress
        open={isCreateDialogOpen}
        onClose={handleCloseCreateDialog}
      />
    </>
  );
};

export default ListOfAllBillingAddressCard;
