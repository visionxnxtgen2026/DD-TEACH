import React, { createContext, useState, useEffect, useContext } from "react";
import { API } from "../services/api";

// 🛡️ Create the Context
export const AuthContext = createContext();

// 🚀 Custom Hook for easy access (Optional but recommended)
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("adminToken") || null);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // 🔍 CHECK SESSION ON LOAD
  // ==========================================
  // Runs once when the app starts to see if the saved token is still valid
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          // You should have an endpoint like /api/auth/me to get user details
          const res = await API.getProfile(); 
          setUser(res.data || res);
        } catch (err) {
          console.error("Session expired or invalid");
          logout(); // Clear bad token
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  // ==========================================
  // 🔑 LOGIN FUNCTION
  // ==========================================
  const login = async (email, password) => {
    try {
      const res = await API.login({ email, password });
      
      // Expected backend response: { success: true, token: "...", user: {...} }
      const { token: newToken, user: userData } = res.data || res;

      if (newToken) {
        localStorage.setItem("adminToken", newToken);
        setToken(newToken);
        setUser(userData);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Login failed:", err);
      throw err; // Pass error to Login.jsx to show in UI
    }
  };

  // ==========================================
  // 🚪 LOGOUT FUNCTION
  // ==========================================
  const logout = () => {
    localStorage.removeItem("adminToken");
    setToken(null);
    setUser(null);
    // Optional: navigate to login can be handled in the component or here
  };

  // ==========================================
  // 🛠️ DATA EXPOSED TO COMPONENTS
  // ==========================================
  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} 
      {/* 👆 Prevents the app from flashing "unauthorized" while checking session */}
    </AuthContext.Provider>
  );
};