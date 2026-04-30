// Make sure 'Admin' starts with a capital A and ends with .js
import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

/**
 * ==========================================
 * 🛠️ HELPER: GENERATE JWT
 * ==========================================
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token valid for 30 days
  });
};

/**
 * @desc    Register a new Admin
 * @route   POST /api/auth/register
 * @access  Public (Or Restricted based on your needs)
 */
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const adminExists = await Admin.findOne({ email });

    if (adminExists) {
      return res.status(400).json({ success: false, message: "Admin already exists" });
    }

    const admin = await Admin.create({ name, email, password });

    res.status(201).json({
      success: true,
      token: generateToken(admin._id),
      user: { id: admin._id, name: admin.name, email: admin.email },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Authenticate Admin & Get Token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // We use .select("+password") because the model hides it by default
    const admin = await Admin.findOne({ email }).select("+password");

    if (admin && (await admin.matchPassword(password))) {
      res.json({
        success: true,
        token: generateToken(admin._id),
        user: { id: admin._id, name: admin.name, email: admin.email },
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid email or password" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Get current Admin profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id);
    if (admin) {
      res.json({ success: true, data: admin });
    } else {
      res.status(404).json({ success: false, message: "Admin not found" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Forgot Password - Generate Reset Token
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email });

    if (!admin) {
      return res.status(404).json({ success: false, message: "No admin with that email" });
    }

    // Generate a random reset token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash token and set to field in DB
    admin.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Set expire (10 minutes)
    admin.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await admin.save();

    // 🔥 NOTE: In a real app, you would send an email here. 
    // For now, we return the token so you can test the flow.
    res.json({ 
      success: true, 
      message: "Email sent (Simulated)", 
      debugToken: resetToken // Remove this in production!
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Reset Password
 * @route   POST /api/auth/reset-password/:token
 * @access  Public
 */
export const resetPassword = async (req, res) => {
  try {
    // Hash the token from the URL to match the one in DB
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const admin = await Admin.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!admin) {
      return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }

    // Set new password (Model pre-save hook will hash this)
    admin.password = req.body.password;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpire = undefined;

    await admin.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};