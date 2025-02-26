import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid2';

import {
  Avatar,
  Box,
  Checkbox,
  Container,
  TextField,
  Typography,
} from '@mui/material';

import * as API from '../../utils/adminApi';

const CreateShipmentModal = (props) => {
  const { order, open, onClose, openBackdrop, setOpenBackdrop, fetchOrder } =
    props;

  const [selectedItemIds, setSelectedItemIds] = useState(
    order.items.length === 1 ? [order.items[0].id] : []
  );

  const [errors, setErrors] = useState({});

  const [shipmentDetails, setShipmentDetails] = useState({});

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async () => {
    setOpenBackdrop(true);
    let params = {
      order_id: order.order_id,
      shipment: {
        pickup_location: 'Primary',
        length: shipmentDetails.length,
        breadth: shipmentDetails.breadth,
        height: shipmentDetails.height,
        weight: shipmentDetails.weight,
        shipment_items_attributes: selectedItemIds.map((id) => ({
          order_item_id: id,
        })),
      },
    };
    try {
      await API.createShipment(params);
      fetchOrder();
    } catch (error) {
      console.log('Error while creating shipment', error);
    } finally {
      handleClose();
      setOpenBackdrop(false);
    }
  };

  const handleCheckBoxClick = (item) => {
    setSelectedItemIds(
      (prevSelected) =>
        prevSelected.includes(item.id)
          ? prevSelected.filter((id) => id !== item.id) // Remove item
          : [...prevSelected, item.id] // Add item
    );
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{}} id="new_shipment">
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Create Shipment
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
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Select Items
          </Typography>
          <Grid container>
            {order.items
              .filter((item) => !item.shipment_created)
              .map((item) => (
                <Grid container direction="row" spacing={2}>
                  <Grid item>
                    <Checkbox
                      checked={selectedItemIds.includes(item.id)}
                      onChange={() => handleCheckBoxClick(item)}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                  </Grid>
                  <Grid item>
                    <Box key={item.id} sx={{ display: 'flex', mb: 3 }}>
                      <Avatar
                        src={item.image_url}
                        alt={item.name}
                        variant="square"
                        sx={{ width: 168, height: 112, mr: 2 }}
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
          </Grid>

          <Grid container spacing={2}>
            <Grid
              item
              size={{ xs: 5, sm: 6, md: 3 }}
              sx={{ paddingBottom: 0.5 }}
            >
              <TextField
                label="Length"
                type="number"
                size="small"
                fullWidth
                value={shipmentDetails.length}
                onChange={(e) =>
                  setShipmentDetails({
                    ...shipmentDetails,
                    length: e.target.value,
                  })
                }
                error={!!errors.length}
                helperText={errors.length}
                required
              />
            </Grid>
            <Grid
              item
              size={{ xs: 5, sm: 6, md: 3 }}
              sx={{ paddingBottom: 0.5 }}
            >
              <TextField
                label="Breadth"
                type="number"
                size="small"
                fullWidth
                value={shipmentDetails.breadth}
                onChange={(e) =>
                  setShipmentDetails({
                    ...shipmentDetails,
                    breadth: e.target.value,
                  })
                }
                error={!!errors.breadth}
                helperText={errors.breadth}
                required
              />
            </Grid>
            <Grid
              item
              size={{ xs: 5, sm: 6, md: 3 }}
              sx={{ paddingBottom: 0.5 }}
            >
              <TextField
                label="Height"
                type="number"
                size="small"
                fullWidth
                value={shipmentDetails.height}
                onChange={(e) =>
                  setShipmentDetails({
                    ...shipmentDetails,
                    height: e.target.value,
                  })
                }
                error={!!errors.height}
                helperText={errors.height}
                required
              />
            </Grid>
            <Grid
              item
              size={{ xs: 5, sm: 6, md: 3 }}
              sx={{ paddingBottom: 0.5 }}
            >
              <TextField
                label="Weight"
                type="number"
                size="small"
                fullWidth
                value={shipmentDetails.weight}
                onChange={(e) =>
                  setShipmentDetails({
                    ...shipmentDetails,
                    weight: e.target.value,
                  })
                }
                error={!!errors.weight}
                helperText={errors.weight}
                required
              />
            </Grid>
          </Grid>
        </Container>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          onClick={() => handleSubmit()}
          disabled={
            openBackdrop ||
            !shipmentDetails?.weight ||
            !shipmentDetails?.height ||
            !shipmentDetails?.breadth ||
            !shipmentDetails?.length ||
            selectedItemIds.length === 0
          }
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateShipmentModal;
