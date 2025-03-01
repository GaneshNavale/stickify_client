import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid2';
import ImageUploader from '../../utils/ImageUploader';

import {
  Backdrop,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Typography,
} from '@mui/material';
import * as API from '../../utils/adminApi';

const OrderItemModal = (props) => {
  const { itemId, open, onClose } = props;
  const [state, setState] = useState({});
  const [errors, setErrors] = useState({});

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

  const handleImageChange = (image) => {
    if (image) {
      setState((prevState) => ({ ...prevState, image: image }));
      let newErrors = { ...errors };
      delete newErrors.image; // Clear image error if an image is selected
      setErrors(newErrors);
    }
  };

  const handleFinalArtworkChange = (image) => {
    if (image) {
      setState((prevState) => ({ ...prevState, final_artwork: image }));
      let newErrors = { ...errors };
      delete newErrors.image; // Clear image error if an image is selected
      setErrors(newErrors);
    }
  };

  const handleSubmit = async () => {
    console.log('Handle Submit');
    if (!state.final_artwork) {
      console.error('No file selected for final artwork upload.');
      return;
    }

    try {
      setOpenBackdrop(true);
      const formData = new FormData();
      formData.append('order_item[final_artwork]', state.final_artwork);
      if (state.image) {
        formData.append('order_item[image]', state.image);
      }
      const response = await API.updateOrderItem(state.id, formData);
      console.log('Final artwork updated successfully:', response.data);
      setState(response.data);
    } catch (error) {
      console.error('Failed to update final artwork:', error);
    } finally {
      setOpenBackdrop(false);
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
          <Grid container spacing={4}>
            {/* Order Summary Section */}
            <Grid item size={{ xs: 12, sm: 12, md: 8 }}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Initial Artwork
                  </Typography>
                  <Grid item>
                    <ImageUploader
                      id="initial-artwork"
                      imageUrl={state?.image_url}
                      showDeleteButton={false}
                      onImageChange={handleImageChange}
                    />
                  </Grid>
                </CardContent>
              </Card>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Final Artwork
                  </Typography>
                  <Grid item>
                    <ImageUploader
                      id="final-artwork"
                      imageUrl={state?.final_artwork_url}
                      onImageChange={handleFinalArtworkChange}
                      error={!!errors.final_artwork}
                      helperText={errors.final_artwork}
                    />
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Payment and Order Status Section */}
            <Grid item size={{ xs: 12, sm: 12, md: 4 }}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="body1" gutterBottom fontWeight="bold">
                    Customer Info
                  </Typography>
                  <Divider sx={{ mt: 2, mb: 2 }} />
                  <Typography variant="body1" gutterBottom>
                    <strong> Name: </strong>
                    {state?.customer_name}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {/* <strong>Initial Artwork</strong> */}
                    <strong>Placed On: </strong>
                    Pune
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {/* <strong>Initial Artwork</strong> */}
                    <strong>Payment Status: </strong>
                    {state?.payment_status}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Order ID: </strong>
                    {state?.order_id}
                  </Typography>
                </CardContent>
              </Card>

              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="body1" gutterBottom fontWeight="bold">
                    Product Info
                  </Typography>
                  <Divider sx={{ mt: 2, mb: 2 }} />
                  <Typography variant="body1" gutterBottom>
                    <Typography variant="body1" gutterBottom>
                      <strong>Item Name: </strong> {state?.product_name}
                    </Typography>

                    <Typography variant="body1" gutterBottom>
                      <strong>Order ID: </strong>
                      {state?.order_id}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Height: </strong>
                      {state?.height}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Width: </strong>
                      {state?.width}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Quantity: </strong>
                      {state?.quantity}
                    </Typography>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </DialogContent>
      <DialogActions>
        <Grid py={0.5}>
          <Button
            variant="outlined"
            onClick={() => handleSubmit()}
            disabled={openBackdrop}
          >
            Submit changes
          </Button>
        </Grid>
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

export default OrderItemModal;
