import React, { useEffect, useState } from 'react';
import * as API from '../utils/adminApi';
import {
  Typography,
  Divider,
  Rating,
  Box,
  Container,
  Button,
  CircularProgress,
  Grid2 as Grid,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Modal,
  IconButton,
  TablePagination,
  TableSortLabel,
  Tooltip,
} from '@mui/material';
import {
  CheckCircleOutline as CheckCircleOutlineIcon,
  HighlightOff as HighlightOffIcon,
  Pending as PendingIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

const ReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await API.getReviews({
        page: page,
        per_page: perPage,
        sort_by: sortBy,
        sort_order: sortOrder,
        status: statusFilter === 'all' ? undefined : statusFilter,
        product_id: selectedProduct,
        category_id: selectedCategory,
      });
      setReviews(response?.data?.reviews || []);
      setTotalPages(response?.data?.total_pages || 1);
    } catch (err) {
      console.error('API Error:', err);
      setError(err.message || 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsAndCategories = async () => {
    try {
      // Fetch all products
      const productsResponse = await API.fetchProducts({ filter: 'all' });
      console.log('Products Response:', productsResponse);
      if (productsResponse.data && Array.isArray(productsResponse.data)) {
        setProducts(productsResponse.data);
      } else {
        console.error(
          'Unexpected products response structure:',
          productsResponse
        );
        setError('Failed to fetch products: Unexpected response structure');
      }

      // Fetch all Categories
      const categoriesResponse = await API.fetchCategories({ filter: 'all' });
      console.log('Categories Response:', categoriesResponse);
      if (categoriesResponse.data && Array.isArray(categoriesResponse.data)) {
        setCategories(categoriesResponse.data);
      } else {
        console.error(
          'Unexpected categories response structure:',
          categoriesResponse
        );
        setError('Failed to fetch categories: Unexpected response structure');
      }
    } catch (err) {
      console.error('API Error:', err);
      setError(err.message || 'Failed to fetch products and categories');
    }
  };

  useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [
    page,
    sortBy,
    sortOrder,
    perPage,
    statusFilter,
    selectedCategory,
    selectedProduct,
  ]);

  useEffect(() => {
    if (selectedProduct) {
      const selectedProductData = products.find(
        (product) => product.id === selectedProduct
      );
      if (selectedProductData) {
        setSelectedCategory(selectedProductData.category_id);
      }
    }
  }, [selectedProduct, products]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleSort = (field) => {
    const isAsc = sortBy === field && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortBy(field);
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

  const handleOpenModal = (review) => {
    setSelectedReview(review);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedReview(null);
  };

  const handleOpenConfirmationModal = () => {
    setOpenConfirmationModal(true);
  };

  const handleCloseConfirmationModal = () => {
    setOpenConfirmationModal(false);
  };

  const handleConfirmStatusUpdate = (status) => {
    handleUpdateStatus(selectedReview.id, status);
    handleCloseConfirmationModal();
    handleCloseModal();
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Container>
      <Grid container spacing={2} sx={{ mt: 2 }} alignItems="center">
        <Grid item sx={{ xs: 12 }}>
          <Typography variant="h5" gutterBottom>
            Admin Reviews
          </Typography>
        </Grid>
        <Grid item sx={{ xs: 12 }} container spacing={2}>
          {/* Category Dropdown */}
          <Grid item sx={{ xs: 12, sm: 6, md: 4 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory || ''}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedProduct('');
                }}
                label="Category"
                sx={{ minWidth: 200 }}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Product Dropdown */}
          <Grid item sx={{ xs: 12, sm: 6, md: 4 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Product</InputLabel>
              <Select
                value={selectedProduct || ''}
                onChange={(e) => setSelectedProduct(e.target.value)}
                label="Product"
                sx={{ minWidth: 200 }}
              >
                <MenuItem value="">All Products</MenuItem>
                {products
                  .filter(
                    (product) =>
                      !selectedCategory ||
                      product.category_id === selectedCategory
                  )
                  .map((product) => (
                    <MenuItem key={product.id} value={product.id}>
                      {product.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
      <Divider sx={{ my: 2 }} />

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User Name</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Review</TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === 'rating'}
                  direction={sortBy === 'rating' ? sortOrder : 'asc'}
                  onClick={() => handleSort('rating')}
                >
                  Rating
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === 'created_at'}
                  direction={sortBy === 'created_at' ? sortOrder : 'asc'}
                  onClick={() => handleSort('created_at')}
                >
                  Posted On
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <Select
                    value={statusFilter}
                    onChange={handleStatusFilterChange}
                    displayEmpty
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : reviews.length > 0 ? (
              reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>{review.user.name}</TableCell>
                  <TableCell>{review.product.name}</TableCell>
                  <TableCell>
                    <Tooltip title={review.comment}>
                      {review.comment.length > 70
                        ? `${review.comment.substring(0, 70)}...`
                        : review.comment}
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Rating
                      value={parseFloat(review.rating)}
                      precision={0.5}
                      readOnly
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(review.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
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
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenModal(review)}>
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No reviews available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={totalPages * perPage}
        rowsPerPage={perPage}
        page={page}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handlePerPageChange}
      />

      {/* Review Details Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <IconButton
            sx={{ position: 'absolute', top: 8, right: 8 }}
            onClick={handleCloseModal}
          >
            <CloseIcon />
          </IconButton>
          {selectedReview && (
            <>
              <Typography variant="h6">{selectedReview.user.name}</Typography>
              <Rating
                value={parseFloat(selectedReview.rating)}
                precision={0.5}
                readOnly
              />
              <Typography variant="body1" sx={{ mt: 2 }}>
                {selectedReview.comment}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="contained"
                  color="success"
                  sx={{ mr: 1 }}
                  onClick={handleOpenConfirmationModal}
                >
                  Approve
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleOpenConfirmationModal}
                >
                  Reject
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        open={openConfirmationModal}
        onClose={handleCloseConfirmationModal}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <IconButton
            sx={{ position: 'absolute', top: 8, right: 8 }}
            onClick={handleCloseConfirmationModal}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" gutterBottom>
            Are you sure?
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Do you want to update the status of this review?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button
              variant="contained"
              color="success"
              onClick={() => handleConfirmStatusUpdate('approved')}
            >
              Approve
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleConfirmStatusUpdate('rejected')}
            >
              Reject
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default ReviewManagement;