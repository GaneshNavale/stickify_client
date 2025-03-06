import React, { useEffect, useState } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
  Chip,
  Avatar,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InfoIcon from '@mui/icons-material/Info';
import { useParams, useLocation } from 'react-router-dom';
import Notification from '../utils/notification';
import Grid from '@mui/material/Grid2';
import * as API from '../utils/api';

const OrderDetail = () => {
  const location = useLocation();
  const [alert, setAlert] = useState({
    message: location.state?.alert?.message,
    type: location.state?.alert?.type,
  });
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const { orderId } = useParams();
  const [order, setOrder] = useState({
    items: [],
    shipping_address: {},
    billing_address: {},
  });

  useEffect(() => {
    fetchOrder(orderId);
  }, [orderId]);

  const fetchOrder = async (orderId) => {
    try {
      setOpenBackdrop(true);
      const response = await API.fetchOrder(orderId);
      setOrder(response.data);
    } catch (error) {
      console.log('error:', error);
      setAlert({ message: 'Failed to fetch Order.', type: 'error' });
    } finally {
      setOpenBackdrop(false);
    }
  };

  const renderStatusChip = (status) => {
    switch (status) {
      case 'Delivered':
        return (
          <Chip
            label="Delivered"
            color="success"
            icon={<CheckCircleIcon />}
            size="small"
          />
        );
      case 'Pending':
        return (
          <Chip
            label="Pending"
            color="warning"
            icon={<LocalShippingIcon />}
            size="small"
          />
        );
      case 'Canceled':
        return (
          <Chip
            label="Canceled"
            color="error"
            icon={<CancelIcon />}
            size="small"
          />
        );
      case 'Not Received':
        return (
          <Chip
            label="Not Received"
            color="info"
            icon={<InfoIcon />}
            size="small"
          />
        );
      case 'Confirmed':
        return (
          <Chip
            label="Confirmed"
            color="info"
            icon={<CheckCircleIcon />}
            size="small"
          />
        );
      case 'Paid':
        return (
          <Chip
            label="paid"
            color="success"
            icon={<CheckCircleIcon />}
            size="small"
          />
        );
      case 'Created':
        return (
          <Chip label="Created" color="info" icon={<InfoIcon />} size="small" />
        );
      default:
        return null;
    }
  };

  if (openBackdrop) {
    return (
      <Backdrop open={openBackdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <Container sx={{ pt: 5, pb: 5 }}>
      <Notification alert={alert} setAlert={setAlert} />
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Order Details
      </Typography>
      <Grid container spacing={4}>
        {/* Order Summary Section */}
        <Grid item size={{ xs: 12, sm: 7, md: 8 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Order ID: {order.order_id?.toUpperCase()}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Placed on: {order.order_placed_at}
              </Typography>
              <Divider sx={{ mt: 2, mb: 2 }} />
              <Typography variant="body1" gutterBottom>
                <strong>Shipping Address:</strong>
                <br />
                {order.shipping_address.full_name}
                <br />
                {order.shipping_address.address_line_1},{' '}
                {order.shipping_address.city}
                <br />
                {order.shipping_address.state},{' '}
                {order.shipping_address.zip_code}
              </Typography>
              <Divider sx={{ mt: 2, mb: 2 }} />
              <Typography variant="body1" gutterBottom>
                <strong>Billing Address:</strong>
                <br />
                {order.billing_address.full_name}
                <br />
                {order.billing_address.address_line_1},{' '}
                {order.billing_address.city}
                <br />
                {order.billing_address.state}, {order.billing_address.zip_code}
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Items Ordered
              </Typography>
              {order.items.map((item) => (
                <Grid container spacing={1}>
                  <Grid size={5}>
                    <Box key={item.id} sx={{ display: 'flex', mb: 3 }}>
                      <Avatar
                        src={item.image_url}
                        alt={item.name}
                        variant="square"
                        sx={{ width: 105, height: 70, mr: 2 }}
                      />
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {item.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Qty: {item.quantity}, Size: {item.height} *{' '}
                          {item.width}
                        </Typography>
                        <Typography variant="body2">
                          Price: ₹{item.final_price}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Payment and Order Status Section */}
        <Grid item size={{ xs: 12, sm: 5, md: 4 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Payment Details
              </Typography>
              <Divider sx={{ mt: 2, mb: 2 }} />
              <Typography variant="body1">
                <strong>Status:</strong>{' '}
                {renderStatusChip(order.payment_status)}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                <strong>Method:</strong> RazorPay
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                <strong>Amount:</strong> ₹{order.total}
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Order Status
              </Typography>
              <Divider sx={{ mt: 2, mb: 2 }} />
              <Typography variant="body1">
                {renderStatusChip(order.status)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Last updated: {order.order_updated_at}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default OrderDetail;
