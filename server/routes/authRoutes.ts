// This file defines the routes for user authentication, including registration and login.
import express from "express";
import { registerUser, loginUser, sendMessage, SearchUser, getConvo, getMessagebyId} from "../controllers/authController";

const router = express.Router();

// Route for user registration
router.post("/register", registerUser);

// Route for user login
router.post("/login", loginUser);
router.get("/PrivateMessages/searchuser", SearchUser)
router.post("/PrivateMessages/sendMessage", sendMessage);
router.get("/PrivateMessages/getConversation", getConvo)
router.get("/PrivateMessages/getMessage", getMessagebyId)

export default router;