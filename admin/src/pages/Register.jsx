import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, UserPlus, ShieldCheck } from "lucide-react";
import { API } from "../services/api";

import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function Register() {
  const navigate = useNavigate();

  // Form States
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    // Basic Validation
    if (!name || !email || !password || !confirmPassword) {
      return setError("All fields are required.");
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters long.");
    }

    try {
      setLoading(true);
      setError("");

      // 🔥 API Call to Register Admin
      const res = await API.register({ name, email, password });

      if (res.success) {
        // Redirect to login page after successful registration
        alert("Registration successful! Please login.");
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        
        {/* 🛡️ BRANDING */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-2xl shadow-lg mb-4">
            <ShieldCheck size={36} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-500 mt-2">Register as a new platform administrator</p>
        </div>

        {/* 📝 REGISTRATION CARD */}
        <Card className="shadow-xl border-t-4 border-blue-600">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 ml-1">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <User size={18} />
                </span>
                <Input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="pl-10"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <Mail size={18} />
                </span>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@example.com"
                  className="pl-10"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <Lock size={18} />
                </span>
                <Input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="pl-10"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 ml-1">Confirm Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <Lock size={18} />
                </span>
                <Input
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="pl-10"
                />
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100 animate-shake">
                ⚠️ {error}
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-lg flex items-center justify-center gap-2 mt-2"
              disabled={loading}
            >
              {loading ? (
                "Creating account..."
              ) : (
                <>
                  <UserPlus size={20} />
                  Register Admin
                </>
              )}
            </Button>
          </form>

          {/* Footer Link */}
          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-gray-500 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </Card>

        {/* Support Footer */}
        <p className="text-center text-gray-400 text-xs mt-8">
          © 2026 DD Teach Platform. All registration requests are logged.
        </p>
      </div>
    </div>
  );
}