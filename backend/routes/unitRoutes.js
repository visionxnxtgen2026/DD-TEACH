import express from "express";
import {
  createUnit,
  getUnits,
  getUnitById,
  updateUnit,
  deleteUnit,
} from "../controllers/unitController.js";

// 🛡️ AUTH MIDDLEWARE
// Admin token check panna use aagum
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * ========================
 * 📘 UNIT ROUTES
 * Base URL: /api/units
 * ========================
 */

// ------------------------
// 📥 GET ALL & ➕ CREATE
// ------------------------
router
  .route("/")
  /**
   * @desc    Get all units (Mainly for School Path)
   * @access  Public
   * @query   ?subject=ID&standard=10&type=school
   */
  .get(getUnits)

  /**
   * @desc    Create a new unit for a school subject
   * @access  Private/Admin
   * 🔥 Note: College path units creation is blocked in Controller
   */
  .post(protect, createUnit);

// ------------------------
// 📘 GET SINGLE, ✏️ UPDATE & 🗑️ DELETE
// ------------------------
router
  .route("/:id")
  /**
   * @desc    Get details of a specific unit
   * @access  Public
   */
  .get(getUnitById)

  /**
   * @desc    Update unit title, description, or numbering
   * @access  Private/Admin
   */
  .put(protect, updateUnit)

  /**
   * @desc    Remove unit record
   * @access  Private/Admin
   */
  .delete(protect, deleteUnit);

export default router;