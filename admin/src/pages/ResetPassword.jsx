import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Lock, ShieldCheck, CheckCircle2, ArrowRight, AlertCircle } from "lucide-react";
import { API } from "../services/api";

import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function ResetPassword() {
  const { token } = useParams(); // Grabs the reset token from the URL
  const navigate = useNavigate();

  // Form States
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!password || !confirmPassword) {
      return setError("Please fill in both password fields.");
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

      // 🔥 API Call to update the password using the token
      const res = await API.resetPassword(token, { password });

      if (res.success) {
        setIsSuccess(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Link expired or invalid. Please request a new one.");
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
          <h1 className="text-3xl font-bold text-gray-900">New Password</h1>
          <p className="text-gray-500 mt-2">Create a secure password for your account</p>
        </div>

        {/* 🔐 RESET CARD */}
        <Card className="shadow-xl border-t-4 border-blue-600">
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* New Password */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700 ml-1">New Password</label>
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

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700 ml-1">Confirm New Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <Lock size={18} />
                  </span>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                    placeholder="••••••••"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100 flex items-center gap-2">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-lg flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          ) : (
            /* ✅ SUCCESS STATE */
            <div className="text-center py-4 space-y-4 animate-in fade-in zoom-in duration-300">
              <div className="flex justify-center">
                <CheckCircle2 size={64} className="text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Success!</h2>
              <p className="text-gray-500 text-sm">
                Your password has been reset successfully. You can now log in with your new credentials.
              </p>
              <div className="pt-4">
                <Button 
                  onClick={() => navigate("/login")} 
                  className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  Go to Login
                  <ArrowRight size={18} />
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Support Footer */}
        <p className="text-center text-gray-400 text-xs mt-8">
          Need help? Contact the IT administrator.
        </p>
      </div>
    </div>
  );
}