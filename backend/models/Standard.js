import mongoose from "mongoose";

const standardSchema = new mongoose.Schema(
  {
    // 🎓 Standard Name (6th, 7th, etc.)
    name: {
      type: String,
      required: true,
      unique: true, // no duplicate standards
      trim: true,
    },

    // 🔢 Order (for sorting: 6,7,8,9...)
    order: {
      type: Number,
      required: true,
    },

    // 👁️ Active / Inactive
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// 🔥 INDEX (fast query)
standardSchema.index({ name: 1 });

// 🔄 TO JSON CLEAN
standardSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

export default mongoose.model("Standard", standardSchema);