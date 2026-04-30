import express from "express";
import {
  createTopic,
  getTopics,
  getTopicById,
  updateTopic,
  deleteTopic,
} from "../controllers/topicController.js";

// 🛡️ AUTH MIDDLEWARE
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * ========================
 * 📖 TOPIC ROUTES
 * Base URL: /api/topics
 * ========================
 */

// ------------------------
// 📥 GET ALL & ➕ CREATE
// ------------------------
router
  .route("/")
  /**
   * @desc    Get all topics with path-specific filtering
   * @access  Public
   * * 🔥 SCHOOL FLOW:   ?type=school&unit=ID
   * 🔥 COLLEGE FLOW:  ?type=college&subject=ID
   */
  .get(getTopics)

  /**
   * @desc    Create a new topic
   * @access  Private/Admin
   */
  .post(protect, createTopic);

// ------------------------
// 📘 GET SINGLE, ✏️ UPDATE & 🗑️ DELETE
// ------------------------
router
  .route("/:id")
  /**
   * @desc    Get single topic details with populated parent info
   * @access  Public
   */
  .get(getTopicById)

  /**
   * @desc    Update topic title, number, or order
   * @access  Private/Admin
   */
  .put(protect, updateTopic)

  /**
   * @desc    Delete topic record
   * @access  Private/Admin
   */
  .delete(protect, deleteTopic);

export default router;