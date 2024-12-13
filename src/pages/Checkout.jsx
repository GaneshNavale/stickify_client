import React, { useState, useEffect } from "react";
import {
  Container,
  Grid2 as Grid,
  Card,
  CardContent,
  Typography,
  Divider,
  Backdrop,
  Button,
  CircularProgress,
  ListItem,
  ListItemText,
  Box,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import * as API from "../utils/api";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import ListOfAllShippingAddresses from "./ListOfAllShippingAddresses";
import ListOfAllBillingAddresses from "./ListOfAllBillingAddresses";
const Checkout = () => {
  const navigate = useNavigate();

  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [loading, setLoading] = useState(true);
  const [shippingAddressModalOpen, setShippingAddressModalOpen] =
    useState(false);
  const [billingAddressModalOpen, setBillingAddressModalOpen] = useState(false);
  const { cart, setCart } = useAuth();
  const [orderId, setOrderId] = useState();
  const [addresses, setAddresses] = useState([]);
  const [selectedShippingAddress, setSelectedShippingAddress] = useState(null);
  const [selectedBillingAddress, setSelectedBillingAddress] = useState(null);

  const toggleSameAsShipping = () => setSameAsShipping(!sameAsShipping);
  const handleBackdropClose = () => setOpenBackdrop(false);
  const handleBackdropOpen = () => setOpenBackdrop(true);

  useEffect(() => {
    fetchShippingAddresses();
  }, []);

  const fetchShippingAddresses = () => {
    API.listAllShippingAddress()
      .then((response) => response.data)
      .then((data) => {
        setAddresses(data);
        setSelectedShippingAddress(data.find((address) => address.default));
        setSelectedBillingAddress(data.find((address) => address.default));
        setLoading(false);
      })
      .catch((error) => {
        console.log("Shipping address error", error);
      });
  };

  const handleCheckout = async (event) => {
    event.preventDefault();
    try {
      handleBackdropOpen();
      API.createOrder({
        shipping_address_id: selectedShippingAddress?.id,
        billing_address_id: selectedBillingAddress?.id,
      })
        .then((response) => response.data)
        .then((data) => {
          const {
            order_id,
            razorpay_order_id,
            amount,
            currency,
            name,
            email,
            contact,
          } = data;

          setCart({ items: [] });
          setOrderId(order_id);
          const options = {
            key: process.env.REACT_APP_RAZORPAY_API_KEY,
            amount: amount,
            currency: currency,
            name: "Stick It Up Custom",
            image: process.env.PUBLIC_URL + "/logo.png",
            description: "Order Payment",
            order_id: razorpay_order_id,
            handler: async function (response) {
              API.confirmOrder(order_id, {
                payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                signature: response.razorpay_signature,
              })
                .then((response) => response.data)
                .then((data) => {
                  navigate(`/order/${order_id}`);
                });
            },
            prefill: {
              name: name,
              email: email,
              contact: contact || 9000000000,
            },
            theme: {
              color: "#fe4816",
            },
          };
          const rzp = new window.Razorpay(options);
          rzp.open();
        });
    } catch (error) {
      console.error("Error during checkout:", error);
    } finally {
      handleBackdropClose();
    }
  };

  return (
    <Container sx={{ paddingTop: 10 }}>
      <Grid container spacing={3} direction="row">
        <Grid item size={{ sm: 6, md: 8 }}>
          <Grid>
            <Grid item sx={{ paddingLeft: 2 }}>
              <Typography variant="h6">Shipping Address</Typography>
            </Grid>
            {!loading && (
              <Grid item>
                <Grid item xs={12} key={selectedShippingAddress.id}>
                  <ListItem>
                    <ListItemText
                      primary={selectedShippingAddress.full_name}
                      secondary={
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            {[
                              selectedShippingAddress.full_name,
                              selectedShippingAddress.address_line_1,
                              selectedShippingAddress.address_line_2,
                              selectedShippingAddress.landmark,
                              selectedShippingAddress.city,
                              selectedShippingAddress.state,
                              selectedShippingAddress.zip_code,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </Typography>
                        </Box>
                      }
                    />
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => setShippingAddressModalOpen(true)}
                        sx={{ marginLeft: 1 }}
                      >
                        Change
                      </Button>
                    </Box>
                  </ListItem>
                </Grid>
                <ListOfAllShippingAddresses
                  open={shippingAddressModalOpen}
                  onClose={() => setShippingAddressModalOpen(false)}
                  shippingAddresses={addresses}
                  setShippingAddresses={(data) => setAddresses(data)}
                  setSelectedShippingAddress={(address) =>
                    setSelectedShippingAddress(address)
                  }
                  selectedShippingAddressId={selectedShippingAddress.id}
                />
              </Grid>
            )}
            <Grid item sx={{ paddingLeft: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sameAsShipping}
                    onChange={toggleSameAsShipping}
                    name="Billing address same as shipping"
                  />
                }
                label="Billing address same as shipping"
              />
            </Grid>
            {!loading && !sameAsShipping && (
              <Grid item>
                <Grid item xs={12} key={selectedBillingAddress.id}>
                  <ListItem>
                    <ListItemText
                      primary={selectedBillingAddress.full_name}
                      secondary={
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            {[
                              selectedBillingAddress.full_name,
                              selectedBillingAddress.address_line_1,
                              selectedBillingAddress.address_line_2,
                              selectedBillingAddress.landmark,
                              selectedBillingAddress.city,
                              selectedBillingAddress.state,
                              selectedBillingAddress.zip_code,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </Typography>
                        </Box>
                      }
                    />
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => setBillingAddressModalOpen(true)}
                        sx={{ marginLeft: 1 }}
                      >
                        Change
                      </Button>
                    </Box>
                  </ListItem>
                </Grid>
                <ListOfAllBillingAddresses
                  open={billingAddressModalOpen}
                  onClose={() => setBillingAddressModalOpen(false)}
                  shippingAddresses={addresses}
                  setShippingAddresses={(data) => setAddresses(data)}
                  selectedBillingAddressId={selectedBillingAddress?.id}
                  setSelectedBillingAddress={(address) =>
                    setSelectedBillingAddress(address)
                  }
                />
              </Grid>
            )}
          </Grid>
          <Grid sx={{ paddingLeft: 2, paddingTop: 2 }}>
            <Button type="submit" variant="contained" onClick={handleCheckout}>
              Place your order
            </Button>
          </Grid>
        </Grid>
        <Grid size={{ sm: 6, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Order Summary</Typography>
              <Grid container justifyContent="space-between">
                <Grid item xs={6}>
                  <Typography variant="body1">Subtotal</Typography>
                </Grid>
                <Grid item xs={6} textAlign="right">
                  <Typography variant="body1">₹{cart.subtotal}</Typography>
                </Grid>
              </Grid>
              <Divider sx={{ margin: "10px 0" }} />
              <Grid container justifyContent="space-between">
                <Grid item xs={6}>
                  <Typography variant="body1">Discount</Typography>
                </Grid>
                <Grid item xs={6} textAlign="right">
                  <Typography variant="body1">₹{cart.discount}</Typography>
                </Grid>
              </Grid>
              <Divider sx={{ margin: "10px 0" }} />
              <Grid container justifyContent="space-between">
                <Grid item xs={6}>
                  <Typography variant="h6">Total</Typography>
                </Grid>
                <Grid item xs={6} textAlign="right">
                  <Typography variant="h6">₹{cart.total}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Backdrop
          sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
          open={openBackdrop}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Grid>
    </Container>
  );
};

export default Checkout;
