import mongoose from "mongoose";

/**
 * ==========================================
 * 🗄️ MONGODB CONNECTION MANAGER
 * ==========================================
 */
const connectDB = async () => {
  // 1️⃣ Environment Variable Check
  if (!process.env.MONGO_URI) {
    console.error("❌ Error: MONGO_URI is not defined in .env file");
    process.exit(1);
  }

  try {
    /**
     * 🔥 LIFECYCLE EVENT LISTENERS
     * Monitoring the connection state in real-time
     */
    mongoose.connection.on("connected", () => {
      console.log("🟢 MongoDB Connection: [ACTIVE]");
    });

    mongoose.connection.on("error", (err) => {
      console.error(`🔴 MongoDB Runtime Error: ${err.message}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("🟡 MongoDB Connection: [LOST/DISCONNECTED]");
    });

    /**
     * 🛑 GRACEFUL SHUTDOWN
     * Ctrl+C kudukum bodhu connection-ah safe-ah close pannum
     */
    process.on("SIGINT", async () => {
      try {
        await mongoose.connection.close();
        console.log("🔌 MongoDB Connection Closed Gracefully");
        process.exit(0);
      } catch (err) {
        console.error("❌ Error during DB closure:", err);
        process.exit(1);
      }
    });

    // 2️⃣ INITIATE CONNECTION
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      /**
       * Performance Tip: 
       * autoIndex-ah production-la false pandradhu database write performance-ah increase pannum.
       */
      autoIndex: process.env.NODE_ENV !== "production",
      // Connect timeout and socket settings (Optional but good for stability)
      serverSelectionTimeoutMS: 5000, 
      socketTimeoutMS: 45000,
    });

    console.log(`✅ Database Connected: ${conn.connection.host}`);

  } catch (error) {
    console.error(`❌ DB Initial Connection Failed: ${error.message}`);
    
    // Initial connection fail aana server run aagadhu.
    // 5 seconds wait panni exit aagurathu oru nalla practice.
    setTimeout(() => {
      process.exit(1);
    }, 5000);
  }
};

export default connectDB;