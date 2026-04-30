import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    // 📘 Subject Name (e.g., Mathematics, FOAI)
    name: {
      type: String,
      required: [true, "Subject name is required"],
      trim: true,
    },

    // ========================
    // 🏫 SCHOOL PATH FIELDS
    // ========================
    standard: {
      type: String, // ✅ Simple string: "10", "12", etc.
      default: null,
      trim: true,
    },

    // ========================
    // 🎓 COLLEGE PATH FIELDS
    // ========================
    stream: {
      type: String, // e.g., "AIML", "CSE"
      trim: true,
      default: null,
    },

    semester: {
      type: Number, // e.g., 1, 2, 3
      default: null,
    },

    // ========================
    // 🔀 INSTITUTION TYPE
    // ========================
    type: {
      type: String,
      enum: ["school", "college"],
      required: true,
      default: "school",
    },

    // ========================
    // 🎨 UI & SORTING
    // ========================
    icon: {
      type: String, // URL or Icon Name
      default: "",
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
    timestamps: true, // Manages createdAt and updatedAt
  }
);

// ========================
// 🔥 DATABASE INDEXES (SAFE & SMART)
// ========================

/**
 * 🏫 SCHOOL UNIQUE INDEX
 * Rule: Standard 10-la "Maths" oru dharaba dhaan irukanum.
 * partialFilterExpression ensures this only applies to 'school' type.
 */
subjectSchema.index(
  { name: 1, standard: 1, type: 1 },
  {
    unique: true,
    partialFilterExpression: {
      type: "school",
      standard: { $type: "string" }, // Only index if standard is a string
    },
  }
);

/**
 * 🎓 COLLEGE UNIQUE INDEX
 * Rule: AIML Stream, Sem 1-la "FOAI" oru dharaba dhaan irukanum.
 */
subjectSchema.index(
  { name: 1, stream: 1, semester: 1, type: 1 },
  {
    unique: true,
    partialFilterExpression: {
      type: "college",
      stream: { $type: "string" },
      semester: { $type: "number" },
    },
  }
);

/**
 * ⚡ PERFORMANCE OPTIMIZATION
 * Speeds up dashboard and dropdown filtering queries.
 */
// Optimized for: GET /api/subjects?type=school&standard=10
subjectSchema.index({ type: 1, standard: 1, order: 1 });

// Optimized for: GET /api/subjects?type=college&stream=AIML&semester=1
subjectSchema.index({ type: 1, stream: 1, semester: 1, order: 1 });

// ========================
// 🔄 CLEAN RESPONSE
// ========================
subjectSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v; // Removes version key from API responses
  return obj;
};

export default mongoose.model("Subject", subjectSchema);