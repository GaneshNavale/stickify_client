// src/hooks/useAuth.jsx

import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
import * as API from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("stickify_user", null);
  const [cart, setCart] = useState({ items: [] });
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const response = await API.fetchCart();
      setCart(response.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };
  // call this function when you want to authenticate the user
  const login = async (data) => {
    setUser(data);
    fetchCart();
  };

  // call this function to sign out logged in user
  const logout = () => {
    setUser(null);
    navigate("/", { replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, cart, setCart }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
