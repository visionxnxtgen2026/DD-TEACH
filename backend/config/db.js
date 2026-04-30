import mongoose from "mongoose";

/**
 * ==========================================
 * 🗄️ MONGODB CONNECTION MANAGER (IMPROVED)
 * ==========================================
 */

let isConnected = false; // 🔥 prevent multiple connections

const connectDB = async () => {
  // 1️⃣ ENV CHECK
  if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is missing in environment variables");
    process.exit(1);
  }

  // 2️⃣ AVOID MULTIPLE CONNECTIONS (important for dev + hot reload)
  if (isConnected) {
    console.log("ℹ️ MongoDB already connected");
    return;
  }

  try {
    /**
     * 🔥 CONNECT TO MONGODB
     */
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      autoIndex: process.env.NODE_ENV !== "production",
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;

    console.log(`🟢 MongoDB Connected: ${conn.connection.host}`);

    /**
     * ==========================================
     * 📡 CONNECTION EVENTS (REGISTER ONCE)
     * ==========================================
     */
    mongoose.connection.on("error", (err) => {
      console.error("🔴 MongoDB Error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("🟡 MongoDB Disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("🟢 MongoDB Reconnected");
    });

  } catch (error) {
    console.error("❌ Initial DB Connection Failed:", error.message);

    /**
     * 🔁 RETRY LOGIC (IMPORTANT FOR RENDER STARTUP)
     */
    console.log("⏳ Retrying DB connection in 5 seconds...");
    setTimeout(connectDB, 5000);
  }
};

/**
 * ==========================================
 * 🛑 GRACEFUL SHUTDOWN (REGISTER ONCE)
 * ==========================================
 */
process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    console.log("🔌 MongoDB Connection Closed (SIGINT)");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error closing DB:", err.message);
    process.exit(1);
  }
});

process.on("SIGTERM", async () => {
  try {
    await mongoose.connection.close();
    console.log("🔌 MongoDB Connection Closed (SIGTERM)");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error closing DB:", err.message);
    process.exit(1);
  }
});

export default connectDB;