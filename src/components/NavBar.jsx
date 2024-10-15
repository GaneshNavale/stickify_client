import * as React from "react";
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
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import UserMenuItems from "./users/user_settings/UserMenuItems";
import { useState, useEffect } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Fade, Paper, Popper } from "@mui/material";

const drawerWidth = "50%";
const navItems = [
  { name: "Products", path: "/products" },
  { name: "Tools", path: "/tools" },
  { name: "Sample Steacker", path: "/" },
  { name: "Deals", path: "/deals" },
];

const productItems = [
  { itemName: "Product1" },
  { itemName: "Product2" },
  { itemName: "Product3" },
  { itemName: "Product4" },
];

const NavBar = (props) => {
  const { user } = props;
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [activeTab, setActiveTab] = useState(navItems[2].path);
  const [isSticky, setIsSticky] = useState(false);
  const [anchorElProduct, setAnchorElProduct] = useState(null);
  const [openProductPopper, setOpenProductPopper] = React.useState(false);

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

  const handleOpenProductMenu = (event) => {
    setAnchorElProduct(event.currentTarget);
  };

  const handleCloseProductMenu = () => {
    setAnchorElProduct(null);
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
      <Box sx={{ my: 2, display: "flex", alignItems: "center" }}>
        <img
          src="images/stickitupLogo.png"
          alt="Logo"
          style={{ height: "30px", width: "auto" }}
        />
      </Box>
      <List>
        {navItems.map((item) =>
          item.name === "Products" ? (
            <>
              <ListItem key={item.name} disablePadding>
                <ListItemButton
                  variant={activeTab === item.path ? "contained" : "text"}
                  component={Button}
                  onClick={handleOpenProductMenu}
                  sx={{
                    color: "primary.main",
                    mx: 1,
                  }}
                >
                  {item.name}
                  <KeyboardArrowDownIcon />
                </ListItemButton>
                <Popper
                  open={openProductPopper}
                  anchorEl={anchorElProduct}
                  placement="right-start"
                  transition
                  sx={{ zIndex: 1200 }}
                >
                  {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={350}>
                      <Paper>
                        <Box sx={{ p: 1 }}>
                          {productItems.map((product) => (
                            <Button
                              key={product.itemName}
                              onClick={() => {
                                handleCloseProductMenu();
                                navigate(`/products/${product.itemName}`);
                              }}
                              sx={{
                                display: "block",
                                width: "100%",
                                textAlign: "left",
                                color: "primary.main",
                                "&:hover": {
                                  backgroundColor: "rgba(0, 0, 0, 0.08)", // Add a hover effect
                                },
                              }}
                            >
                              {product.itemName}
                            </Button>
                          ))}
                        </Box>
                      </Paper>
                    </Fade>
                  )}
                </Popper>
              </ListItem>
            </>
          ) : (
            <ListItem key={item.name} disablePadding>
              <ListItemButton
                variant={activeTab === item.path ? "contained" : "text"}
                component={Link}
                to={item.path}
                onClick={() => handleTabChange(item.path)}
                sx={{
                  color: "primary.main",
                  mx: 1,
                }}
              >
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          )
        )}
        {!user && (
          <ListItem key="sign_in" disablePadding>
            <ListItemButton
              component={Link}
              to="/sign_in"
              sx={{ mx: 1, color: "primary.main" }}
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
              <Box sx={{ my: 2, display: "flex", alignItems: "center" }}>
                <img
                  src="images/stickitupLogo.png"
                  alt="Logo"
                  style={{ height: "30px", width: "auto" }}
                />
              </Box>
              <Box sx={{ display: { xs: "none", sm: "none", md: "block" } }}>
                {navItems.map((item) =>
                  item.name === "Products" ? (
                    <>
                      <Button
                        key={item.name}
                        variant={activeTab === item.path ? "contained" : "text"}
                        component={Link}
                        to={item.path}
                        onClick={(event) => {
                          handleTabChange(item.path);
                          handleOpenProductMenu(event);
                        }}
                        sx={{
                          color: activeTab === item.path ? "white" : "black",
                          mx: 1,
                        }}
                      >
                        {item.name}
                        <KeyboardArrowDownIcon />
                      </Button>
                      <Menu
                        anchorEl={anchorElProduct}
                        open={Boolean(anchorElProduct)}
                        onClose={handleCloseProductMenu}
                      >
                        {productItems.map((product) => (
                          <MenuItem
                            key={product.itemName}
                            onClick={() => {
                              handleCloseProductMenu();
                              navigate(`/products/${product.itemName}`);
                            }}
                            disableRipple
                          >
                            {product.itemName}
                          </MenuItem>
                        ))}
                      </Menu>
                    </>
                  ) : (
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
                  )
                )}
              </Box>
            </Box>

            <Box
              sx={{
                display: { xs: "none", sm: "none", md: "block" },
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
              sx={{ mr: 2, display: { xs: "block", sm: "block", md: "none" } }}
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
            display: { xs: "block", sm: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: { xs: "50%", sm: "35%" },
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
