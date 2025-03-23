import axios from "axios";

// Create axios instance
const instance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// Add a request interceptor to dynamically add the Authorization token
instance.interceptors.request.use(
  (config) => {
    // Get user data from localStorage
    let user = window.localStorage.getItem('stickify_user');
    let guest_cart_id = window.localStorage.getItem('stickify_user_cart');
    user = user ? JSON.parse(user) : null;
    guest_cart_id = guest_cart_id ? JSON.parse(guest_cart_id) : null;

    // If a token exists, add it to the request headers
    if (user?.token) {
      config.headers['Authorization'] = user.token;
    }
    if (guest_cart_id) {
      console.log('guest_cart_id2', guest_cart_id);
      config.headers['StickifyGuestCartId'] = guest_cart_id;
    }
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('Error in axios :', error.status);
    if (error.status == 401) {
      localStorage.removeItem('stickify_user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default instance;
