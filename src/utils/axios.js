import axios from "axios";

// Load user data from localStorage
let user = window.localStorage.getItem("reviews_user");
user = user ? JSON.parse(user) : null;

// Create axios instance
const instance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Authorization": user?.token,
  },
});

export default instance;
