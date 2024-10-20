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

// User Account Apis
export const listAllBillingAddress = () => {
  return axios.get("/billing_addresses");
};

export const sendResetPasswordInstruction = (params) => {
  return axios.post("/auth/password", params);
};

export const resetUserPassword = (params, customHeaders) => {
  return axios.put("/auth/password", params, { headers: { ...customHeaders } });
};

export const createBillingAddress = (params) => {
  return axios.post("/billing_addresses", params);
};

export const updateBillingAddress = (id, params) => {
  return axios.put(`/billing_addresses/${id}`, params);
};

export const deleteBillingAddress = (id) => {
  return axios.get("/billing_addresses", id);
};

export const listAllShippingAddress = () => {
  return axios.get("/shipping_addresses");
};

export const createShippingAddress = (params) => {
  return axios.post("/shipping_addresses", params);
};

export const updateShippingAddress = (id, params) => {
  return axios.put(`/shipping_addresses/${id}`, params);
};

export const deleteShippingAddress = (id) => {
  return axios.get("/shipping_addresses", id);
};

export const makeDefaulsShippingAddress = (id) => {
  return axios.patch(`/shipping_addresses/${id}/mark_default`);
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
