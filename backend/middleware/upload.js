import multer from "multer";
import path from "path";
import fs from "fs";

// ========================
// 📂 ENSURE UPLOAD FOLDER EXISTS
// ========================
// Use process.cwd() to guarantee the folder is created at the project root
const uploadPath = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// ========================
// 📂 STORAGE CONFIG
// ========================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    // Sanitize the filename: keep only letters, numbers, dots, hyphens, and underscores
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "");
    
    // Add a random number alongside the timestamp to guarantee absolute uniqueness
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    
    cb(null, `${uniqueSuffix}-${sanitizedName}`);
  },
});

// ========================
// 🔒 FILE FILTER (STRICT)
// ========================
const fileFilter = (req, file, cb) => {
  // 1. Allowed Extensions
  const allowedExts = [".ppt", ".pptx"];
  const ext = path.extname(file.originalname).toLowerCase();

  // 2. Allowed MIME Types (Prevents spoofing by just renaming extensions)
  const allowedMimeTypes = [
    "application/vnd.ms-powerpoint", // .ppt
    "application/vnd.openxmlformats-officedocument.presentationml.presentation" // .pptx
  ];

  const isValidExt = allowedExts.includes(ext);
  const isValidMime = allowedMimeTypes.includes(file.mimetype);

  if (isValidExt && isValidMime) {
    cb(null, true);
  } else {
    // 🔥 Throwing a specific MulterError allows your controller to catch and format it properly
    const error = new multer.MulterError("LIMIT_UNEXPECTED_FILE");
    error.message = "Invalid file type. Only standard .PPT and .PPTX files are allowed.";
    cb(error, false);
  }
};

// ========================
// 📦 MULTER SETUP
// ========================
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 🔥 10MB limit to prevent server memory crashes
  },
});