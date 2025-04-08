// File: server/index.ts
import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // Import CORS
import connectToDatabase from "./config/database";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();
app.use(express.json());

// Enable CORS
app.use(cors({
  origin: "http://localhost:5173", // Allow requests from the frontend
}));

// Connect to the database
connectToDatabase();

// Use auth routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});