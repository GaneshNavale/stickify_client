import * as React from "react";
import {
  MenuItem,
  Typography,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import Avatar from "@mui/material/Avatar";
import { Link } from "react-router-dom";

const UserSettingsMenu = ({ handleCloseUserMenu, logout, user }) => {
  return (
    <>
      <MenuItem onClick={handleCloseUserMenu}>
        <Avatar
          alt="Remy Sharp"
          src={user.avtar_image_url}
          sx={{ width: 30, height: 30, marginRight: 1 }}
        />
        <ListItemText
          primary={user.name}
          secondary={
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          }
        />
      </MenuItem>

      <Divider />

      <MenuItem
        component={Link}
        to={`/user_account_settings`}
        onClick={handleCloseUserMenu}
      >
        <ListItemText>Account Settings</ListItemText>
      </MenuItem>

      {/* <MenuItem onClick={handleCloseUserMenu}>
        <ListItemText>Settings</ListItemText>
      </MenuItem> */}

      <MenuItem onClick={handleCloseUserMenu}>
        <ListItemText>Orders</ListItemText>
      </MenuItem>

      <MenuItem onClick={handleCloseUserMenu}>
        <ListItemText>Reorders</ListItemText>
      </MenuItem>

      <Divider />

      <MenuItem
        onClick={() => {
          logout();
          handleCloseUserMenu();
        }}
      >
        <ListItemIcon>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Logout</ListItemText>
      </MenuItem>
    </>
  );
};

export default UserSettingsMenu;
