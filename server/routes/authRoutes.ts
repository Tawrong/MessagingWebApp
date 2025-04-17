// This file defines the routes for user authentication, including registration and login.
import express from "express";
import { registerUser, loginUser, getMessagesByConversation, sendMessage, SearchUser, getConvo} from "../controllers/authController";

const router = express.Router();

// Route for user registration
router.post("/register", registerUser);

// Route for user login
router.post("/login", loginUser);
router.get("/PrivateMessages/searchuser", SearchUser)
router.get("/PrivateMessages/GetMessagebyConvo", getMessagesByConversation);
router.post("/PrivateMessages/sendMessage", sendMessage);
router.get("/PrivateMessages/getConversation", getConvo)

export default router;