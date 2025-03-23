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
import ListOfAllAddresses from "./ListOfAllAddresses";

const Checkout = () => {
  const navigate = useNavigate();

  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [loading, setLoading] = useState(true);
  const [addressModal, setAddressModal] = useState({ type: "", open: false });

  const { cart, setCart } = useAuth();
  const [order, setOrder] = useState();
  const [addresses, setAddresses] = useState([]);
  const [selectedShippingAddress, setSelectedShippingAddress] = useState({});
  const [selectedBillingAddress, setSelectedBillingAddress] = useState({});

  const toggleSameAsShipping = () => setSameAsShipping(!sameAsShipping);
  const handleBackdropClose = () => setOpenBackdrop(false);
  const handleBackdropOpen = () => setOpenBackdrop(true);

  const setShippingAddressModalOpen = () => {
    setAddressModal({ type: "shipping", open: true });
  };

  const setBillingAddressModalOpen = () => {
    setAddressModal({ type: "billing", open: true });
  };

  const setAddressModalClose = () => {
    setAddressModal({ type: "", open: false });
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = () => {
    API.listAllAddresses()
      .then((response) => response.data)
      .then((data) => {
        setAddresses(data);
        setSelectedShippingAddress(
          data.find((address) => address.default) || {}
        );
        setSelectedBillingAddress(
          data.find((address) => address.default) || {}
        );
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error while fetching addresses", error);
      });
  };

  const handleCheckout = async (event) => {
    event.preventDefault();
    handleBackdropOpen();
    try {
      if (order) {
        processPayment();
      } else {
        let billingAddressId;
        if (sameAsShipping) {
          billingAddressId = selectedShippingAddress?.id;
        } else {
          billingAddressId = selectedBillingAddress?.id;
        }

        API.createOrder({
          shipping_address_id: selectedShippingAddress?.id,
          billing_address_id: billingAddressId,
        })
          .then((response) => response.data)
          .then((data) => {
            setOrder(data);
            setCart({ items: [] });
          });
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    } finally {
      handleBackdropClose();
    }
  };

  useEffect(() => {
    if (order) {
      processPayment();
    }
  }, [order]);

  const processPayment = () => {
    const {
      id,
      order_id,
      razorpay_order_id,
      amount,
      currency,
      name,
      email,
      contact,
    } = order;

    const options = {
      key: process.env.REACT_APP_RAZORPAY_API_KEY,
      amount: amount,
      currency: currency,
      name: "Stick It Up Custom",
      image: process.env.PUBLIC_URL + "/logo.png",
      description: "Order Payment",
      order_id: razorpay_order_id,
      handler: async function (response) {
        API.confirmOrder(id, {
          payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          signature: response.razorpay_signature,
        })
          .then((response) => response.data)
          .then((data) => {
            navigate(`/order_details/${order_id}`);
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
      modal: {
        ondismiss: function () {
          navigate(`/order_details/${order_id}`, {
            replace: true,
            state: {
              alert: {
                message: "Payment was not confirmed.",
                type: "error",
              },
            },
          });
        },
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <Container sx={{ pt: 5, pb: 5 }}>
      <Grid container spacing={4}>
        {/* Shipping and Billing Section */}
        <Grid item size={{ xs: 12, sm: 6, md: 8 }}>
          <Card>
            <Grid item sx={{ paddingLeft: 2 }}>
              <Typography variant="h5">Shipping Address</Typography>
            </Grid>
            {!loading && (
              <Box>
                <ListItem>
                  {Object.keys(selectedShippingAddress).length === 0 && (
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight="bold">
                          No shipping address selected
                        </Typography>
                      }
                    />
                  )}
                  {Object.keys(selectedShippingAddress).length !== 0 && (
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight="bold">
                          {selectedShippingAddress?.full_name}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {[
                            selectedShippingAddress?.address_line_1,
                            selectedShippingAddress?.city,
                            selectedShippingAddress?.state,
                            selectedShippingAddress?.zip_code,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </Typography>
                      }
                    />
                  )}
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => setShippingAddressModalOpen()}
                  >
                    Change
                  </Button>
                </ListItem>
                <ListOfAllAddresses
                  open={addressModal.open}
                  type={addressModal.type}
                  onClose={() => setAddressModalClose()}
                  addresses={addresses}
                  setAddresses={(data) => setAddresses(data)}
                  setSelectedShippingAddress={(address) =>
                    setSelectedShippingAddress(address)
                  }
                  setSelectedBillingAddress={(address) =>
                    setSelectedBillingAddress(address)
                  }
                  addressId={
                    addressModal.type === "shipping"
                      ? selectedShippingAddress.id
                      : selectedBillingAddress.id
                  }
                />
              </Box>
            )}

            <Divider sx={{ mt: 2, mb: 1 }} />

            <Grid item sx={{ paddingLeft: 2 }}>
              <FormControlLabel
                sx={{ paddingBottom: 0.5 }}
                control={
                  <Checkbox
                    checked={sameAsShipping}
                    onChange={toggleSameAsShipping}
                  />
                }
                label="Billing address same as shipping"
              />
            </Grid>

            {!loading && !sameAsShipping && (
              <Box>
                <Grid item sx={{ paddingLeft: 2 }}>
                  <Typography variant="h5">Billing Address</Typography>
                </Grid>
                <ListItem>
                  {Object.keys(selectedBillingAddress).length === 0 && (
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight="bold">
                          No shipping address selected
                        </Typography>
                      }
                    />
                  )}
                  {Object.keys(selectedBillingAddress).length !== 0 && (
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight="bold">
                          {selectedBillingAddress?.full_name}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {[
                            selectedBillingAddress?.address_line_1,
                            selectedBillingAddress?.city,
                            selectedBillingAddress?.state,
                            selectedBillingAddress?.zip_code,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </Typography>
                      }
                    />
                  )}
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => setBillingAddressModalOpen()}
                  >
                    Change
                  </Button>
                </ListItem>
              </Box>
            )}
          </Card>
          <Grid sx={{ paddingLeft: 2, paddingTop: 2 }}>
            <Button
              disabled={
                Object.keys(selectedShippingAddress).length === 0 &&
                Object.keys(selectedBillingAddress).length === 0
              }
              type="submit"
              variant="contained"
              onClick={handleCheckout}
            >
              Place your order
            </Button>
          </Grid>
        </Grid>
        {/* Order Summary */}
        <Grid item size={{ xs: 12, sm: 6, md: 4 }} sx={{ paddingRight: 2 }}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Order Summary
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {cart.items.map((item) => (
              <Grid item size={12} key={item.id}>
                <Grid container justifyContent="space-between">
                  <Grid item size={6}>
                    <Typography variant="subtitle1">{item.name}</Typography>
                    <Typography variant="body2">
                      Size: {item.height} * {item.width}
                    </Typography>
                    <Typography variant="body2">
                      Qty: {item.quantity}
                    </Typography>
                  </Grid>
                  <Grid item size={6}>
                    <Typography variant="subtitle1">{item.subtotal}</Typography>
                  </Grid>
                </Grid>
              </Grid>
            ))}
            <Divider sx={{ margin: "10px 0 0 0" }} />
            <Grid
              container
              justifyContent="space-between"
              sx={{ paddingTop: 1 }}
            >
              <Grid item xs={6}>
                <Typography variant="body1">Subtotal</Typography>
              </Grid>
              <Grid item xs={6} textAlign="right">
                <Typography variant="body1">₹{cart.subtotal}</Typography>
              </Grid>
            </Grid>
            <Grid container justifyContent="space-between">
              <Grid item xs={6}>
                <Typography variant="body1">Discount</Typography>
              </Grid>
              <Grid item xs={6} textAlign="right">
                <Typography variant="body1">₹{0}</Typography>
              </Grid>
            </Grid>
            <Grid container justifyContent="space-between">
              <Grid item xs={6}>
                <Typography variant="body1">
                  <b>Total</b>
                </Typography>
              </Grid>
              <Grid item xs={6} textAlign="right">
                <Typography variant="body1">
                  <b>₹{cart.total}</b>
                </Typography>
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Backdrop open={openBackdrop}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Grid>
    </Container>
  );
};

export default Checkout;
