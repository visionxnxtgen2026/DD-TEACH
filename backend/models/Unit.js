import mongoose from "mongoose";

const unitSchema = new mongoose.Schema(
  {
    // 📘 Unit Title (e.g., "Laws of Motion")
    title: {
      type: String,
      required: [true, "Unit title is required"],
      trim: true,
    },

    // 🔢 Unit Number (e.g., "1", "2")
    unitNumber: {
      type: String,
      required: [true, "Unit number is required"],
      trim: true,
    },

    // 🔗 Subject (Immediate Parent)
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: [true, "Subject reference is required"],
    },

    // ========================
    // 🏫 SCHOOL PATH FIELDS
    // ========================
    standard: {
      type: String, // ✅ Changed to String for consistency with Subject/Topic
      default: null,
      trim: true,
    },

    // ========================
    // 🔀 PATH TYPE
    // ========================
    // Per Rule 1: Units are primarily used in the 'school' flow.
    type: {
      type: String,
      enum: ["school", "college"],
      required: true,
      default: "school",
    },

    // ========================
    // 📝 META DATA
    // ========================
    description: {
      type: String,
      default: "",
      trim: true,
    },

    order: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// ========================
// 🔥 SMART INDEXES (REFINED)
// ========================

/**
 * 🏫 SCHOOL UNIQUE INDEX
 * Rule: Standard 10-la, Science subject-kulla, "Unit 1" oru murai dhaan irukkanum.
 * College flow-la units create panna koodadhu nu controller-la block pannirukoam,
 * so intha index partial-ah school-ku mattum work aagum.
 */
unitSchema.index(
  { subject: 1, unitNumber: 1, type: 1 },
  {
    unique: true,
    partialFilterExpression: {
      type: "school",
      standard: { $type: "string" }, // Ensures it's only for school path
    },
  }
);

/**
 * ⚡ PERFORMANCE QUERIES
 * Optimized for: GET /api/units?subject=ID
 */
unitSchema.index({ subject: 1, order: 1, unitNumber: 1 });

// ========================
// 🔄 CLEAN RESPONSE
// ========================
unitSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

export default mongoose.model("Unit", unitSchema);