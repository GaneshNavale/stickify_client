// src/pages/UserAccountSettings.jsx

import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  Grid,
  Avatar,
  Typography,
  ListItemText,
  Divider,
  Button,
  ListItem,
} from "@mui/material";
import UpdateUserDetail from "../components/users/user_settings/UpdateUserDetail";
import ListOfAllBillingAddressCard from "../components/users/user_settings/ListOfAllBillingAddressCard";
import ListOfAllShippingAddressCard from "../components/users/user_settings/ListOfAllShippingAddressCard";
import UpdateUserAccountPassword from "../components/users/user_settings/UpdateUserAccountPassword";
import * as API from "../utils/api";
import { AppBar, Tabs, Tab } from "@mui/material";

const UserAccountSettings = () => {
  const { user } = useAuth();

  const [isUserDetailDialogOpen, setIsUserDetailDialogOpen] = useState(false);
  const [isBillingAddressDialogOpen, setIsBillingAddressDialogOpen] = useState(
    false
  );
  const [
    isShippingAddressDialogOpen,
    setIsShippingAddressDialogOpen,
  ] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  const [billingAddress, setBillingAddress] = useState([]);
  const [shippingAddresses, setShippingAddresses] = useState([]);

  useEffect(() => {
    API.listAllBillingAddress()
      .then((response) => {
        setBillingAddress(response.data);
      })
      .catch((error) => {
        console.log("Billing address error", error);
      });
  }, []);

  useEffect(() => {
    API.listAllShippingAddress()
      .then((response) => {
        setShippingAddresses(response.data);
      })
      .catch((error) => {
        console.log("Shipping address error", error);
      });
  }, []);

  // Dialog handlers
  const handleOpenUserDetailDialog = () => setIsUserDetailDialogOpen(true);
  const handleCloseUserDetailDialog = (event, reason) => {
    if (reason === "backdropClick") {
      return;
    }
    setIsUserDetailDialogOpen(false);
  };

  const handleOpenBillingAddressDialog = () =>
    setIsBillingAddressDialogOpen(true);
  const handleCloseBillingAddressDialog = (event, reason) => {
    if (reason === "backdropClick") {
      return;
    }
    setIsBillingAddressDialogOpen(false);
  };

  const handleOpenShippingAddressDialog = () =>
    setIsShippingAddressDialogOpen(true);
  const handleCloseShippingAddressDialog = (event, reason) => {
    if (reason === "backdropClick") {
      return;
    }
    setIsShippingAddressDialogOpen(false);
  };

  const handleOpenPasswordDialog = () => setIsPasswordDialogOpen(true);
  const handleClosePasswordDialog = (event, reason) => {
    if (reason === "backdropClick") {
      return;
    }
    setIsPasswordDialogOpen(false);
  };

  return (
    <>
      {/* navbar */}

      <AppBar
        position="static"
        color="default"
        sx={{ display: "flex", alignItems: "center" }}
      >
        <Tabs
          // value={value}
          onChange={handleChange}
          centered
          variant="scrollable"
          scrollButtons="auto"
          aria-label="centered tabs"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Summary" />
          <Tab label="Orders" />
          <Tab label="Reorder" />
          <Tab label="Reviews" />
          <Tab label="Artworks" />
          <Tab label="CommissionsNEW" />
          <Tab label="Notifications" />
          <Tab label="Tax Exemptions" />
        </Tabs>
      </AppBar>

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

      {/* User Details */}
      <Grid container>
        <Grid item xs={12}>
          <ListItem>
            <ListItemText
              primary="Display Name"
              secondary={
                <Typography variant="body2" color="text.secondary">
                  {user.email}
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

        <Grid item xs={12}>
          <ListItem>
            <ListItemText
              primary="Bio"
              secondary={
                <Typography variant="body2" color="text.secondary">
                  {bio}
                </Typography>
              }
            />
          </ListItem>
        </Grid>
      </Grid>

      <UpdateUserDetail
        open={isUserDetailDialogOpen}
        onClose={handleCloseUserDetailDialog}
      />
      <Divider />

      {/* Password */}
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
      />
      <Divider />

      {/* Shipping Address */}
      <Grid item>
        <ListItem
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
          <ListItemText
            primary="Shipping Address"
            secondary={
              <Typography variant="body2" color="text.secondary">
                {shippingAddresses.length + " Addresses"}
              </Typography>
            }
          />
        </ListItem>
      </Grid>

      <ListOfAllShippingAddressCard
        open={isShippingAddressDialogOpen}
        onClose={handleCloseShippingAddressDialog}
      />

      <Divider />

      {/* Billing Address */}
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
