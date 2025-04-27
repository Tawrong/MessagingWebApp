// File: server/index.ts
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectToDatabase from "./config/database";
import authRoutes from "./routes/authRoutes";
import { startMessageChangeStream } from "./services/PrivateMessageStream";
import { Server } from "socket.io";
import http from 'http';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173/PrivateChats", // Frontend origin
    methods: ["GET", "POST"],
    credentials: true,
  }
});

app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173",
}));

connectToDatabase().then(() => {
  startMessageChangeStream(io); // Start watching messages
});

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
