import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    const DATABASE_URI = process.env.DATABASE_URI;
    
    if (!DATABASE_URI) {
      throw new Error("DATABASE_URI is not defined in environment variables");
    }
    
    await mongoose.connect(DATABASE_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error: any) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
