import Subject from "../models/Subject.js";
import mongoose from "mongoose";

/**
 * ========================
 * ➕ CREATE SUBJECT
 * POST /api/subjects
 * ========================
 */
export const createSubject = async (req, res) => {
  try {
    const {
      name,
      standard,
      stream,
      semester,
      type = "school", // Default path
      icon,
      order,
    } = req.body;

    // 🛑 1. REQUIRED FIELD VALIDATION
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Subject name is required" });
    }

    // 🏫 SCHOOL PATH VALIDATION
    if (type === "school" && !standard) {
      return res.status(400).json({ success: false, message: "Standard is required for School path" });
    }

    // 🎓 COLLEGE PATH VALIDATION
    if (type === "college" && (!stream || !semester)) {
      return res.status(400).json({ success: false, message: "Stream and Semester are required for College path" });
    }

    // 🔥 2. DUPLICATE CHECK (Composite Logic)
    // Trim and case-insensitive check is handled by regex or exact match
    let duplicateQuery = { 
      name: { $regex: new RegExp(`^${name.trim()}$`, "i") }, 
      type 
    };

    if (type === "school") {
      duplicateQuery.standard = standard;
    } else {
      duplicateQuery.stream = stream;
      duplicateQuery.semester = Number(semester);
    }

    const exists = await Subject.findOne(duplicateQuery);
    if (exists) {
      return res.status(400).json({ 
        success: false, 
        message: `Subject '${name}' already exists for this ${type === "school" ? "standard" : "stream/sem"}` 
      });
    }

    // 💾 3. SAVE TO DATABASE
    const subject = await Subject.create({
      name: name.trim(),
      standard: type === "school" ? standard : null,
      stream: type === "college" ? stream : null,
      semester: type === "college" ? Number(semester) : null,
      type,
      icon: icon || "",
      order: order || 0,
    });

    return res.status(201).json({ success: true, data: subject });

  } catch (err) {
    console.error("❌ CREATE SUBJECT ERROR:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * ========================
 * 📚 GET SUBJECTS (STRICT FILTERING)
 * GET /api/subjects?type=college&stream=AIML
 * ========================
 */
export const getSubjects = async (req, res) => {
  try {
    const { standard, stream, semester, type, isActive } = req.query;

    let filter = {};

    // Global Active Filter
    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    // 🔥 4. PATH SEPARATION LOGIC
    if (type === "school") {
      filter.type = "school";
      if (standard) filter.standard = standard;
    } 
    else if (type === "college") {
      filter.type = "college";
      if (stream) filter.stream = stream;
      if (semester) filter.semester = Number(semester);
    }

    const subjects = await Subject.find(filter).sort({ order: 1, createdAt: -1 });

    return res.json({
      success: true,
      count: subjects.length,
      data: subjects
    });

  } catch (err) {
    console.error("❌ GET SUBJECTS ERROR:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * ========================
 * 📘 GET SUBJECT BY ID
 * ========================
 */
export const getSubjectById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Subject ID format" });
    }

    const subject = await Subject.findById(id);

    if (!subject) {
      return res.status(404).json({ success: false, message: "Subject not found" });
    }

    return res.json({ success: true, data: subject });

  } catch (err) {
    console.error("❌ GET BY ID ERROR:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * ========================
 * ✏️ UPDATE SUBJECT (WITH DATA CLEANUP)
 * ========================
 */
export const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Subject ID" });
    }

    const subject = await Subject.findById(id);
    if (!subject) {
      return res.status(404).json({ success: false, message: "Subject not found" });
    }

    const {
      name,
      standard,
      stream,
      semester,
      type,
      icon,
      order,
      isActive,
    } = req.body;

    // 🔄 Update Basic Fields
    if (name) subject.name = name.trim();
    if (icon !== undefined) subject.icon = icon;
    if (order !== undefined) subject.order = order;
    if (isActive !== undefined) subject.isActive = isActive;

    // 🔥 5. PATH TYPE LOGIC & CLEANUP
    // If admin changes the path type, we must nullify the other path's fields
    if (type) subject.type = type;

    if (subject.type === "school") {
      if (standard !== undefined) subject.standard = standard;
      subject.stream = null;
      subject.semester = null;
    } else {
      if (stream !== undefined) subject.stream = stream;
      if (semester !== undefined) subject.semester = Number(semester);
      subject.standard = null;
    }

    const updated = await subject.save();
    return res.json({ success: true, data: updated });

  } catch (err) {
    console.error("❌ UPDATE ERROR:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * ========================
 * 🗑️ DELETE SUBJECT
 * ========================
 */
export const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    const subject = await Subject.findById(id);
    if (!subject) {
      return res.status(404).json({ success: false, message: "Subject not found" });
    }

    // 🔥 Future Tip: Delete units, topics, and content linked to this subject here if needed.
    await subject.deleteOne();
    
    return res.json({ success: true, message: "Subject deleted successfully" });

  } catch (err) {
    console.error("❌ DELETE ERROR:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};