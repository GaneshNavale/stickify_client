import * as React from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Logo from "./Logo";
import UserMenu from "./UserMenu";
import * as API from "./../utils/api";

const navItems = [
  { name: "Products", path: "/categories" },
  { name: "Tools", path: "/tools" },
  { name: "Sample Steacker", path: "/" },
  { name: "Deals", path: "/deals" },
];

const NavBar = (props) => {
  const { user, cart } = props;
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productItems, setProductItems] = useState([]);
  const [activeTab, setActiveTab] = useState(navItems[2].path);
  const [isSticky, setIsSticky] = useState(false);
  const [anchorElProduct, setAnchorElProduct] = useState(null);

  const handleTabChange = (path) => {
    setActiveTab(path);
    navigate(path);
    setMobileOpen(false);
  };

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleOpenProductMenu = (event) => {
    setAnchorElProduct(event.currentTarget);
  };

  const handleCloseProductMenu = () => {
    setAnchorElProduct(null);
    setMobileOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchCategories = React.useCallback(async () => {
    try {
      const data = await API.fetchCategories();
      setProductItems(data.data);
    } catch (error) {
      console.log("error while fetching categories", error);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const drawer = (
    <Box sx={{ textAlign: "center" }}>
      <Box sx={{ my: 2, mx: 2, display: "flex", alignItems: "center" }}>
        <Logo />
      </Box>
      <List sx={{ mx: 1 }}>
        {navItems.map((item) =>
          item.name === "Products" ? (
            <ListItem key={item.name} disablePadding>
              <Button
                variant={activeTab === item.path ? "contained" : "text"}
                onClick={handleOpenProductMenu}
                sx={{
                  mx: 1,
                }}
              >
                {item.name}
                <KeyboardArrowDownIcon />
              </Button>
            </ListItem>
          ) : (
            <ListItem key={item.name} disablePadding>
              <Button
                variant={activeTab === item.path ? "contained" : "text"}
                component={Link}
                to={item.path}
                onClick={() => handleTabChange(item.path)}
                sx={{
                  mx: 1,
                }}
              >
                {item.name}
              </Button>
            </ListItem>
          )
        )}
        {!user && (
          <ListItem key="sign_in" disablePadding>
            <Button
              component={Link}
              variant={activeTab === "/sign_in" ? "contained" : "text"}
              onClick={() => handleTabChange("/sign_in")}
              to="/sign_in"
              sx={{ mx: 1 }}
            >
              Sign In
            </Button>
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
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box sx={{ my: 2, display: "flex", alignItems: "center" }}>
                <img
                  src={process.env.PUBLIC_URL + "/logo.png"}
                  alt="Logo"
                  style={{ height: "30px", width: "auto" }}
                />
              </Box>
              <Box sx={{ display: { xs: "none", sm: "none", md: "block" } }}>
                {navItems.map((item) =>
                  item.name === "Products" ? (
                    <Button
                      key={item.name}
                      variant={activeTab === item.path ? "contained" : "text"}
                      to={item.path}
                      onClick={(event) => {
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
                <Menu
                  anchorEl={anchorElProduct}
                  open={Boolean(anchorElProduct)}
                  onClose={handleCloseProductMenu}
                >
                  {productItems.map((product) => (
                    <MenuItem
                      key={product.name}
                      onClick={() => {
                        handleCloseProductMenu();
                        handleTabChange("/categories");
                        navigate(`/categories/${product.slug}`, {
                          state: {
                            category: product,
                          },
                        });
                      }}
                      disableRipple
                    >
                      {product.name}
                    </MenuItem>
                  ))}
                </Menu>
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
              {user && <UserMenu user={user} cart={cart} />}
            </Box>

            <IconButton
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{ display: { xs: "block", sm: "block", md: "none" } }}
            >
              <MenuIcon fontSize="large" color="primary" />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          "display": { xs: "block", sm: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: { xs: "50%", sm: "35%" },
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default NavBar;
