import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Grid, Avatar, Typography, ListItemText, Divider } from "@mui/material";
import { ListItem, Button } from "@mui/material";
import UpdateUserDetail from "../components/users/UpdateUserDetail";
import UpdateBillingAddress from "../components/users/UpdateBillingAddress";
import UpdateShippingAddress from "../components/users/updateShipingAddress";
import UpdateUserAccountPassword from "../components/users/UpdateUserAccountPassword";
import * as API from "../utils/api";

const UserAccountSettings = () => {
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");

  console.log("User Detail", user);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [openBillingDialog, setOpenBillingDialog] = useState(false);
  const [openShippingDialog, setOpenShippingDialog] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);

  //handling user detail dialog
  const handleOpenUserDetailDialog = () => setDialogOpen(true);
  const handleCloseUserDetailDialog = () => setDialogOpen(false);

  //handling billing address dialog
  const handleOpenBillingDialog = () => setOpenBillingDialog(true);
  const handleCloseBillingDialog = () => setOpenBillingDialog(false);

  //handling shipping address dialog
  const handleOpenShippingDialog = () => setOpenShippingDialog(true);
  const handleCloseShippingDialog = () => setOpenShippingDialog(false);

  const handleOpenPasswordDialog = () => setOpenPasswordDialog(true);
  const handleClosePasswordDialog = () => setOpenPasswordDialog(false);

  useEffect(() => {
    API.getUserDetail(user.id)
      .then((response) => {
        console.log("User detail Response", response);
        setBio(response.data.user.bio);
        setEmail(response.data.user.email);
        setName(response.data.user.name);
      })
      .catch((error) => {
        console.log("user error", error);
      });
  }, [handleOpenUserDetailDialog]);

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
        open={dialogOpen}
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
        open={openPasswordDialog}
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
              onClick={handleOpenShippingDialog}
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
        open={openShippingDialog}
        onClose={handleCloseShippingDialog}
        currentAddress={"706, Palash Oak Society, Baner Pune"} // Pass the shipping address
      />

      <Divider />
      {/* Billing Address Section */}
      <Grid item>
        <ListItem
          secondaryAction={
            <Button
              variant="text"
              color="primary"
              onClick={handleOpenBillingDialog}
            >
              Edit
            </Button>
          }
        >
          <ListItemText
            primary="Billing Address"
            secondary={
              <Typography variant="body2" color="text.secondary">
                706, Palash Oak Society, Baner Pune
              </Typography>
            }
          />
        </ListItem>
      </Grid>

      <UpdateBillingAddress
        open={openBillingDialog}
        onClose={handleCloseBillingDialog}
        currentAddress={"706, Palash Oak Society, Baner Pune"} // Pass the billing address
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
              <Typography variant="body2" color="text.secondary"></Typography>
            }
          />
        </ListItem>
      </Grid>
      <Divider />
    </>
  );
};

export default UserAccountSettings;
