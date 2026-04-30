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

// 🔥 Connect DB BEFORE starting server
await connectDB();

const app = express();

/**
 * ==========================================
 * 🔥 CORE MIDDLEWARES
 * ==========================================
 */

// 📦 BODY PARSERS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📊 LOGGER (Development only)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

/**
 * ==========================================
 * 🌐 CORS CONFIGURATION (PRODUCTION READY)
 * ==========================================
 */
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.log("🚫 CORS Blocked:", origin);
        return callback(null, false);
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

// Ensure uploads folder exists
if (!fs.existsSync(uploadDir)) {
  console.log("📁 Creating uploads directory...");
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve static files
app.use("/uploads", express.static(uploadDir));

/**
 * ==========================================
 * 📡 API ROUTES
 * ==========================================
 */

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/units", unitRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/content", contentRoutes);

/**
 * ==========================================
 * 🧪 HEALTH CHECK
 * ==========================================
 */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 DD Teach API is online",
    env: process.env.NODE_ENV,
    time: new Date().toISOString(),
  });
});

/**
 * ==========================================
 * ❌ ERROR HANDLING
 * ==========================================
 */
app.use(notFound);
app.use(errorHandler);

/**
 * ==========================================
 * 🚀 START SERVER
 * ==========================================
 */
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

/**
 * ==========================================
 * 🛑 PROCESS HANDLING
 * ==========================================
 */

// DB crash / promise error
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err.message);
  server.close(() => process.exit(1));
});

// Code crash
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err.message);
  process.exit(1);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("🛑 Shutting down...");
  server.close(() => process.exit(0));
});