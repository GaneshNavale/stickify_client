import axios from './axios';

export const linkedinLogin = (params) => {
  return axios.post('/linkedin/callback', params);
};

export const googleLogin = (params) => {
  return axios.post('/google/callback', params);
};

export const signUpUser = (params) => {
  return axios.post('/auth', params);
};

export const signInUser = (params) => {
  return axios.post('/auth/sign_in', params);
};

export const sendResetPasswordInstruction = (params) => {
  return axios.post('/auth/password', params);
};

export const resetUserPassword = (params, customHeaders) => {
  return axios.put('/auth/password', params, { headers: { ...customHeaders } });
};

export const listAllAddresses = () => {
  return axios.get('/addresses');
};

export const createAddress = (params) => {
  return axios.post('/addresses', params);
};

export const updateAddress = (id, params) => {
  return axios.put(`/addresses/${id}`, params);
};

export const deleteShippingAddress = (id) => {
  return axios.get('/addresses', id);
};

export const makeDefaulsShippingAddress = (id) => {
  return axios.patch(`/addresses/${id}/mark_default`);
};

export const updateUserDetail = (formData) => {
  return axios.put('/update_user_details', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getUserDetail = (id) => {
  return axios.get('/get_user_details', id);
};

export const updateUserPassword = (user) => {
  return axios.put('/update_user_password', { user: user });
};

export const fetchCategory = (id) => {
  return axios.get(`/categories/${id}`);
};

export const fetchCategories = (params) => {
  return axios.get('/categories', { params: params });
};

export const fetchProducts = (category_id, params = {}) => {
  return axios.get(`/categories/${category_id}/products`, { params: params });
};

export const fetchProduct = (product_id) => {
  return axios.get(`/products/${product_id}`);
};

export const addCartItem = (formData) => {
  return axios.post('/cart_items', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const fetchCart = () => {
  return axios.get('/cart');
};

export const removeCartItem = (itemId) => {
  return axios.delete(`/cart_items/${itemId}`);
};

export const updateCartItem = (itemId, params) => {
  return axios.put(`/cart_items/${itemId}`, { cart_item: params });
};

export const createOrder = (data) => {
  return axios.post('/orders', data);
};

export const confirmOrder = (id, data) => {
  return axios.post(`/orders/${id}/confirm`, data);
};

export const fetchOrder = (orderId) => {
  return axios.get(`/orders/${orderId}`);
};

export const fetchOrders = (params) => {
  return axios.get('/orders', { params: params });
};

export const createReview = (productId, params) => {
  return axios.post(`/customer/products/${productId}/reviews`, params);
};

export const updateReview = (productId, reviewId, params) => {
  return axios.put(
    `/customer/products/${productId}/reviews/${reviewId}`,
    params
  );
};

export const deleteReview = (productId, reviewId) => {
  return axios.delete(`/customer/products/${productId}/reviews/${reviewId}`);
};

export const getProductReviews = (
  productId,
  { page, per_page, sort_by, sort_order }
) => {
  return axios.get(`/products/${productId}/reviews`, {
    params: {
      page,
      per_page,
      sort_by,
      sort_order,
    },
  });
};

export const getAllMessages = (id) => {
  return axios.get(`/customer/order_items/${id}/messages`);
};

export const createMessage = (id, message) => {
  return axios.post(`/customer/order_items/${id}/messages`, message);
};