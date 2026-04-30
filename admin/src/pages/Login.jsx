import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, LogIn, ShieldCheck } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      return setError("Please enter both email and password.");
    }

    try {
      setLoading(true);
      setError("");

      const success = await login(email, password);

      if (success) {
        navigate("/dashboard");
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        
        {/* 🛡️ BRANDING AREA */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-2xl shadow-lg mb-4">
            <ShieldCheck size={36} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">DD Admin</h1>
          <p className="text-gray-500 mt-2">Sign in to manage your learning platform</p>
        </div>

        {/* 🔑 LOGIN CARD */}
        <Card className="shadow-xl border-t-4 border-blue-600">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <Mail size={18} />
                </span>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="admin@example.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <Link to="/forgot-password" intrinsic="true" className="text-xs text-blue-600 hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <Lock size={18} />
                </span>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="••••••••"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
                ⚠️ {error}
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-lg flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                <>
                  <LogIn size={20} />
                  Login
                </>
              )}
            </Button>
          </form>

          {/* Footer Link */}
          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-gray-500 text-sm">
              Don't have an admin account?{" "}
              <Link to="/register" className="text-blue-600 font-semibold hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </Card>

        {/* Support Footer */}
        <p className="text-center text-gray-400 text-xs mt-8">
          © 2026 DD Teach Platform. All rights reserved.
        </p>
      </div>
    </div>
  );
}