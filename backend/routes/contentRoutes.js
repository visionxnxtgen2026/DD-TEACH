import express from "express";
import {
  createContent,
  getContent,
  getContentById,
  updateContent,
  deleteContent,
} from "../controllers/contentController.js";

// 🔥 MIDDLEWARES
import { upload } from "../middleware/upload.js"; // Multer for PPT uploads
import { protect } from "../middleware/authMiddleware.js"; // Admin protection

const router = express.Router();

/**
 * ========================
 * 🛠️ UPLOAD DEBUG LOGGER
 * ========================
 * Frontend anupura File and Data-va backend console-la check panna help pannum.
 */
const uploadLogger = (req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    console.log("============== 📁 UPLOAD DEBUG ==============");
    console.log("📂 TARGET TOPIC:", req.body.topic || "Unknown");
    console.log("📄 FILE STATUS:", req.file ? `Received: ${req.file.originalname}` : "No file uploaded");
    console.log("🔗 YOUTUBE URL:", req.body.youtubeUrl || "None");
    console.log("==========================================");
  }
  next();
};

/**
 * ========================
 * 🎥 CONTENT ROUTES
 * ========================
 */

// ------------------------
// 📥 GET ALL & ➕ CREATE
// ------------------------
router
  .route("/")
  /**
   * @desc  Get content for a specific topic
   * @access Public (Students/Users)
   * @query ?topic=ID&type=school|college
   */
  .get(getContent)

  /**
   * @desc  Create new content (PPT/Video)
   * @access Protected (Admin Only)
   */
  .post(
    protect,            // 1. Check if Admin is logged in
    upload.single("ppt"), // 2. Handle PPT file upload (field name: 'ppt')
    uploadLogger,       // 3. Log data for debugging
    createContent       // 4. Controller Logic
  );

// ------------------------
// 📘 GET SINGLE, ✏️ UPDATE & 🗑️ DELETE
// ------------------------
router
  .route("/:id")
  /**
   * @desc  Get single content details by its own ID
   * @access Public
   */
  .get(getContentById)

  /**
   * @desc  Update existing content or replace PPT
   * @access Protected (Admin Only)
   */
  .put(
    protect,
    upload.single("ppt"), // Allow replacing the old PPT with a new one
    uploadLogger,
    updateContent
  )

  /**
   * @desc  Delete content and its physical file
   * @access Protected (Admin Only)
   */
  .delete(protect, deleteContent);

export default router;