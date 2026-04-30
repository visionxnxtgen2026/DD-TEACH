import mongoose from "mongoose";

const topicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Topic title is required"],
      trim: true,
    },
    topicNumber: {
      type: String,
      required: [true, "Topic number is required"],
      trim: true,
    },

    // ========================
    // 🔗 COMMON RELATION
    // ========================
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: [true, "Subject reference is required"],
    },

    // ========================
    // 🏫 SCHOOL PATH FIELDS
    // ========================
    unit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
      // Only required for school path
      required: function () {
        return this.type === "school";
      },
    },
    standard: {
      type: String, 
      trim: true,
      default: null,
    },

    // ========================
    // 🎓 COLLEGE PATH FIELDS
    // ========================
    stream: {
      type: String,
      trim: true,
      default: null,
    },
    semester: {
      type: Number,
      default: null,
    },

    // ========================
    // 🔀 PATH TYPE
    // ========================
    type: {
      type: String,
      enum: ["school", "college"],
      required: true,
      default: "school",
    },

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

/**
 * =====================================================================
 * 🔥 SMART INDEXES (Partial Filtering)
 * =====================================================================
 */

/**
 * 🏫 SCHOOL UNIQUENESS
 * Rule: Unique per Unit. 
 * This index IGNORES college topics because it only applies when type is "school".
 */
topicSchema.index(
  { unit: 1, topicNumber: 1 },
  { 
    unique: true, 
    partialFilterExpression: { type: "school" } 
  }
);

/**
 * 🎓 COLLEGE UNIQUENESS
 * Rule: Unique per Subject. 
 * This index IGNORES school topics because it only applies when type is "college".
 */
topicSchema.index(
  { subject: 1, topicNumber: 1 },
  { 
    unique: true, 
    partialFilterExpression: { type: "college" } 
  }
);

/**
 * ⚡ PERFORMANCE OPTIMIZATION
 */
topicSchema.index({ unit: 1, order: 1 });
topicSchema.index({ subject: 1, type: 1, order: 1 });
topicSchema.index({ type: 1, stream: 1, semester: 1 });

topicSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

export default mongoose.model("Topic", topicSchema);