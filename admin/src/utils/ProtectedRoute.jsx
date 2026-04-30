import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

/**
 * ==========================================
 * 🛡️ PROTECTED ROUTE COMPONENT
 * ==========================================
 * This wrapper checks if the admin is authenticated.
 * If not, it redirects them to the login page.
 */
export default function ProtectedRoute({ children }) {
  const { user, token, loading } = useContext(AuthContext);
  const location = useLocation();

  // 1. 🔄 SHOW LOADING SPINNER
  // While AuthContext is checking if the token in localStorage is valid
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium animate-pulse">Verifying Session...</p>
        </div>
      </div>
    );
  }

  // 2. 🚫 REDIRECT TO LOGIN
  // If there is no user or no token, send them to login.
  // We save the 'state' so we can redirect them back to the page they tried to visit.
  if (!user || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. ✅ RENDER PROTECTED CONTENT
  // If authenticated, show the dashboard/subjects/etc.
  return children;
}