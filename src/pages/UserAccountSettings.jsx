import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Grid, Avatar, Typography, ListItemText, Divider } from "@mui/material";
import { ListItem, Button } from "@mui/material";
import UpdateUserDetail from "../components/users/UpdateUserDetail";
import ListOfAllBillingAddressCard from "../components/users/ListOfAllBillingAddressCard";
import UpdateShippingAddress from "../components/users/updateShipingAddress";
import UpdateUserAccountPassword from "../components/users/UpdateUserAccountPassword";
import * as API from "../utils/api";

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

  // Handling user detail dialog
  const handleOpenUserDetailDialog = () => setIsUserDetailDialogOpen(true);
  const handleCloseUserDetailDialog = () => setIsUserDetailDialogOpen(false);

  // Handling billing address dialog
  const handleOpenBillingAddressDialog = () =>
    setIsBillingAddressDialogOpen(true);
  const handleCloseBillingAddressDialog = () =>
    setIsBillingAddressDialogOpen(false);

  // Handling shipping address dialog
  const handleOpenShippingAddressDialog = () =>
    setIsShippingAddressDialogOpen(true);
  const handleCloseShippingAddressDialog = () =>
    setIsShippingAddressDialogOpen(false);

  const handleOpenPasswordDialog = () => setIsPasswordDialogOpen(true);
  const handleClosePasswordDialog = () => setIsPasswordDialogOpen(false);

  useEffect(() => {
    API.getUserDetail(user.id)
      .then((response) => {
        setBio(response.data.user.bio);
        setEmail(response.data.user.email);
        setName(response.data.user.name);
      })
      .catch((error) => {
        console.log("user error", error);
      });
  }, [user.id]);

  useEffect(() => {
    API.listAllBillingAddress()
      .then((response) => {
        console.log("Billing address detail Response", response);
        setBillingAddress(response.data); // Set the response data directly
      })
      .catch((error) => {
        console.log("billing address error", error);
      });
  }, []);
  return (
    <>
      <Grid
        container
        alignItems="center"
        spacing={1}
        sx={{ marginTop: 2, marginBottom: 1 }}
      >
        <Grid item>
          <Avatar
            alt="Remy Sharp"
            src={user.avtar_image_url}
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

      {/* User Detail */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ListItem>
            <ListItemText
              primary={name}
              secondary={
                <Typography variant="body2" color="text.secondary">
                  {email}
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
      <Grid item>
        <ListItem
          secondaryAction={
            <Button
              variant="text"
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

      {/* Shipping Address Section */}
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
                706, Palash Oak Society, Baner Pune
              </Typography>
            }
          />
        </ListItem>
      </Grid>

      <UpdateShippingAddress
        open={isShippingAddressDialogOpen}
        onClose={handleCloseShippingAddressDialog}
      />

      <Divider />

      {/* Billing Address Section */}
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

      {/* Payment Method Section */}
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
      <Divider />
    </>
  );
};

export default UserAccountSettings;
