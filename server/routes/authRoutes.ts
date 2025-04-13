// This file defines the routes for user authentication, including registration and login.
import express from "express";
import { registerUser, loginUser, SearchUser, sendMessage, SearchInbox } from "../controllers/authController";

const router = express.Router();

// Route for user registration
router.post("/register", registerUser);

// Route for user login
router.post("/login", loginUser);
router.get("/PrivateChats/searchUser", SearchUser)
router.post("/PrivateChats/Messages", sendMessage);
router.get("/PrivateChats/SearchInbox", SearchInbox);
export default router;