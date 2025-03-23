import React, { useState } from 'react';
import {
  Container,
  Grid2 as Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Backdrop,
  CircularProgress,
  Divider,
  Tooltip,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import * as API from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const navigate = useNavigate();
  const { user, cart, setCart } = useAuth();
  const removeCartItem = (itemId) => {
    setOpenBackdrop(true);
    API.removeCartItem(itemId)
      .then((response) => response.data)
      .then((data) => {
        setCart(data);
        setOpenBackdrop(false);
      });
  };

  const handleQuantityChange = (itemId, quantity) => {
    updateCartItem(itemId, { quantity: quantity });
  };

  const updateCartItem = (itemId, params) => {
    setOpenBackdrop(true);
    API.updateCartItem(itemId, params)
      .then((response) => response.data)
      .then((data) => {
        setCart(data);
        setOpenBackdrop(false);
      });
  };

  const handleCheckout = () => {
    if (user) {
      navigate('/checkout');
    } else {
      window.localStorage.setItem(
        'stick_it_up_after_login_redirect_url',
        '/checkout'
      );
      navigate('/sign_in');
    }
  };

  const trimText = (text, maxLength) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  return (
    <Container sx={{ paddingTop: 10 }}>
      {cart.items?.length === 0 && (
        <Typography variant="h4" align="center" gutterBottom>
          Your cart is empty
        </Typography>
      )}
      {cart.items?.length > 0 && (
        <Grid container spacing={3} direction="row">
          <Grid item size={{ xs: 12, sm: 6, md: 8 }}>
            {/* Cart Items */}
            {cart.items.map((item) => (
              <Grid item md={6} lg={4} key={item.id}>
                <Card>
                  <CardContent>
                    <Grid container justifyContent="space-between" spacing={2}>
                      <Grid item size={{ xs: 12, sm: 12, md: 4, lg: 6 }}>
                        <Tooltip key={item.id} title={item.name} arrow>
                          <Typography
                            variant="h6"
                            noWrap
                            sx={{ maxWidth: '200px' }}
                          >
                            {item.name}
                          </Typography>
                        </Tooltip>
                        <Typography variant="body2" color="textSecondary">
                          Price: ₹{item.subtotal}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Size: {item.height} * {item.width}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        size={{ xs: 12, sm: 12, md: 8, lg: 6 }}
                        container
                        justifyContent="flex-end"
                        alignItems="center"
                      >
                        <Grid item size={{ xs: 6, sm: 6, md: 6, lg: 8 }}>
                          <TextField
                            fullWidth
                            label="Qty"
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                item.id,
                                parseInt(e.target.value)
                              )
                            }
                            size="small"
                          />
                        </Grid>
                        <Grid item size={{ xs: 6, sm: 6, md: 6, lg: 4 }}>
                          <Button
                            fullWidth
                            onClick={() => removeCartItem(item.id)}
                            color="error"
                            size="small"
                            startIcon={<Delete />}
                          >
                            Remove
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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
                <Divider sx={{ margin: '10px 0' }} />
                <Grid container justifyContent="space-between">
                  <Grid item xs={6}>
                    <Typography variant="body1">Discount</Typography>
                  </Grid>
                  <Grid item xs={6} textAlign="right">
                    <Typography variant="body1">₹{cart.discount}</Typography>
                  </Grid>
                </Grid>
                <Divider sx={{ margin: '10px 0' }} />
                <Grid container justifyContent="space-between">
                  <Grid item xs={6}>
                    <Typography variant="h6">Total</Typography>
                  </Grid>
                  <Grid item xs={6} textAlign="right">
                    <Typography variant="h6">₹{cart.total}</Typography>
                  </Grid>
                </Grid>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => handleCheckout()}
                  sx={{ marginTop: 2 }}
                >
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={openBackdrop}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </Grid>
      )}
    </Container>
  );
};

export default Cart;
