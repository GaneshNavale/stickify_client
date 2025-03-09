import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Rating,
  Chip,
  CircularProgress,
  Grid2 as Grid,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import * as API from '../utils/api';
import Notification from '../utils/notification';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import PendingIcon from '@mui/icons-material/Pending';

const UserReviewModal = ({ orderId, open, onClose }) => {
  const [order, setOrder] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [reviewData, setReviewData] = useState({ rating: 0, comment: '' });
  const [loading, setLoading] = useState(false);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [alert, setAlert] = useState({
    message: '',
    type: '',
  });

  useEffect(() => {
    if (open && orderId) {
      fetchOrderDetails();
    }
  }, [open, orderId]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const response = await API.fetchOrder(orderId);
      setOrder(response.data);
      if (response.data?.items?.length > 0) {
        const uniqueProducts = getUniqueProducts(response.data.items);
        setSelectedProductId(uniqueProducts[0].product_id);
        const firstProduct = uniqueProducts[0];
        if (firstProduct?.review) {
          setReviewData({
            rating: parseFloat(firstProduct.review.rating),
            comment: firstProduct.review.comment,
          });
        } else {
          setReviewData({ rating: 0, comment: '' });
        }
      }
    } catch (error) {
      console.error('Failed to fetch order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUniqueProducts = (items) => {
    const uniqueProducts = [];
    const productIds = new Set();

    items.forEach((item) => {
      if (!productIds.has(item.product_id)) {
        productIds.add(item.product_id);
        uniqueProducts.push(item);
      }
    });

    return uniqueProducts;
  };

  const handleProductChange = (event) => {
    setSelectedProductId(event.target.value);
    const product = order.items.find(
      (item) => item.product_id === event.target.value
    );
    if (product?.review) {
      setReviewData({
        rating: parseFloat(product.review.rating),
        comment: product.review.comment,
      });
    } else {
      setReviewData({ rating: 0, comment: '' });
    }
  };

  const handleSubmit = async () => {
    if (!selectedProductId) return;

    if (
      reviewData.rating < 1 ||
      reviewData.rating > 5 ||
      !Number.isInteger(reviewData.rating)
    ) {
      setAlert({
        message: 'Rating must be a whole number between 1 and 5.',
        type: 'error',
      });
      return;
    }

    if (!reviewData.comment.trim()) {
      setAlert({ message: 'Please enter a comment.', type: 'error' });
      return;
    }

    try {
      const selectedItem = order.items.find(
        (item) => item.product_id === selectedProductId
      );
      const existingReview = selectedItem?.review;

      if (existingReview) {
        await API.updateReview(
          selectedProductId,
          existingReview.id,
          reviewData
        );
        onClose('Review updated successfully!', 'success');
      } else {
        await API.createReview(selectedProductId, reviewData);
        onClose('Review added successfully!', 'success');
      }
    } catch (error) {
      setAlert({
        message: error?.response?.data?.errors?.[0] || 'Something Went Wrong!',
        type: 'error',
      });
    }
  };

  const handleDeleteReview = async () => {
    if (!selectedProductId) return;

    try {
      const product = order.items.find(
        (item) => item.product_id === selectedProductId
      );
      if (product?.review) {
        await API.deleteReview(selectedProductId, product.review.id);
        onClose('Review deleted successfully!', 'success');
      }
    } catch (error) {
      onClose('Something went wrong!', 'error');
    } finally {
      setDeleteConfirmationOpen(false);
    }
  };

  const DeleteConfirmationModal = () => (
    <Dialog
      open={deleteConfirmationOpen}
      onClose={() => setDeleteConfirmationOpen(false)}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>Delete Review</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to delete this review?</Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => setDeleteConfirmationOpen(false)}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button onClick={handleDeleteReview} variant="contained" color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );

  const uniqueProducts = order ? getUniqueProducts(order.items) : [];

  const selectedProduct = order?.items.find(
    (item) => item.product_id === selectedProductId
  );

  return (
    <>
      <Dialog
        onClose={() => onClose('', '')}
        open={open}
        maxWidth="sm"
        fullWidth
      >
        <Grid item>
          <Notification alert={alert} setAlert={setAlert} />
        </Grid>
        <DialogTitle>
          {selectedProduct?.review ? 'Update Review' : 'Create Review'}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => onClose('', '')}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          {loading ? (
            <Box display="flex" justifyContent="center">
              <CircularProgress />
            </Box>
          ) : (
            <>
              {selectedProduct?.review && (
                <Chip
                  label={selectedProduct.review.status || 'No Status'}
                  size="small"
                  variant="outlined"
                  icon={
                    selectedProduct.review.status === 'pending' ? (
                      <PendingIcon />
                    ) : selectedProduct.review.status === 'approved' ? (
                      <CheckCircleOutlineIcon />
                    ) : (
                      <HighlightOffIcon />
                    )
                  }
                  sx={{
                    backgroundColor:
                      selectedProduct.review.status === 'pending'
                        ? '#fff3e0'
                        : selectedProduct.review.status === 'approved'
                          ? '#e8f5e9'
                          : '#ffebee',
                    color:
                      selectedProduct.review.status === 'pending'
                        ? '#ff9800'
                        : selectedProduct.review.status === 'approved'
                          ? '#4caf50'
                          : '#f44336',
                    mr: 1,
                    mb: 1,
                  }}
                />
              )}

              {uniqueProducts.length < 2 ? (
                <Typography variant="body1" sx={{ mb: 3, mt: 2 }}>
                  <strong>{uniqueProducts[0]?.name}</strong>
                </Typography>
              ) : (
                <FormControl fullWidth sx={{ mb: 3, mt: 1 }}>
                  <InputLabel
                    id="product-select-label"
                    size="small"
                    sx={{
                      fontSize: '0.875rem',
                      paddingTop: '4px',
                      lineHeight: '1.5',
                    }}
                  >
                    Select Product
                  </InputLabel>
                  <Select
                    labelId="product-select-label"
                    id="product-select"
                    value={selectedProductId}
                    onChange={handleProductChange}
                    label="Select Product"
                    size="small"
                  >
                    {uniqueProducts.map((item) => (
                      <MenuItem key={item.product_id} value={item.product_id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {selectedProductId && (
                <>
                  <Rating
                    name="rating"
                    value={reviewData.rating}
                    onChange={(event, newValue) => {
                      setReviewData((prev) => ({ ...prev, rating: newValue }));
                    }}
                    precision={1}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Comment"
                    name="comment"
                    value={reviewData.comment}
                    onChange={(e) =>
                      setReviewData((prev) => ({
                        ...prev,
                        comment: e.target.value,
                      }))
                    }
                    fullWidth
                    multiline
                    rows={3}
                    margin="normal"
                  />
                </>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose('', '')} variant="outlined">
            Cancel
          </Button>
          {selectedProduct?.review && (
            <Button
              onClick={() => setDeleteConfirmationOpen(true)}
              variant="contained"
              color="error"
            >
              Delete Review
            </Button>
          )}

          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={!selectedProductId}
          >
            {selectedProduct?.review ? 'Update' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>

      <DeleteConfirmationModal />
    </>
  );
};

export default UserReviewModal;