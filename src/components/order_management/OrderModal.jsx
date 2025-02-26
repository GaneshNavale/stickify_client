import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid2';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InfoIcon from '@mui/icons-material/Info';

import {
  Avatar,
  Backdrop,
  Box,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Typography,
} from '@mui/material';
import * as API from '../../utils/adminApi';
import CreateShipmentModal from './CreateShipmentModal';

const OrderModal = (props) => {
  const { orderId, open, onClose } = props;
  const [order, setOrder] = useState({
    items: [],
    shipping_address: {},
    billing_address: {},
    shipments: [],
  });

  const [shipmentModalOpen, setShipmentModalOpen] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setOpenBackdrop(true);
      const response = await API.fetchOrder(orderId);
      console.log('order', response.data);
      setOrder(response.data);
    } catch (error) {
      console.log('Failed to fetch Order.', error);
    } finally {
      setOpenBackdrop(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  const [openBackdrop, setOpenBackdrop] = useState(false);

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

  const allOrderItemsShipped = () => {
    if (!order?.items || !order?.shipments) {
      console.log('Missing order_items or shipments:', {
        items: order?.items,
        shipments: order?.shipments,
      });
      return false;
    }

    // Extract all order_item_ids from shipments
    const shippedOrderItemIds = new Set(
      order.shipments.flatMap((shipment) => shipment.order_item_ids)
    );

    console.log('Extracted shippedOrderItemIds:', [...shippedOrderItemIds]);

    // Log each order item and check if it is shipped
    let allShipped = true;
    order.items.forEach((item) => {
      const isShipped = shippedOrderItemIds.has(item.id);
      console.log(
        `Checking item ${item.shipment_created}: ${isShipped ? 'Shipped ✅' : 'Not Shipped ❌'}`
      );
      if (!isShipped) allShipped = false;
    });

    console.log('Final result: allOrderItemsShipped =', allShipped);
    return allShipped;
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{}} id="new_user">
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Order Details
        </Typography>
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={(theme) => ({
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <Container sx={{ pt: 5, pb: 5 }}>
          <Grid container spacing={4}>
            {/* Order Summary Section */}
            <Grid item size={{ xs: 12, sm: 12, md: 8 }}>
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
                    {order.shipping_address.address_line_1},{' '}
                    {order.shipping_address.city}
                    {order.shipping_address.state},{' '}
                    {order.shipping_address.zip_code}
                  </Typography>
                  <Divider sx={{ mt: 2, mb: 2 }} />
                  <Typography variant="body1" gutterBottom>
                    <strong>Billing Address:</strong>
                    <br />
                    {order.billing_address.full_name}
                    {order.billing_address.address_line_1},{' '}
                    {order.billing_address.city}
                    {order.billing_address.state},{' '}
                    {order.billing_address.zip_code}
                  </Typography>
                </CardContent>
              </Card>

              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Items Ordered
                  </Typography>
                  {order.items.map((item) => (
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
                  ))}
                </CardContent>
              </Card>

              {order.shipments.length !== 0 && (
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      Shipments
                    </Typography>
                    {order.shipments.map((shipment) => (
                      <Box key={shipment.id} sx={{ display: 'flex', mb: 3 }}>
                        <Box>
                          <Typography variant="subtitle1">
                            Shipment ID: {shipment.shipment_id}
                          </Typography>
                          <Typography variant="subtitle1">
                            Shipment Provider ID:{' '}
                            {shipment.provider_shipment_id}
                          </Typography>
                          <Typography variant="subtitle1">
                            Items Included:{' '}
                            {shipment.shipment_item_names?.join(', ')}
                          </Typography>
                          <Typography variant="subtitle1">
                            Status: {renderStatusChip(shipment.status)}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              )}
            </Grid>

            {/* Payment and Order Status Section */}
            <Grid item size={{ xs: 12, sm: 12, md: 4 }}>
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
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                  >
                    Last updated: {order.order_updated_at}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </DialogContent>
      <DialogActions>
        {!allOrderItemsShipped() && (
          <Grid container spacing={2}>
            <Grid item px={2} py={0.2}>
              <Button
                variant="outlined"
                onClick={() => setShipmentModalOpen(open)}
                disabled={openBackdrop}
              >
                Create shipment
              </Button>
              <CreateShipmentModal
                order={order}
                open={shipmentModalOpen}
                onClose={() => setShipmentModalOpen(false)}
                openBackdrop={openBackdrop}
                setOpenBackdrop={setOpenBackdrop}
                fetchOrder={() => fetchOrder()}
              />
            </Grid>
          </Grid>
        )}
      </DialogActions>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={openBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Dialog>
  );
};

export default OrderModal;
