import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { pool } from "./db/dbConnection.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/users.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";

const app = express();
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/attendances", attendanceRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

await pool
  .connect()
  .then(() => {
    console.log("database connected !! successfully");
  })
  .catch((err) => {
    console.error("database connection failed !!", err);
  })
  .then(() => {
    const PORT = process.env.PORT ?? 3000;
    app.listen(PORT, () => {
      console.log(`Server listening on ${PORT}`);
    });
  });
