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
  Chip,
  CircularProgress,
  Container,
  Divider,
  Typography,
} from '@mui/material';
import * as API from '../../utils/adminApi';

const OrderItemModal = (props) => {
  const { itemId, open, onClose } = props;
  const [state, setState] = useState({});

  useEffect(() => {
    fetchOrderItem(itemId);
  }, [itemId]);

  const fetchOrderItem = async (itemId) => {
    try {
      setOpenBackdrop(true);
      const response = await API.fetchOrderItem(itemId);
      console.log('order', response.data);
      setState(response.data);
    } catch (error) {
      console.log('Failed to fetch Order Item.', error);
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

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{}} id="new_user">
        Order Item Details
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
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Order Item Details
          </Typography>
          <Grid container spacing={4}>
            {/* Order Summary Section */}
            <Grid item size={{ xs: 12, sm: 12, md: 8 }}>
              <Card sx={{ mb: 3 }}>
                <CardContent></CardContent>
              </Card>
            </Grid>

            {/* Payment and Order Status Section */}
            <Grid item size={{ xs: 12, sm: 12, md: 4 }}>
              <Card sx={{ mb: 3 }}>
                <CardContent></CardContent>
              </Card>

              <Card>
                <CardContent></CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </DialogContent>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={openBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Dialog>
  );
};

export default OrderItemModal;
