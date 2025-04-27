import { io, Socket } from "socket.io-client";
import { Conversation, Message } from "./types";

// Environment configuration
const URL = `${import.meta.env.VITE_BACKEND_URL}`; // Remove /PrivateChats from URL

// Type definitions for better TypeScript support
interface ServerToClientEvents {
  "new-message": (msg: Message) => void;
  "updated-inbox": (convo: Conversation) => void;
}

interface ClientToServerEvents {
  "join-conversation": (conversationId: string) => void;
  "leave-conversation": (conversationId: string) => void;
}

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(URL, {
  autoConnect: false,
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  randomizationFactor: 0.5,
  transports: ["websocket", "polling"],
  query: {
    clientType: "web"
  }
});

// Connection management utility functions
export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

// Debugging listeners (remove in production)
socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("Socket disconnected:", reason);
});

socket.on("connect_error", (err) => {
  console.error("Socket connection error:", err.message);
});

socket.io.on("reconnect_attempt", (attempt) => {
  console.log(`Reconnection attempt ${attempt}`);
});

socket.io.on("reconnect_failed", () => {
  console.error("Reconnection failed");
});