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

export const adminSignIn = (params) => {
  return axios.post("/admin_auth/sign_in", params);
};