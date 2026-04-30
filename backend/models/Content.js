import mongoose from "mongoose";

const contentSchema = new mongoose.Schema(
  {
    // ========================
    // 🔗 RELATION
    // ========================
    // Links this content directly to a specific topic
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
      required: [true, "Topic reference is required"],
    },

    // ========================
    // 🔀 PATH TYPE (SCHOOL / COLLEGE)
    // ========================
    // Helps in filtering global stats and student flow
    type: {
      type: String,
      enum: ["school", "college"],
      required: [true, "Content type (school or college) is required"],
      default: "school",
    },

    // ========================
    // 🎯 ROLE FILTER
    // ========================
    // Can be used if you want to show different content to teachers vs students
    role: {
      type: String,
      enum: ["student", "teacher"], // 🔥 Fixed: Changed 'college' to 'teacher'
      default: "student",
    },

    // ========================
    // 📄 PPT / DOCUMENT URL
    // ========================
    pptUrl: {
      type: String,
      default: "",
      trim: true,
    },

    // ========================
    // ▶️ YOUTUBE URL
    // ========================
    youtubeUrl: {
      type: String,
      default: "",
      trim: true,
      validate: {
        validator: function (v) {
          // Allows empty string or a valid URL
          return (
            v === "" ||
            /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/.test(v)
          );
        },
        message: "Please enter a valid YouTube URL (e.g., https://youtube.com/watch?v=...)",
      },
    },

    // ========================
    // 📝 TEXT CONTENT / NOTES
    // ========================
    // Useful for quick summary or markdown content
    notes: {
      type: String,
      default: "",
      trim: true,
    },

    // ========================
    // 📂 EXTRA RESOURCES
    // ========================
    // Array of external links (e.g., Reference websites, PDFs)
    resources: [
      {
        title: {
          type: String,
          trim: true,
          required: true,
        },
        url: {
          type: String,
          trim: true,
          required: true,
        },
      },
    ],

    // ========================
    // 👁️ STATUS
    // ========================
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// ========================
// 🔥 DATABASE INDEXES
// ========================

// ✅ CRITICAL: Ensure only ONE content record per topic.
// This prevents multiple admins from adding double content to the same topic.
contentSchema.index({ topic: 1 }, { unique: true });

// ⚡ PERFORMANCE: Fast filtering by path and role
contentSchema.index({ type: 1, role: 1, isActive: 1 });

// ========================
// 🔄 CLEAN RESPONSE
// ========================
// Automatically removes the internal Mongoose version key when sending data to Frontend
contentSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

export default mongoose.model("Content", contentSchema);