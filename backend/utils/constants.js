/**
 * ========================
 * 🌐 APP CONSTANTS
 * ========================
 */
export const APP = {
  NAME: "DD Teach",
};

/**
 * ========================
 * 🏛️ INSTITUTION TYPES
 * ========================
 */
export const INSTITUTION_TYPES = {
  SCHOOL: "School",
  COLLEGE: "College"
};

/**
 * ========================
 * 📚 COMMON STANDARDS (For UI Suggestions/Defaults)
 * ========================
 */
export const COMMON_STANDARDS = {
  SCHOOL: ["6th", "7th", "8th", "9th", "10th", "11th", "12th"],
  COLLEGE: ["1st Year", "2nd Year", "3rd Year", "4th Year"]
};

/**
 * ========================
 * 📦 DATABASE COLLECTION NAMES
 * ========================
 */
export const COLLECTIONS = {
  STANDARD: "standards",
  SUBJECT: "subjects",
  UNIT: "units",
  TOPIC: "topics",
  CONTENT: "contents",
};

/**
 * ========================
 * 📂 FILE UPLOAD SETTINGS
 * ========================
 */
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB Limit
  ALLOWED_EXT: [".ppt", ".pptx"],
  ALLOWED_MIME: [
    "application/vnd.ms-powerpoint", 
    "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  ],
  UPLOAD_FOLDER: "uploads/",
};

/**
 * ========================
 * 📡 API RESPONSE MESSAGES
 * ========================
 */
export const MESSAGES = {
  // Success Messages
  SUCCESS: "Success",
  CREATED: "Created successfully",
  UPDATED: "Updated successfully",
  DELETED: "Deleted successfully",

  // Error Messages
  NOT_FOUND: "Resource not found",
  SERVER_ERROR: "Internal server error",
  VALIDATION_ERROR: "Validation failed",
  REQUIRED_FIELDS: "Required fields are missing",
  INVALID_ID: "Invalid ID format",
  DUPLICATE: "Duplicate record found",
  FILE_TYPE_ERROR: "Invalid file type. Only PPT/PPTX allowed",
};

/**
 * ========================
 * 📊 HTTP STATUS CODES
 * ========================
 */
export const STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

/**
 * ========================
 * 🔑 QUERY & MODEL DEFAULTS
 * ========================
 */
export const DEFAULTS = {
  // Pagination & Sorting Defaults
  PAGE: 1,
  LIMIT: 10,
  SORT: "createdAt",
  
  // Model Field Defaults
  ORDER: 0,
  INSTITUTION: INSTITUTION_TYPES.SCHOOL,
};

/**
 * ========================
 * 🎯 ACTIVE FLAGS
 * ========================
 */
export const FLAGS = {
  ACTIVE: true,
  INACTIVE: false,
};