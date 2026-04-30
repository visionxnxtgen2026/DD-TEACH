import express from "express";
import {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
} from "../controllers/subjectController.js";

// 🛡️ AUTH MIDDLEWARE
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * ========================
 * 📚 SUBJECT ROUTES
 * Base URL: /api/subjects
 * ========================
 */

// ------------------------
// 📥 GET ALL & ➕ CREATE
// ------------------------
router
  .route("/")
  /**
   * @desc    Get all subjects with strict filtering
   * @access  Public
   * @query   ?type=school&standard=10 
   * OR ?type=college&stream=AIML&semester=1
   */
  .get(getSubjects)

  /**
   * @desc    Create a new subject (School/College)
   * @access  Private/Admin
   */
  .post(protect, createSubject);

// ------------------------
// 📘 GET SINGLE, ✏️ UPDATE & 🗑️ DELETE
// ------------------------
router
  .route("/:id")
  /**
   * @desc    Get subject details by ID
   * @access  Public
   */
  .get(getSubjectById)

  /**
   * @desc    Update subject info, icon, or order
   * @access  Private/Admin
   */
  .put(protect, updateSubject)

  /**
   * @desc    Delete subject
   * @access  Private/Admin
   */
  .delete(protect, deleteSubject);

export default router;