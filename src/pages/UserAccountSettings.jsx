import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  Grid2 as Grid,
  Avatar,
  Typography,
  ListItemText,
  Divider,
  Button,
  ListItem,
  Chip,
  Box,
} from "@mui/material";
import UpdateUserDetail from "../components/users/user_settings/UpdateUserDetail";
import ListOfAllBillingAddressCard from "../components/users/user_settings/ListOfAllBillingAddressCard";
import ListOfAllShippingAddressCard from "../components/users/user_settings/ListOfAllShippingAddressCard";
import UpdateUserAccountPassword from "../components/users/user_settings/UpdateUserAccountPassword";
import * as API from "../utils/api";
import Notification from "../utils/notification";
import { useLocation } from "react-router-dom";

const UserAccountSettings = () => {
  const { user } = useAuth();

  const [isUserDetailDialogOpen, setIsUserDetailDialogOpen] = useState(false);
  const [isBillingAddressDialogOpen, setIsBillingAddressDialogOpen] =
    useState(false);
  const [isShippingAddressDialogOpen, setIsShippingAddressDialogOpen] =
    useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  const [billingAddress, setBillingAddress] = useState([]);
  const [shippingAddressLength, setShippingAddressLength] = useState(0);
  const [defaultAddress, setDefaultAddress] = useState([]);
  const [dialogClosed, setDialogClosed] = useState(true);

  const location = useLocation();
  const [alert, setAlert] = useState({ message: "", type: "" });
  useEffect(() => {
    setAlert({
      message: location.state?.alert?.message || "",
      type: location.state?.alert?.type || "",
    });
    const timer = setTimeout(() => {
      handleAlertClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [location.state]);

  const handleOpenUserDetailDialog = () => setIsUserDetailDialogOpen(true);
  const handleCloseUserDetailDialog = (event, reason) => {
    if (reason === "backdropClick") return;
    setIsUserDetailDialogOpen(false);
  };

  const handleOpenBillingAddressDialog = () =>
    setIsBillingAddressDialogOpen(true);
  const handleCloseBillingAddressDialog = (event, reason) => {
    if (reason === "backdropClick") return;
    setIsBillingAddressDialogOpen(false);
  };

  const handleOpenShippingAddressDialog = () => {
    setIsShippingAddressDialogOpen(true);
  };
  const handleCloseShippingAddressDialog = (event, reason) => {
    if (reason === "backdropClick") return;
    setIsShippingAddressDialogOpen(false);
    setDialogClosed(true);
  };

  const handleOpenPasswordDialog = () => setIsPasswordDialogOpen(true);
  const handleClosePasswordDialog = (event, reason) => {
    if (reason === "backdropClick") return;
    setIsPasswordDialogOpen(false);
  };

  useEffect(() => {
    API.listAllBillingAddress()
      .then((response) => {
        setBillingAddress(response.data);
      })
      .catch((error) => {
        console.error("Billing address error", error);
      });
  }, []);

  useEffect(() => {
    if (dialogClosed) {
      API.listAllShippingAddress()
        .then((response) => {
          const addresses = response.data;
          setShippingAddressLength(addresses.length);
          const defaultAddress = addresses.find(
            (address) => address.default === true
          );
          setDefaultAddress(defaultAddress || null);
          setDialogClosed(false);
        })
        .catch((error) => {
          console.error("Shipping address error", error);
          setDialogClosed(false);
        });
    }
  }, [dialogClosed]);

  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleAlertClose = () => {
    setAlert({ message: "", type: "" });
  };

  useEffect(() => {
    window.history.replaceState({}, "");
  }, []);

  return (
    <>
      {alert.message && alert.type === "success" && (
        <Notification alert={alert} setAlert={handleAlertClose} />
      )}
      <Grid
        container
        alignItems="center"
        spacing={1}
        sx={{ marginTop: 2, marginBottom: 1 }}
      >
        <Grid item>
          <Avatar
            alt={user.name}
            src={user.avatar_image_url}
            sx={{ width: 50, height: 50 }}
          />
        </Grid>
        <Grid item>
          <ListItemText
            primary={user.name}
            secondary={
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            }
          />
        </Grid>
      </Grid>
      <Divider />
      <Grid
        container
        alignItems="center"
        spacing={1}
        sx={{ marginLeft: 2, marginTop: 1 }}
      >
        <h3>Account Settings</h3>
      </Grid>
      <Divider />

      <Grid container direction="column">
        <Grid item sx={{ xs: 12 }}>
          <ListItem sx={{ py: 0 }}>
            <ListItemText
              primary="Display Name"
              secondary={
                <Typography variant="body2" color="text.secondary">
                  {user.name}
                </Typography>
              }
            />
            <Button
              variant="outlined"
              color="primary"
              onClick={handleOpenUserDetailDialog}
            >
              Edit
            </Button>
          </ListItem>
        </Grid>

        <Grid item sx={{ xs: 12 }}>
          <ListItem sx={{ py: 0 }}>
            <ListItemText
              primary="Email"
              secondary={
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
              }
            />
          </ListItem>
        </Grid>

        {user.bio && (
          <Grid item sx={{ xs: 12 }}>
            <ListItem sx={{ py: 0 }}>
              <ListItemText
                primary="Bio"
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    {user.bio}
                  </Typography>
                }
              />
            </ListItem>
          </Grid>
        )}
      </Grid>

      <UpdateUserDetail
        open={isUserDetailDialogOpen}
        onClose={handleCloseUserDetailDialog}
      />
      <Divider />

      <Grid item>
        <ListItem
          secondaryAction={
            <Button
              variant="outlined"
              color="primary"
              onClick={handleOpenPasswordDialog}
            >
              Edit
            </Button>
          }
        >
          <ListItemText
            primary="Password"
            secondary={
              <Typography variant="body2" color="text.secondary">
                ***************
              </Typography>
            }
          />
        </ListItem>
      </Grid>
      <UpdateUserAccountPassword
        open={isPasswordDialogOpen}
        onClose={handleClosePasswordDialog}
        setAlert={setAlert}
      />
      <Divider />

      {/* Shipping Address Section */}
      <Grid item xs={12}>
        <ListItem
          // secondaryAction places the button in the correct position
          secondaryAction={
            <Button
              variant="outlined"
              color="primary"
              onClick={handleOpenShippingAddressDialog}
            >
              Edit
            </Button>
          }
        >
          {/* Use Box for full control over flex layout */}
          <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
            {/* Primary Title */}
            <Typography variant="subtitle1">Shipping Address</Typography>

            {/* Secondary Content (Address and Chip) */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap", // Makes the content wrap if space is insufficient
                pr: { xs: 2, sm: 4 }, // Adds padding to prevent overlap with the button
              }}
            >
              {defaultAddress && (
                <Typography variant="body2" color="text.secondary">
                  {[
                    defaultAddress.full_name,
                    defaultAddress.address_line_1,
                    defaultAddress.address_line_2,
                    defaultAddress.landmark,
                    defaultAddress.city,
                    defaultAddress.state,
                    defaultAddress.zip_code,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                  <Chip
                    label="default"
                    size="small"
                    variant="outlined"
                    color="primary"
                    sx={{ ml: 0.5 }} // Adjusts margin for smaller screens
                  />
                  <br />
                  {shippingAddressLength + " Addresses"}
                </Typography>
              )}
            </Box>
          </Box>
        </ListItem>
      </Grid>

      <ListOfAllShippingAddressCard
        open={isShippingAddressDialogOpen}
        onClose={handleCloseShippingAddressDialog}
      />
      <Divider />

      <Grid item>
        <ListItem
          secondaryAction={
            <Button
              variant="outlined"
              color="primary"
              onClick={handleOpenBillingAddressDialog}
            >
              Edit
            </Button>
          }
        >
          <ListItemText
            primary="Billing Address"
            secondary={
              <Typography variant="body2" color="text.secondary">
                {billingAddress.length + " Addresses"}
              </Typography>
            }
          />
        </ListItem>
      </Grid>

      <ListOfAllBillingAddressCard
        open={isBillingAddressDialogOpen}
        onClose={handleCloseBillingAddressDialog}
      />
      <Divider />
    </>
  );
};

export default UserAccountSettings;
