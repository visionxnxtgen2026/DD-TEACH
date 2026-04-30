import express from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";

// 🛡️ AUTH MIDDLEWARE
// Only logged-in admins with a valid token can access these stats
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * ==========================================
 * 📊 DASHBOARD ROUTES
 * ==========================================
 * Base URL: /api/dashboard
 */

/**
 * @route   GET /api/dashboard/stats
 * @desc    Fetch total counts for School/College subjects, Units, Topics, and Content
 * @access  Private/Admin (Protected)
 */
router.get("/stats", protect, getDashboardStats);

export default router;