import React, { useState } from "react";
import {
  Container,
  Grid2 as Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Divider,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import * as API from "../utils/api";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { cart, setCart } = useAuth();
  const removeCartItem = (itemId) => {
    setIsLoading(true);
    API.removeCartItem(itemId)
      .then((response) => response.data)
      .then((data) => {
        setCart(data);
        setIsLoading(false);
      });
  };

  const handleQuantityChange = (itemId, quantity) => {
    updateCartItem(itemId, { quantity: quantity });
  };

  const updateCartItem = (itemId, params) => {
    setIsLoading(true);
    API.updateCartItem(itemId, params)
      .then((response) => response.data)
      .then((data) => {
        setCart(data);
        setIsLoading(false);
      });
  };

  return (
    <Container sx={{ paddingTop: 10 }}>
      {!isLoading && cart.items?.length === 0 && (
        <Typography variant="h4" align="center" gutterBottom>
          Your cart is empty
        </Typography>
      )}
      {!isLoading && cart.items?.length > 0 && (
        <Grid container spacing={3} direction="row">
          <Grid item size={{ sm: 6, md: 8 }}>
            {/* Cart Items */}
            {!isLoading &&
              cart.items.map((item) => (
                <Grid item md={6} lg={4} key={item.id}>
                  <Card>
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={8}>
                          <Typography variant="h6">{item.name}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            Price: ₹{item.subtotal}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            size: {item.height} * {item.width}
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          xs={4}
                          container
                          justifyContent="flex-end"
                          alignItems="center"
                        >
                          <TextField
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
                          <Button
                            onClick={() => removeCartItem(item.id)}
                            color="error"
                            size="small"
                            startIcon={<Delete />}
                          >
                            Remove
                          </Button>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
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
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => navigate("/checkout")}
                  sx={{ marginTop: 2 }}
                >
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Cart;
