import axios from "./axios";

export const linkedinLogin = (params) => {
  return axios.post("/linkedin/callback", params);
};

export const googleLogin = (params) => {
  return axios.post("/google/callback", params);
};

export const signUpUser = (params) => {
  console.log("You are in API.js");
  return axios.post("/auth", params);
};

export const signInUser = (params) => {
  return axios.post("/auth/sign_in", params);
};

export const sendResetPasswordInstruction = (params) => {
  return axios.post("/auth/password", params);
};

export const resetUserPassword = (params, customHeaders) => {
  return axios.put("/auth/password", params, { headers: { ...customHeaders } });
};

export const listAllAddresses = () => {
  return axios.get("/addresses");
};

export const createAddress = (params) => {
  return axios.post("/addresses", params);
};

export const updateAddress = (id, params) => {
  return axios.put(`/addresses/${id}`, params);
};

export const deleteShippingAddress = (id) => {
  return axios.get("/addresses", id);
};

export const makeDefaulsShippingAddress = (id) => {
  return axios.patch(`/addresses/${id}/mark_default`);
};

export const updateUserDetail = (formData) => {
  return axios.put("/update_user_details", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getUserDetail = (id) => {
  return axios.get("/get_user_details", id);
};

export const updateUserPassword = (user) => {
  return axios.put("/update_user_password", { user: user });
};

export const fetchCategory = (id) => {
  return axios.get(`/categories/${id}`);
};

export const fetchCategories = (params) => {
  return axios.get("/categories", { params: params });
};

export const fetchProducts = (category_id, params = {}) => {
  return axios.get(`/categories/${category_id}/products`, { params: params });
};

export const fetchProduct = (product_id) => {
  return axios.get(`/products/${product_id}`);
};

export const addCartItem = (formData) => {
  return axios.post("/cart_items", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const fetchCart = () => {
  return axios.get("/cart");
};

export const removeCartItem = (itemId) => {
  return axios.delete(`/cart_items/${itemId}`);
};

export const updateCartItem = (itemId, params) => {
  return axios.put(`/cart_items/${itemId}`, { cart_item: params });
};

export const createOrder = (data) => {
  return axios.post("/orders", data);
};

export const confirmOrder = (id, data) => {
  return axios.post(`/orders/${id}/confirm`, data);
};

export const fetchOrder = (orderId) => {
  return axios.get(`/orders/${orderId}`);
};

export const fetchOrders = (params) => {
  return axios.get("/orders", { params: params });
};