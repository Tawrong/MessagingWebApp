// This is the authController.ts file, which handles user authentication logic, including registration and login.
import { NextFunction, Request, Response } from "express";
import User from "../models/Users";
import jwt from "jsonwebtoken";
import mongoose, { isValidObjectId } from "mongoose";
import { saveMessage } from "../services/messageService";
import PrivateMessage from "../models/PrivateMessage";

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

export const SearchInbox = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Handle participants array (same as before)
    let participants = req.query.participants;
    if (typeof participants === 'string') {
      participants = participants.includes(',') 
        ? participants.split(',') 
        : [participants];
    }
    const participantArray = Array.isArray(participants) ? participants : [participants];

    // Convert to ObjectIDs
    const objectIDs = participantArray.map(id => new mongoose.Types.ObjectId(id as string));

    // Fixed projection - use either inclusion OR exclusion, not both
    const messages = await PrivateMessage.find({
      $and: [
        { participants: { $all: objectIDs } },
        { participants: { $size: objectIDs.length } }
      ]
    })
    .select("_id participants content sender createdAt updatedAt status") // Only inclusion
    .sort({ _id: 1 }) // Sort by createdAt in descending order
    .lean(); // Optional: returns plain JS objects

    if (messages.length === 0) {
      res.status(404).json({ message: "No messages found" });
      return;
    }

    console.log("Messages found:", messages);

    res.status(200).json({
      message: "Messages found",
      InboxSearch: messages.map((message) => ({
        Id: message._id,
        participants: message.participants,
        content: message.content,
        sender: message.sender,
        status: message.status,
      }))
    });
  } catch(err) {
    console.error("Error searching inbox:", err);
    res.status(500).json({ error: "Internal server error" });
    next(err);
  }
};

export const loadInbox = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  

  try {
    const { userId } = req.query as { userId: string };
    console.log("Searching inbox for userId:", userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: "Invalid userId" });
      return;
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const searchConversation = await PrivateMessage.find({
      $and: [
        { participants: userObjectId },
      ]
    })
      .populate('participants', '_id name email avatar')
      .select("_id participants content sender createdAt updatedAt status")
      .sort({ _id: -1 })
      .lean();

    if (searchConversation.length === 0) {
      res.status(404).json({ message: "No messages found" });
      return;
    }

    res.status(200).json({
      message: "Messages found",
      InboxSearch: searchConversation.map((message) => ({
        Id: message._id,
        participants: message.participants[1],
        content: message.content,
        sender: message.sender,
        status: message.status,
        createdAt: message.createdAt,
      }))
    });

  } catch (err) {
    console.error("Error loading inbox:", err);
    res.status(500).json({ error: "Internal server error" });
    next(err);
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