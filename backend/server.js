import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import morgan from "morgan";

// 🔧 CONFIG & DB
import connectDB from "./config/db.js";

// 📦 ROUTES
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import unitRoutes from "./routes/unitRoutes.js";
import topicRoutes from "./routes/topicRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";

// ⚠️ MIDDLEWARE
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

/**
 * ==========================================
 * 🌐 INITIALIZATION & DATABASE
 * ==========================================
 */
dotenv.config();
connectDB(); // Connect to MongoDB

const app = express();

/**
 * ==========================================
 * 🔥 CORE MIDDLEWARES
 * ==========================================
 */

// 📦 BODY PARSERS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📊 LOGGER (Development Mode only)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// 🌐 CORS CONFIGURATION (🔥 UPDATED FOR PORT 5174)
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173", // Vite default
  "http://localhost:5174", // 🔥 Added for your current Vite port
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174", // 🔥 Added 127.0.0.1 variant
];

app.use(
  cors({
    origin: (origin, callback) => {
      // 💡 Allow requests with no origin (like mobile apps, curl, or Postman)
      // and allow if the origin is in our whitelist
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // Log for debugging but don't crash with a 500 error
        console.log("🚫 CORS Blocked Origin:", origin);
        callback(null, false); // Block the request gracefully
      }
    },
    credentials: true,
  })
);

/**
 * ==========================================
 * 📂 STATIC FILES & UPLOAD DIR
 * ==========================================
 */
const __dirname = path.resolve();
const uploadDir = path.join(__dirname, "uploads");

// 🔥 Ensure uploads folder exists on startup
if (!fs.existsSync(uploadDir)) {
  console.log("📁 Creating uploads directory...");
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve static files from the uploads folder
app.use("/uploads", express.static(uploadDir));

/**
 * ==========================================
 * 📡 API ROUTES
 * ==========================================
 */

// 🔐 Authentication & User Profile
app.use("/api/auth", authRoutes);

// 📊 Admin Dashboard Statistics
app.use("/api/dashboard", dashboardRoutes);

// 📚 Curriculum Hierarchy (The Monolith)
app.use("/api/subjects", subjectRoutes);
app.use("/api/units", unitRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/content", contentRoutes);

/**
 * ==========================================
 * 🧪 HEALTH CHECK & ROOT
 * ==========================================
 */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 DD Teach API is online",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

/**
 * ==========================================
 * ❌ ERROR HANDLING
 * ==========================================
 */

// 404 handler for unknown routes
app.use(notFound);

// Global error handler (handles all thrown errors)
app.use(errorHandler);

/**
 * ==========================================
 * 🚀 SERVER LIFECYCLE
 * ==========================================
 */
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `✅ Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`
  );
  console.log(`📡 API Base: http://localhost:${PORT}/api`);
});

/**
 * ==========================================
 * 🛑 PROCESS HANDLERS (Stability)
 * ==========================================
 */

// Handle Unhandled Promise Rejections (e.g. DB connection lost)
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection Error:", err.message);
  server.close(() => process.exit(1));
});

// Handle Uncaught Exceptions
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception Error:", err.message);
  process.exit(1);
});

// Graceful Shutdown (SIGINT)
process.on("SIGINT", () => {
  console.log("\n🛑 Graceful shutdown initiated...");
  server.close(() => {
    console.log("💤 Process terminated safely");
    process.exit(0);
  });
});