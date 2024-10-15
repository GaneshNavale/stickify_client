// src/components/ProtectedRoute.js

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ element }) => {
  const { user } = useAuth();

  return user ? element : <Navigate to="/sign_in" />;
};

export default ProtectedRoute;
