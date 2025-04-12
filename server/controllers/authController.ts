// This is the authController.ts file, which handles user authentication logic, including registration and login.
import { NextFunction, Request, Response } from "express";
import User from "../models/Users";
import jwt from "jsonwebtoken";
import mongoose, { isValidObjectId } from "mongoose";
import { saveMessage } from "../services/messageService";

// Register a new user
export const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { username, name, email, password, avatar } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
    res.status(400).json({ message: "User already exists" });
      return;
    }

    // Create a new user
    const newUser = new User({
      ObjectId: new mongoose.Types.ObjectId(),
      username,
      name,
      email,
      password,
      avatar,
    });

    // Save the user to the database
    await newUser.save().then(() => {
      console.log("User registered successfully:", newUser);
  });
    res.status(201).json({ message: "User registered successfully",
      user:{
        Id: newUser._id,
        username: newUser.username,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
      }
    });
  } catch (error) {
    console.error("Error registering user:", error);
    next(error); // Pass the error to the error-handling middleware
  }
};

// Login a user
export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        Id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    next(error); // Pass the error to the error-handling middleware
  }
};

// Search Users
export const SearchUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { username, myusername } = req.query as { username: string; myusername: string };

  console.log("Searching for users with username:", username, "excluding myusername:", myusername);
 

  try {
    const users = await User.find({
      $and: [
        { username: { $regex: new RegExp(username as string, "i") } },
        { username: { $ne: myusername } }
      ]
    }).select("_id username name email avatar");

    if (users.length === 0) {
      res.status(404).json({ message: "No users found" });
      return;
    }

    res.status(200).json({
      message: "Users found",
      users: users.map((user) => ({
        Id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      })),
    });

  } catch (error) {
    console.error("Error searching for users:", error);
    next(error);
  }
};

export const sendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { senderId, receiverId, content } = req.body;

    // Validate required fields
    if (!senderId || !receiverId || !content) {
      res.status(400).json({ error: 'Missing required fields: senderId, receiverId, or content' });
      return;
    }

    // Validate MongoDB ObjectId format
    if (!isValidObjectId(senderId)) {
      res.status(400).json({ error: 'Invalid senderId format' });
      return;
    }

    if (!isValidObjectId(receiverId)) {
      res.status(400).json({ error: 'Invalid receiverId format' });
      return;
    }

    // Validate content length
    if (typeof content !== 'string' || content.trim().length === 0) {
      res.status(400).json({ error: 'Message content cannot be empty' });
      return;
    }

    if (content.length > 2000) {
      res.status(400).json({ error: 'Message content too long (max 2000 characters)' });
      return;
    }

    // Save the message
    const message = await saveMessage({ senderId, receiverId, content });
    
    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: message
    });

  } catch (error) {
    console.error('Message send error:', error);
    
    // Handle specific error types
    if (error.name === 'ValidationError') {
      res.status(400).json({ 
        error: 'Validation failed',
        details: error.errors 
      });
    } else {
      // Pass to error handling middleware
      next(error);
    }
  }
};