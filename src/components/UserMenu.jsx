import { Avatar, Box, IconButton, Menu, Tooltip } from "@mui/material";
import UserMenuItems from "./users/user_settings/UserMenuItems";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const UserMenu = ({ user }) => {
  const { logout } = useAuth();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar
            alt="User Avatar"
            src={user.avatar_image_url}
            sx={{ width: 30, height: 30 }}
          />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <UserMenuItems
          handleCloseUserMenu={handleCloseUserMenu}
          logout={logout}
          user={user}
        />
      </Menu>
    </Box>
  );
};

export default UserMenu;
