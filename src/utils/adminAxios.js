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
    let user = window.localStorage.getItem("stickify_admin_user");
    user = user ? JSON.parse(user) : null;

    // If a token exists, add it to the request headers
    if (user?.token) {
      config.headers["Authorization"] = user.token;
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
      localStorage.removeItem('stickify_admin_user');
      window.location.href = '/admin';
    }
    return Promise.reject(error);
  }
);

export default instance;
