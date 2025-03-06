import React, { useEffect, useState } from 'react';
import * as API from '../utils/adminApi';
import {
  Typography,
  Divider,
  Rating,
  Avatar,
  Box,
  Container,
  Button,
  Pagination,
  PaginationItem,
  Stack,
  CircularProgress,
  Grid2 as Grid,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import PendingIcon from '@mui/icons-material/Pending';

const ReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await API.getReviews({
        page,
        per_page: perPage,
        sort_by: sortBy,
        sort_order: sortOrder,
      });
      console.log('Review Response:', response);
      setReviews(response?.data?.reviews || []);
      setTotalPages(response?.data?.total_pages || 1);
    } catch (err) {
      console.error('API Error:', err);
      setError(err.message || 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [page, sortBy, sortOrder, perPage]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleSort = (field) => {
    if (field === sortBy) {
      const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
      setSortOrder(newOrder);
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handlePerPageChange = (event) => {
    setPerPage(event.target.value);
    setPage(0);
  };

  const handleUpdateStatus = async (reviewId, status) => {
    try {
      await API.updateReviewStatus(reviewId, { status });
      fetchReviews();
    } catch (err) {
      console.error('API Error:', err);
      setError(err.message || 'Failed to update review status');
    }
  };

  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Container
      maxWidth="md"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        py: 4,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '900px',
          bgcolor: 'background.paper',
          borderRadius: 2,
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item size={{ xs: 6, md: 6 }}>
            <Typography variant="h5" gutterBottom>
              Admin Reviews
            </Typography>
          </Grid>
          <Grid
            item
            size={{ xs: 6, md: 6 }}
            container
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
          >
            <Box sx={{ display: 'flex', gap: 1 }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Per Page</InputLabel>
                <Select
                  value={perPage}
                  onChange={handlePerPageChange}
                  label="Per Page"
                >
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={25}>25</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                  <MenuItem value={100}>100</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant={sortBy === 'rating' ? 'contained' : 'outlined'}
                onClick={() => handleSort('rating')}
                size="small"
                startIcon={
                  sortBy === 'rating' ? (
                    sortOrder === 'asc' ? (
                      <ArrowDownwardIcon />
                    ) : (
                      <ArrowUpwardIcon />
                    )
                  ) : null
                }
              >
                Rating
              </Button>
              <Button
                variant={sortBy === 'created_at' ? 'contained' : 'outlined'}
                onClick={() => handleSort('created_at')}
                size="small"
                startIcon={
                  sortBy === 'created_at' ? (
                    sortOrder === 'asc' ? (
                      <ArrowUpwardIcon />
                    ) : (
                      <ArrowDownwardIcon />
                    )
                  ) : null
                }
              >
                Posted On
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <Box key={review.id} sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar
                  sx={{ mr: 2 }}
                  alt={review.user.name}
                  src={review.user.avatar_image_url}
                >
                  {review.user.name.charAt(0)}
                </Avatar>
                <Typography variant="subtitle1">{review.user.name}</Typography>
              </Box>
              <Rating
                value={parseFloat(review.rating)}
                precision={0.5}
                readOnly
                size="small"
              />
              <Typography variant="body1" sx={{ mt: 1 }}>
                {review.comment}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {new Date(review.created_at).toLocaleString()}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 2 }}>
                <Chip
                  label={review.status}
                  size="small"
                  variant="outlined"
                  icon={
                    review.status === 'pending' ? (
                      <PendingIcon />
                    ) : review.status === 'approved' ? (
                      <CheckCircleOutlineIcon />
                    ) : (
                      <HighlightOffIcon />
                    )
                  }
                  sx={{
                    backgroundColor:
                      review.status === 'pending'
                        ? '#fff3e0'
                        : review.status === 'approved'
                        ? '#e8f5e9'
                        : '#ffebee',
                    color:
                      review.status === 'pending'
                        ? '#ff9800'
                        : review.status === 'approved'
                        ? '#4caf50'
                        : '#f44336',
                    mr:1
                  }}
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    color="success"
                    size="small"
                    onClick={() => handleUpdateStatus(review.id, 'approved')}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleUpdateStatus(review.id, 'rejected')}
                  >
                    Reject
                  </Button>
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
            </Box>
          ))
        ) : (
          <Typography variant="body1">No reviews available.</Typography>
        )}
        <Stack
          spacing={2}
          sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}
        >
          {totalPages > 1 && 
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              renderItem={(item) => (
                <PaginationItem
                  slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                  disabled={totalPages === 1}
                  {...item}
                />
              )}
            />
          }
        </Stack>
      </Box>
    </Container>
  );
};

export default ReviewManagement;