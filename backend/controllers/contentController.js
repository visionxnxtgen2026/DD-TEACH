import Content from "../models/Content.js";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

/**
 * ========================
 * ➕ CREATE CONTENT
 * POST /api/content
 * ========================
 */
export const createContent = async (req, res) => {
  try {
    const {
      topic,
      youtubeUrl,
      notes,
      resources,
      type, // 'school' or 'college'
      role, // 'student' or 'teacher' (optional)
    } = req.body;

    // 🛑 VALIDATION
    if (!topic || topic === "undefined" || topic === "null") {
      return res.status(400).json({ success: false, message: "Topic ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(topic)) {
      return res.status(400).json({ success: false, message: "Invalid Topic ID format" });
    }

    // 🛡️ PREVENT DUPLICATE (1 Topic = 1 Content record)
    const exists = await Content.findOne({ topic });
    if (exists) {
      return res.status(400).json({ success: false, message: "Content already exists for this topic. Use Update instead." });
    }

    // 📁 FILE HANDLING (Multer)
    let pptUrl = "";
    if (req.file && req.file.filename) {
      pptUrl = `/uploads/${req.file.filename}`;
    }

    // ⚠️ AT LEAST ONE CONTENT TYPE REQUIRED
    if (!pptUrl && !youtubeUrl && !notes && (!resources || resources.length === 0)) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one material (PPT, YouTube, Notes, or Resources)",
      });
    }

    // 💾 SAVE TO DB
    const content = await Content.create({
      topic,
      pptUrl,
      youtubeUrl: youtubeUrl || "",
      notes: notes || "",
      resources: resources || [],
      type: type || "school",
      role: role || "student",
    });

    return res.status(201).json({ success: true, data: content });

  } catch (err) {
    console.error("❌ CREATE CONTENT ERROR:", err);
    if (err.name === "MulterError") {
      return res.status(400).json({ success: false, message: `Upload Error: ${err.message}` });
    }
    return res.status(500).json({ success: false, message: err.message || "Server Error" });
  }
};

/**
 * ========================
 * 📚 GET CONTENT BY TOPIC
 * GET /api/content?topic=ID
 * ========================
 */
export const getContent = async (req, res) => {
  try {
    const { topic, type, role } = req.query;

    if (!topic || !mongoose.Types.ObjectId.isValid(topic)) {
      return res.status(400).json({ success: false, message: "Valid Topic ID is required" });
    }

    let filter = { topic };
    if (type) filter.type = type;
    if (role) filter.role = role;

    /**
     * 💡 DEEP POPULATION LOGIC
     * School Path: Topic -> Unit -> Subject
     * College Path: Topic -> Subject (Unit will be null)
     */
    const content = await Content.findOne(filter).populate({
      path: "topic",
      populate: [
        { path: "unit", select: "title unitNumber" }, // Only exists for School
        { path: "subject", select: "name type stream semester" } // Important for both
      ],
    });

    if (!content) {
      return res.status(404).json({ success: false, message: "No content found for this topic" });
    }

    return res.status(200).json({ success: true, data: content });

  } catch (err) {
    console.error("❌ GET CONTENT ERROR:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * ========================
 * 📘 GET CONTENT BY PRIMARY ID
 * GET /api/content/:id
 * ========================
 */
export const getContentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Content ID" });
    }

    const content = await Content.findById(id).populate({
      path: "topic",
      populate: { path: "subject", select: "name" }
    });

    if (!content) {
      return res.status(404).json({ success: false, message: "Content not found" });
    }

    return res.status(200).json({ success: true, data: content });

  } catch (err) {
    console.error("❌ GET BY ID ERROR:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * ========================
 * ✏️ UPDATE CONTENT
 * PUT /api/content/:id
 * ========================
 */
export const updateContent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Content ID" });
    }

    const content = await Content.findById(id);
    if (!content) {
      return res.status(404).json({ success: false, message: "Content not found" });
    }

    const { youtubeUrl, notes, resources, isActive, type, role } = req.body;

    // 🔄 FILE REPLACEMENT (Delete old file if new one is uploaded)
    if (req.file && req.file.filename) {
      if (content.pptUrl && content.pptUrl.startsWith("/uploads/")) {
        const oldPath = path.join(process.cwd(), content.pptUrl);
        fs.unlink(oldPath, (err) => {
          if (err) console.error("⚠️ Failed to delete old PPT file:", err.message);
        });
      }
      content.pptUrl = `/uploads/${req.file.filename}`;
    }

    // 📝 FIELD UPDATES
    if (youtubeUrl !== undefined) content.youtubeUrl = youtubeUrl;
    if (notes !== undefined) content.notes = notes;
    if (resources !== undefined) content.resources = resources;
    if (isActive !== undefined) content.isActive = isActive;
    if (type !== undefined) content.type = type;
    if (role !== undefined) content.role = role;

    const updated = await content.save();

    return res.status(200).json({ success: true, data: updated });

  } catch (err) {
    console.error("❌ UPDATE CONTENT ERROR:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * ========================
 * 🗑️ DELETE CONTENT
 * DELETE /api/content/:id
 * ========================
 */
export const deleteContent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Content ID" });
    }

    const content = await Content.findById(id);
    if (!content) {
      return res.status(404).json({ success: false, message: "Content not found" });
    }

    // 🗑️ DELETE PHYSICAL FILE FROM SERVER
    if (content.pptUrl && content.pptUrl.startsWith("/uploads/")) {
      const filePath = path.join(process.cwd(), content.pptUrl);
      fs.unlink(filePath, (err) => {
        if (err) console.error("⚠️ Failed to delete PPT file from storage:", err.message);
      });
    }

    await content.deleteOne();

    return res.status(200).json({ success: true, message: "Content and associated files deleted successfully" });

  } catch (err) {
    console.error("❌ DELETE CONTENT ERROR:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};