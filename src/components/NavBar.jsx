import * as React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import UserMenuItems from "./users/user_settings/UserMenuItems";
import { useState, useEffect } from "react";

const drawerWidth = "50%";
const navItems = [
  { name: "Products", path: "/products" },
  { name: "Tools", path: "/tools" },
  { name: "Sample Steacker", path: "/" },
  { name: "Deals", path: "/deals" },
];

const NavBar = (props) => {
  const { user } = props;
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [activeTab, setActiveTab] = useState(navItems[2].path);
  const [isSticky, setIsSticky] = useState(false);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const { logout } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleTabChange = (path) => {
    setActiveTab(path);
    navigate(path);
  };

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    setIsSticky(scrollTop > 34);
  };

  // Directly using window here instead of passing as a prop
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography
        variant="h6"
        sx={{ my: 2, display: "flex", alignItems: "center" }}
      >
        LOGO
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              onClick={() => handleTabChange(item.path)}
              sx={{ textAlign: "center", color: "primary.main" }}
            >
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
        {!user && (
          <ListItem key="sign_in" disablePadding>
            <ListItemButton
              component={Link}
              to="/sign_in"
              sx={{ textAlign: "center", color: "primary.main" }}
            >
              <ListItemText primary="Sign In" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", marginBottom: 6.5 }}>
      <Box
        sx={{
          bgcolor: "primary.main",
          height: "35px",
          position: "relative",
          top: 0,
          width: "100%",
          zIndex: 1000,
        }}
      />
      <AppBar
        component="nav"
        sx={{
          position: isSticky ? "fixed" : "absolute",
          bgcolor: "background.paper",
          boxShadow: 3,
          marginTop: isSticky ? "0px" : "30px",
        }}
      >
        <Container>
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="h6" component="div" sx={{ mr: 2 }}>
                LOGO
              </Typography>
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                {navItems.map((item) => (
                  <Button
                    key={item.name}
                    variant={activeTab === item.path ? "contained" : "text"}
                    component={Link}
                    to={item.path}
                    onClick={() => handleTabChange(item.path)}
                    sx={{
                      color: activeTab === item.path ? "white" : "black",
                      mx: 1,
                    }}
                  >
                    {item.name}
                  </Button>
                ))}
              </Box>
            </Box>

            <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                alignItems: "center",
              }}
            >
              {!user && (
                <>
                  <Button
                    sx={{ color: "black" }}
                    onClick={() => {
                      navigate("/sign_up", { replace: true });
                    }}
                  >
                    Sign UP
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      navigate("/sign_in", { replace: true });
                    }}
                    sx={{
                      borderRadius: "1.5rem",
                    }}
                  >
                    Log In
                  </Button>
                </>
              )}
              {user && (
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
                    PaperProps={{
                      sx: {
                        width: 265,
                      },
                    }}
                  >
                    <UserMenuItems
                      handleCloseUserMenu={handleCloseUserMenu}
                      logout={logout}
                      user={user}
                    />
                  </Menu>
                </Box>
              )}
            </Box>

            <IconButton
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <nav>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
};

// NavBar.propTypes = {
//   // Removed the window prop since we're using the global window object directly
// };

export default NavBar;
