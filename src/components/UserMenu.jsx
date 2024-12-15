import { Avatar, Badge, Box, IconButton, Menu, Tooltip } from "@mui/material";
import UserMenuItems from "./users/user_settings/UserMenuItems";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate } from "react-router-dom";

const UserMenu = ({ user }) => {
  const { logout, cart } = useAuth();
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Box sx={{ flexGrow: 0 }}>
      <IconButton
        onClick={() => navigate("/cart")}
        sx={{ paddingRight: 2, paddingTop: 1 }}
      >
        <Badge badgeContent={cart.items?.length || "0"} color="primary">
          <ShoppingCartIcon color="action" fontSize="small" />
        </Badge>
      </IconButton>
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
