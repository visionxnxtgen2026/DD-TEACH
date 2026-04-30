import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Send, ShieldCheck, CheckCircle2 } from "lucide-react";
import { API } from "../services/api";

import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      return setError("Please enter your registered email address.");
    }

    try {
      setLoading(true);
      setError("");

      // 🔥 API Call to trigger reset email
      const res = await API.forgotPassword({ email });

      if (res.success) {
        setIsSubmitted(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset link. Please try again.");
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
          <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
          <p className="text-gray-500 mt-2">Recover your admin access</p>
        </div>

        {/* 📧 FORGOT PASSWORD CARD */}
        <Card className="shadow-xl border-t-4 border-blue-600">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <p className="text-gray-600 text-sm leading-relaxed">
                Enter your email address below and we'll send you a link to reset your password.
              </p>

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
                  "Sending..."
                ) : (
                  <>
                    <Send size={18} />
                    Send Reset Link
                  </>
                )}
              </Button>
            </form>
          ) : (
            /* ✅ SUCCESS STATE */
            <div className="text-center py-4 space-y-4 animate-in fade-in zoom-in duration-300">
              <div className="flex justify-center">
                <CheckCircle2 size={64} className="text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Email Sent!</h2>
              <p className="text-gray-500 text-sm">
                We have sent a password reset link to <br />
                <span className="font-semibold text-gray-700">{email}</span>
              </p>
              <div className="pt-4">
                <Button 
                  onClick={() => setIsSubmitted(false)} 
                  variant="outline" 
                  size="sm"
                  className="text-gray-500"
                >
                  Didn't get the email? Try again
                </Button>
              </div>
            </div>
          )}

          {/* Back to Login Link */}
          <div className="mt-6 pt-6 border-t text-center">
            <Link to="/login" className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline text-sm">
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          </div>
        </Card>

        {/* Support Footer */}
        <p className="text-center text-gray-400 text-xs mt-8">
          If you're having trouble, please contact system support.
        </p>
      </div>
    </div>
  );
}