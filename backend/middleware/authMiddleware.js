import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

/**
 * ==========================================
 * 🛡️ AUTHENTICATION MIDDLEWARE (PROTECT)
 * ==========================================
 * @desc    Verify JWT token and attach admin to request
 */
export const protect = async (req, res, next) => {
  let token;

  // 1. Check for token in Authorization header (Format: Bearer <token>)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get admin from the database (excluding password) and attach to req.user
      req.user = await Admin.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          message: "Not authorized, user not found" 
        });
      }

      next(); // Move to the next middleware or controller
    } catch (error) {
      console.error("❌ AUTH_MIDDLEWARE_ERROR:", error.message);
      
      return res.status(401).json({ 
        success: false, 
        message: "Not authorized, token failed or expired" 
      });
    }
  }

  // 2. If no token is found
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: "Not authorized, no token provided" 
    });
  }
};

/**
 * ==========================================
 * 👑 ROLE-BASED ACCESS (OPTIONAL)
 * ==========================================
 * If you decide to add different admin levels later (e.g., SuperAdmin)
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    next();
  };
};