import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/database.config";
import authRoutes from "./Modules/Authentication/Auth.routes";
import invoiceRoutes from "./Modules/Invoice/Invoice.routes";
import transactionRoutes from "./Modules/Transaction/Transaction.routes";
import walletRoutes from "./Modules/Wallet/Wallet.routes";
import { errorHandler } from "./middlewares/errorHandler.middleware";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://magle-frontend.vercel.app",
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Routes
app.get("/", (_req, res) => {
  res.json({ status: "success", message: "Maglo API is running 🚀" });
});

app.use("/api/auth", authRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/wallets", walletRoutes);

// 404 Handler
app.use((_req, res) => {
  res.status(404).json({ status: "fail", message: "Route not found" });
});

// Global Error Handler
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`\n🚀 Maglo API running on http://localhost:${PORT}`);
      console.log(`\n📋 Auth endpoints:`);
      console.log(`   POST   /api/auth/register`);
      console.log(`   POST   /api/auth/login`);
      console.log(`   POST   /api/auth/logout`);
      console.log(`\n📋 Invoice endpoints:`);
      console.log(`   GET    /api/invoices`);
      console.log(`   POST   /api/invoices`);
      console.log(`\n📋 Transaction endpoints:`);
      console.log(`   GET    /api/transactions`);
      console.log(`   POST   /api/transactions`);
      console.log(`\n📋 Wallet endpoints:`);
      console.log(`   GET    /api/wallets`);
      console.log(`   POST   /api/wallets\n`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
