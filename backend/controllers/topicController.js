import Topic from "../models/Topic.js";
import mongoose from "mongoose";

/**
 * ========================
 * ➕ CREATE TOPIC
 * POST /api/topics
 * ========================
 */
export const createTopic = async (req, res) => {
  try {
    const {
      title,
      topicNumber,
      unit,
      subject,
      standard,
      stream,
      semester,
      type = "school", // 'school' or 'college'
      description,
      order,
    } = req.body;

    // 🛑 1. BASE VALIDATION
    if (!title || !topicNumber || !subject) {
      return res.status(400).json({
        success: false,
        message: "Title, Topic Number, and Subject ID are required",
      });
    }

    // 🏫 SCHOOL PATH VALIDATION (Unit is Mandatory)
    if (type === "school") {
      if (!unit || !standard) {
        return res.status(400).json({
          success: false,
          message: "Unit and Standard are required for School path",
        });
      }
      if (!mongoose.Types.ObjectId.isValid(unit)) {
        return res.status(400).json({ success: false, message: "Invalid Unit ID" });
      }
    }

    // 🎓 COLLEGE PATH VALIDATION (Unit is Not Used)
    if (type === "college" && (!stream || !semester)) {
      return res.status(400).json({
        success: false,
        message: "Stream and Semester are required for College path",
      });
    }

    // 🔥 2. DUPLICATE CHECK (Based on Path)
    let duplicateQuery = { topicNumber, type };
    if (type === "school") {
      duplicateQuery.unit = unit; // Unique per unit
    } else {
      duplicateQuery.subject = subject; // Unique per subject
    }

    const exists = await Topic.findOne(duplicateQuery);
    if (exists) {
      return res.status(400).json({
        success: false,
        message: `Topic Number ${topicNumber} already exists in this ${type === "school" ? "Unit" : "Subject"}`,
      });
    }

    // 💾 3. SAVE TO DB
    const topic = await Topic.create({
      title: title.trim(),
      topicNumber,
      unit: type === "school" ? unit : null, // College-ku unit null aayidum
      subject,
      standard: type === "school" ? standard : null,
      stream: type === "college" ? stream : null,
      semester: type === "college" ? Number(semester) : null,
      type,
      description: description || "",
      order: order || 0,
    });

    return res.status(201).json({ success: true, data: topic });

  } catch (err) {
    console.error("❌ CREATE TOPIC ERROR:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * ========================
 * 📚 GET TOPICS (STRICT FILTERING)
 * GET /api/topics?unit=ID (School) OR GET /api/topics?subject=ID (College)
 * ========================
 */
export const getTopics = async (req, res) => {
  try {
    const { unit, subject, standard, stream, semester, type, isActive } = req.query;

    let filter = {};

    // Apply filters based on what is provided in query params
    if (type) filter.type = type;
    if (isActive !== undefined) filter.isActive = isActive === "true";

    // 🏫 School Filtering Logic
    if (unit && mongoose.Types.ObjectId.isValid(unit)) filter.unit = unit;
    if (standard && mongoose.Types.ObjectId.isValid(standard)) filter.standard = standard;

    // 🎓 College Filtering Logic
    if (subject && mongoose.Types.ObjectId.isValid(subject)) filter.subject = subject;
    if (stream) filter.stream = stream;
    if (semester) filter.semester = Number(semester);

    const topics = await Topic.find(filter)
      .populate("unit", "title unitNumber")
      .populate("subject", "name type")
      .sort({ order: 1, topicNumber: 1 });

    return res.json({
      success: true,
      count: topics.length,
      data: topics,
    });

  } catch (err) {
    console.error("❌ GET TOPICS ERROR:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * ========================
 * 📘 GET SINGLE TOPIC
 * ========================
 */
export const getTopicById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Topic ID" });
    }

    const topic = await Topic.findById(id)
      .populate("unit", "title unitNumber")
      .populate("subject", "name type")
      .populate("standard", "name");

    if (!topic) {
      return res.status(404).json({ success: false, message: "Topic not found" });
    }

    return res.json({ success: true, data: topic });

  } catch (err) {
    console.error("❌ GET TOPIC ERROR:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * ========================
 * ✏️ UPDATE TOPIC
 * ========================
 */
export const updateTopic = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Topic ID" });
    }

    const topic = await Topic.findById(id);
    if (!topic) {
      return res.status(404).json({ success: false, message: "Topic not found" });
    }

    const { title, topicNumber, description, order, isActive } = req.body;

    if (title) topic.title = title.trim();
    if (topicNumber) topic.topicNumber = topicNumber;
    if (description !== undefined) topic.description = description;
    if (order !== undefined) topic.order = order;
    if (isActive !== undefined) topic.isActive = isActive;

    const updated = await topic.save();
    return res.json({ success: true, data: updated });

  } catch (err) {
    console.error("❌ UPDATE ERROR:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * ========================
 * 🗑️ DELETE TOPIC
 * ========================
 */
export const deleteTopic = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Topic ID" });
    }

    const topic = await Topic.findById(id);
    if (!topic) {
      return res.status(404).json({ success: false, message: "Topic not found" });
    }

    // 🔥 Future Tip: Delete content linked to this topic here
    await topic.deleteOne();
    return res.json({ success: true, message: "Topic deleted successfully" });

  } catch (err) {
    console.error("❌ DELETE ERROR:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};