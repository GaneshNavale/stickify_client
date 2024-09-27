import axios from "./adminAxios";

export const adminSignIn = (params) => {
  return axios.post("/admin_auth/sign_in", params);
};

export const users = (params) => {
  return axios.get("/admin/users", { params: params });
};

export const sendResetPasswordInstruction = (params) => {
  return axios.post("/admin_auth/password", params);
};

export const resetUserPassword = (params, customHeaders) => {
  return axios.put("/admin_auth/password", params, {
    headers: { ...customHeaders },
  });
};

export const createUser = (formData) => {
  return axios.post("/admin/users", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateUser = (id, formData) => {
  return axios.put(`/admin/users/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
