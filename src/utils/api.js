import axios from "./axios";

export const linkedinLogin = (params) => {
  return axios.post("/linkedin/callback", params);
};

export const googleLogin = (params) => {
  return axios.post("/google/callback", params);
};


// Create User Apis
export const signUpUser = (params) => {
  console.log("You are in API.js");
  return axios.post("/auth", params)
}

export const signInUser = (params) => {
  return axios.post("/auth/sign_in", params)
}

export const adminLogin = (params) => {
  return axios.post("/url", params)
}

// User Account Apis
// How to check the current user ? without params
export const listAllBillingAddress = () => {
  return axios.get("/billing_addresses")
}

export const createBillingAddress = () => {
  return axios.post("/billing_addresses")
}

export const updateBillingAddress = (id) => {
  return axios.put("/billing_addresses", id)
}

export const deleteBillingAddress = (id) => {
  return axios.get("/billing_addresses", id)
}

export const listAllShippingAddress = () => {
  return axios.get("/shipping_addresses")
}

export const createShipping = () => {
  return axios.post("/shipping_addresses")
}

export const updateShippingAddress = (id) => {
  return axios.put("/shipping_addresses", id)
}

export const deleteShippingAddress = (id) => {
  return axios.get("/shipping_addresses", id)
}

export const makeDefaulsShippingAddress = (id) => {
  return axios.patch(`/shipping_addresses/${id}/mark_default`);
}


// user
export const updateUserDetail = (params) => {
  return axios.put("/update_user_details", {user:params})
}

export const getUserDetail = (id) => {
  return axios.get("/get_user_details", id)
}