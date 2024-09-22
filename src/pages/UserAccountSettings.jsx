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
import { AppBar, Tabs, Tab, Box } from "@mui/material";

const UserAccountSettings = () => {
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");

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

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Fetch user details
  useEffect(() => {
    API.getUserDetail(user.id)
      .then((response) => {
        setBio(response.data.user.bio);
        setEmail(response.data.user.email);
        setName(response.data.user.name);
      })
      .catch((error) => {
        console.log("User detail error", error);
      });
  }, [user.id]);

  // Fetch billing addresses
  useEffect(() => {
    API.listAllBillingAddress()
      .then((response) => {
        setBillingAddress(response.data);
      })
      .catch((error) => {
        console.log("Billing address error", error);
      });
  }, []);

  // Fetch shipping addresses
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
  const handleCloseUserDetailDialog = () => setIsUserDetailDialogOpen(false);

  const handleOpenBillingAddressDialog = () =>
    setIsBillingAddressDialogOpen(true);
  const handleCloseBillingAddressDialog = () =>
    setIsBillingAddressDialogOpen(false);

  const handleOpenShippingAddressDialog = () =>
    setIsShippingAddressDialogOpen(true);
  const handleCloseShippingAddressDialog = () =>
    setIsShippingAddressDialogOpen(false);

  const handleOpenPasswordDialog = () => setIsPasswordDialogOpen(true);
  const handleClosePasswordDialog = () => setIsPasswordDialogOpen(false);

  return (
    <>
      {/* navbar */}

      <AppBar
        position="static"
        color="default"
        sx={{ display: "flex", alignItems: "center" }}
      >
        <Tabs
          value={value}
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
            primary={name}
            secondary={
              <Typography variant="body2" color="text.secondary">
                {email}
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
                  {name}
                </Typography>
              }
            />
            <Button
              variant="text"
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
              primary="Display Email"
              secondary={
                <Typography variant="body2" color="text.secondary">
                  {email}
                </Typography>
              }
            />
          </ListItem>
        </Grid>

        <Grid item xs={12}>
          <ListItem>
            <ListItemText
              primary="Display Bio"
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
              variant="text"
              color="primary"
              onClick={handleOpenPasswordDialog}
            >
              Reset
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
              variant="text"
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
              variant="text"
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

      {/* Payment Method */}
      <Grid item>
        <ListItem
          secondaryAction={
            <Button variant="text" color="primary">
              Edit
            </Button>
          }
        >
          <ListItemText
            primary="Payment Method"
            secondary={
              <Typography variant="body2" color="text.secondary">
                **** **** **** 1234
              </Typography>
            }
          />
        </ListItem>
      </Grid>
      {/* <UpdateShippingAddress
        open={isShippingAddressDialogOpen}
        onClose={handleCloseShippingAddressDialog}
      /> */}
    </>
  );
};

export default UserAccountSettings;
