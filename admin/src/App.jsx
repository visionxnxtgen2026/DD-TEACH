import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

// 🔐 AUTH & SECURITY
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./utils/ProtectedRoute";

// 🔷 LAYOUT
import Layout from "./components/Layout";

// 📄 MANAGEMENT PAGES
import Dashboard from "./pages/Dashboard";
import Subjects from "./pages/Subjects";
import Units from "./pages/Units";
import Topics from "./pages/Topics";
import Content from "./pages/Content";

// 🔑 AUTH PAGES
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// 🔄 UX HELPER: SCROLL TO TOP
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// ❌ 404 PAGE
function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-gray-500 bg-gray-50">
      <h1 className="text-6xl font-black mb-2 text-gray-200">404</h1>
      <p className="text-xl font-medium">Oops! Page not found 🚫</p>
      <a href="/dashboard" className="mt-4 text-blue-600 hover:underline">
        Return to Dashboard
      </a>
    </div>
  );
}

export default function App() {

  // ✅ STEP 1 CHECK (VERY IMPORTANT)
  console.log("API URL 👉", import.meta.env.VITE_API_URL);

  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />

        <Routes>

          {/* 🔓 PUBLIC ROUTES */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* 🛡️ PROTECTED ROUTES */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="subjects" element={<Subjects />} />
            <Route path="units" element={<Units />} />
            <Route path="topics" element={<Topics />} />
            <Route path="content" element={<Content />} />
          </Route>

          {/* ❌ 404 */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}