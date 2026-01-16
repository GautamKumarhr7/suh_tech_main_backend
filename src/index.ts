import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { pool } from "./db/dbConnection.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/users.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";
import departmentRoutes from "./routes/department.routes.js";
import designationRoutes from "./routes/designation.routes.js";
import projectRoutes from "./routes/project.routes.js";
import organizationRoutes from "./routes/organization.routes.js";
import expenseRoutes from "./routes/expense.routes.js";

const app = express();

// CORS Configuration - Allow all origins
app.use(
  cors({
    origin: true, // Allow all origins
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/auth", authRoutes);
app.use("/employee", userRoutes);
app.use("/attendances", attendanceRoutes);
app.use("/departments", departmentRoutes);
app.use("/designations", designationRoutes);
app.use("/projects", projectRoutes);
app.use("/organizations", organizationRoutes);
app.use("/expenses", expenseRoutes);

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
