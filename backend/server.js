import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import morgan from "morgan";
import helmet from "helmet"; // Added for security headers

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

// Load Environment Variables
dotenv.config();

const app = express();
const __dirname = path.resolve();

/**
 * ==========================================
 * 🛡️ SECURITY & UTILITY MIDDLEWARE
 * ==========================================
 */
app.use(helmet({ crossOriginResourcePolicy: false })); // Allows images to be served from /uploads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📊 LOGGER
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

/**
 * ==========================================
 * 🌐 CORS CONFIGURATION
 * ==========================================
 */
const allowedOrigins = [
  process.env.CLIENT_URL_ADMIN,
  process.env.CLIENT_URL_USER,
  "http://localhost:5173",
  "http://localhost:5174",
].filter(Boolean); // Removes undefined values if env vars aren't set

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like Postman or mobile apps)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`🚫 CORS Blocked: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

/**
 * ==========================================
 * 📂 STATIC FILES & DIRECTORY SETUP
 * ==========================================
 */
const uploadDir = path.join(__dirname, "uploads");

// Ensure uploads folder exists synchronously on startup
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

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

// Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 DD Teach API is online",
    version: "1.2.0",
    timestamp: new Date().toISOString(),
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
 * 🚀 SERVER STARTUP
 * ==========================================
 */
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Connect to Database
    await connectDB();
    
    // 2. Start Listening
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });

    // 3. Graceful Shutdown & Process Handling
    process.on("unhandledRejection", (err) => {
      console.error(`❌ Unhandled Rejection: ${err.message}`);
      server.close(() => process.exit(1));
    });

    process.on("SIGINT", () => {
      console.log("🛑 SIGINT received. Shutting down gracefully...");
      server.close(() => process.exit(0));
    });

  } catch (error) {
    console.error(`❌ Error starting server: ${error.message}`);
    process.exit(1);
  }
};

startServer();