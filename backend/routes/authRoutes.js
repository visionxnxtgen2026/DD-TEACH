import express from "express";
import {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

// 🔥 Import the middleware to protect private routes
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * ==========================================
 * 🔐 AUTHENTICATION ROUTES
 * ==========================================
 * Base URL: /api/auth
 */

// @desc    Register a new admin
// @route   POST /api/auth/register
router.post("/register", register);

// @desc    Authenticate admin & get token
// @route   POST /api/auth/login
router.post("/login", login);

// @desc    Get current admin profile (Private)
// @route   GET /api/auth/me
// Uses 'protect' middleware to verify the JWT token
router.get("/me", protect, getMe);

// @desc    Forgot Password - Request reset link
// @route   POST /api/auth/forgot-password
router.post("/forgot-password", forgotPassword);

// @desc    Reset Password - Set new password via token
// @route   POST /api/auth/reset-password/:token
router.post("/reset-password/:token", resetPassword);

export default router;