import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import * as API from '../utils/api';
import Notification from '../utils/notification';
import Rating from '@mui/material/Rating';

const UserReviewModal = ({
  productId,
  reviewId,
  operation,
  open,
  onClose,
  review,
}) => {
  const [reviewData, setReviewData] = useState({
    rating: 0,
    comment: '',
  });
  const [alert, setAlert] = useState({ message: '', type: '' });

  useEffect(() => {
    if (operation === 'edit' && review) {
      setReviewData({
        rating: parseInt(review.rating, 10),
        comment: review.comment || '',
      });
    }
  }, [operation, review]);

  const handleClose = () => {
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReviewData((prev) => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (operation === 'create') {
        await API.createReview(productId, reviewData);
        onClose('Review added successfully!', 'success');
      } else if (operation === 'edit') {
        await API.updateReview(productId, reviewId, reviewData);
        onClose('Review updated successfully!', 'success');
      } else if (operation === 'delete') {
        await API.deleteReview(productId, reviewId);
        onClose('Review deleted successfully!', 'success');
      }
    } catch (error) {
      onClose('Something went wrong!', 'error');
    }
  };

  return (
    <Dialog onClose={handleClose} open={open} maxWidth="sm" fullWidth>
      <Grid item>
        <Notification alert={alert} setAlert={setAlert} />
      </Grid>
      <DialogTitle>
        {operation === 'create'
          ? 'Create Review'
          : operation === 'edit'
            ? 'Update Review'
            : 'Delete Review'}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{ position: 'absolute', right: 8, top: 8 }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        {operation === 'delete' ? (
          <Typography>Are you sure you want to delete this review?</Typography>
        ) : (
          <>
            <Rating
              name="rating"
              value={reviewData.rating}
              onChange={(event, newValue) => {
                setReviewData((prev) => ({ ...prev, rating: newValue }));
              }}
            />
            <TextField
              label="Comment"
              name="comment"
              value={reviewData.comment}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
              margin="normal"
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {operation === 'create'
            ? 'Submit'
            : operation === 'edit'
              ? 'Update'
              : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserReviewModal;
