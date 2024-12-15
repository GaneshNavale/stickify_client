// src/hooks/useAuth.jsx

import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
import * as API from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("stickify_user", null);
  const [guestCartId, setGuestCartId] = useLocalStorage(
    "stickify_user_cart",
    null
  );
  const [cart, setCart] = useState({ items: [] });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, [user]);

  useEffect(() => {
    if (cart.cart_id) {
      if (user) {
        setGuestCartId(null);
      } else {
        setGuestCartId(cart.cart_id);
      }
    }
  }, [cart]);

  const fetchCart = async (data = null) => {
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
    let redirect_url = window.localStorage.getItem(
      "stick_it_up_after_login_redirect_url"
    );
    window.localStorage.removeItem("stick_it_up_after_login_redirect_url");
    if (redirect_url) {
      navigate(redirect_url, { replace: true });
    }
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
