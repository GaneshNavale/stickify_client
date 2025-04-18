import axios from './adminAxios';

export const adminSignIn = (params) => {
  return axios.post('/admin_auth/sign_in', params);
};

export const users = (params) => {
  return axios.get('/admin/users', { params: params });
};

export const sendResetPasswordInstruction = (params) => {
  return axios.post('/admin_auth/password', params);
};

export const resetUserPassword = (params, customHeaders) => {
  return axios.put('/admin_auth/password', params, {
    headers: { ...customHeaders },
  });
};

export const createUser = (formData) => {
  return axios.post('/admin/users', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const updateUser = (id, formData) => {
  return axios.put(`/admin/users/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const fetchCategories = (params) => {
  return axios.get('/admin/categories', { params: params });
};

export const fetchCategory = (id) => {
  return axios.get(`/admin/categories/${id}`);
};

export const createCategory = (formData) => {
  return axios.post('/admin/categories', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const updateCategory = (id, formData) => {
  return axios.put(`/admin/categories/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const createDescription = (formData) => {
  return axios.post('/admin/descriptions', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const updateDescription = (id, formData) => {
  return axios.put(`/admin/descriptions/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deleteDescription = (id, params) => {
  return axios.delete(`/admin/descriptions/${id}`, { params: params });
};

export const fetchProducts = (params) => {
  return axios.get('/admin/products', { params: params });
};

export const fetchProduct = (id) => {
  return axios.get(`/admin/products/${id}`);
};

export const createProduct = (formData) => {
  return axios.post('/admin/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const updateProduct = (id, formData) => {
  return axios.put(`/admin/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const fetchOrder = (id) => {
  return axios.get('/admin/orders/' + id);
};

export const fetchOrders = (params) => {
  return axios.get('/admin/orders', { params: params });
};

export const fetchOrderItems = (params) => {
  return axios.get('/admin/order_items', { params: params });
};

export const createShipment = (params) => {
  return axios.post('/admin/shipments', params);
};

export const fetchOrderItem = (id) => {
  return axios.get('/admin/order_items/' + id);
};

export const updateOrderItem = (id, formData) => {
  return axios.put(`/admin/order_items/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getAllMessages = (id) => {
  return axios.get(`/admin/order_items/${id}/messages`);
};

export const createMessage = (id, message) => {
  return axios.post(`/admin/order_items/${id}/messages`, message);
};

export const getReviews = ({
  page,
  per_page,
  sort_by,
  sort_order,
  status,
  product_id,
  category_id,
}) => {
  return axios.get('/admin/reviews', {
    params: {
      page,
      per_page,
      sort_by,
      sort_order,
      status,
      product_id,
      category_id,
    },
  });
};

export const updateReviewStatus = (reviewId, { status }) => {
  return axios.patch(`/admin/reviews/${reviewId}`, { status });
};
