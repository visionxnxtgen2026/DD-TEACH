import Unit from "../models/Unit.js";
import mongoose from "mongoose";

/**
 * ========================
 * 📚 1. GET ALL UNITS
 * GET /api/units?subject=ID&standard=10
 * ========================
 */
export const getUnits = async (req, res) => {
  try {
    const { subject, standard, type, isActive } = req.query;

    let filter = {};

    // 🔥 RULE Check: If type is college, return empty or notice
    if (type === "college") {
      return res.status(200).json({
        success: true,
        message: "Units are not used for the College path. Data flow skips to Topics.",
        data: []
      });
    }

    // Dynamic Filters
    if (type) filter.type = type;
    if (subject && mongoose.Types.ObjectId.isValid(subject)) filter.subject = subject;
    if (standard) filter.standard = standard;
    
    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    const units = await Unit.find(filter)
      .populate("subject", "name type")
      .sort({ order: 1, unitNumber: 1 });

    return res.status(200).json({
      success: true,
      count: units.length,
      data: units,
    });

  } catch (error) {
    console.error("❌ GET UNITS ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * ========================
 * 📘 2. GET SINGLE UNIT
 * ========================
 */
export const getUnitById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Unit ID" });
    }

    const unit = await Unit.findById(id).populate("subject", "name");

    if (!unit) {
      return res.status(404).json({ success: false, message: "Unit not found" });
    }

    return res.status(200).json({ success: true, data: unit });

  } catch (error) {
    console.error("❌ GET UNIT ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * ========================
 * ➕ 3. CREATE UNIT (Strict Path Applied)
 * ========================
 */
export const createUnit = async (req, res) => {
  try {
    const {
      title,
      subject,
      standard,
      unitNumber,
      description,
      order,
      type = "school",
    } = req.body;

    // 🔥 RULE 1: Enforce Path Logic
    if (type === "college") {
      return res.status(400).json({
        success: false,
        message: "Rule Violation: Units cannot be created for College Path. Link Topics directly to the Subject.",
      });
    }

    // Basic Validation
    if (!title || !subject || !unitNumber || !standard) {
      return res.status(400).json({
        success: false,
        message: "Title, Subject, Unit Number, and Standard are required for School units.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(subject)) {
      return res.status(400).json({ success: false, message: "Invalid Subject ID" });
    }

    // 🛡️ SMART DUPLICATE CHECK
    const exists = await Unit.findOne({ subject, unitNumber, type: "school" });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: `Unit ${unitNumber} already exists for this subject.`,
      });
    }

    // 💾 SAVE TO DB
    const unit = await Unit.create({
      title: title.trim(),
      subject,
      standard,
      unitNumber,
      type: "school",
      description: description || "",
      order: order || 0,
    });

    return res.status(201).json({ success: true, data: unit });

  } catch (error) {
    console.error("❌ CREATE UNIT ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * ========================
 * ✏️ 4. UPDATE UNIT
 * ========================
 */
export const updateUnit = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Unit ID" });
    }

    const unit = await Unit.findById(id);
    if (!unit) {
      return res.status(404).json({ success: false, message: "Unit not found" });
    }

    const { title, description, unitNumber, order, isActive } = req.body;

    // 🔄 Dynamic Updates
    if (title) unit.title = title.trim();
    if (description !== undefined) unit.description = description;
    if (unitNumber !== undefined) unit.unitNumber = unitNumber;
    if (order !== undefined) unit.order = order;
    if (isActive !== undefined) unit.isActive = isActive;

    const updated = await unit.save();
    return res.status(200).json({ success: true, data: updated });

  } catch (error) {
    console.error("❌ UPDATE UNIT ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * ========================
 * ❌ 5. DELETE UNIT
 * ========================
 */
export const deleteUnit = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Unit ID" });
    }

    const unit = await Unit.findById(id);
    if (!unit) {
      return res.status(404).json({ success: false, message: "Unit not found" });
    }

    // 🔥 Future: Automatically delete topics linked to this unit
    await unit.deleteOne();

    return res.status(200).json({ success: true, message: "Unit deleted successfully" });

  } catch (error) {
    console.error("❌ DELETE UNIT ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};