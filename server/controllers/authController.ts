// This is the authController.ts file, which handles user authentication logic, including registration and login.
import { NextFunction, Request, Response } from "express";
import User from "../models/Users";
import jwt from "jsonwebtoken";
import mongoose, { Types } from "mongoose";
import Conversation from "../models/Conversation";
import MessageSchema from "../models/MessageSchema";

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
    await newUser.save();
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
export const SearchUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { name, myname } = req.query as { name: string; myname: string; };
  console.log("im running");

  try {
    const users = await User.find({
      $and: [
        { name: { $regex: name, $options: "i" } }, // 🔥 this is the correct syntax
        { name: { $ne: myname } }
      ]
    }).select("_id username name email avatar");

    if (users.length === 0) {
      res.status(404).json({ message: "No Users found" });
      return;
    }

    res.status(200).json({
      message: "Users Found",
      users: users.map(user => ({
        Id: user._id,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        email: user.email,
      })),
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { senderId, recipientId, content, messageType = "text" } = req.body;

    // 1. Validate required fields
    if (!senderId || !recipientId || !content) {
      throw new Error("Missing required fields: senderId, recipientId, and content are required");
    }

    // 2. Find or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recipientId] },
      conversationType: "PM"
    }).session(session);

    if (!conversation) {
      const newConversation = await Conversation.create([{
        participants: [senderId, recipientId],
        conversationType: "PM"
      }], { session });
      
      if (!newConversation || !newConversation[0]) {
        throw new Error("Failed to create conversation");
      }
      conversation = newConversation[0];
    }

    // 3. Validate conversation exists and has ID
    if (!conversation || !conversation._id) {
      throw new Error("Invalid conversation reference");
    }

    // 4. Create message
    const newMessage = await MessageSchema.create([{
      conversation: conversation._id,
      sender: senderId,
      content,
      messageType
    }], { session });

    if (!newMessage || !newMessage[0]) {
      throw new Error("Failed to create message");
    }

    // 5. Update conversation
    conversation.lastMessage = new mongoose.Types.ObjectId(newMessage[0]._id as string);
    conversation.updatedAt = new Date();
    await conversation.save({ session });

    await session.commitTransaction();

    // 6. Populate and return message
    const populatedMessage = await MessageSchema.findById(newMessage[0]._id)
      .populate('sender', 'name avatar username')
      .populate({
        path: 'conversation',
        populate: {
          path: 'participants',
          select: 'name avatar username'
        }
      });

    if (!populatedMessage) {
      throw new Error("Failed to populate message data");
    }

    res.status(201).json(populatedMessage);
  } catch (err) {
    await session.abortTransaction();
    console.error("Message send error:", err);
    res.status(500).json({ 
      message: "Failed to send message",
      error: err instanceof Error ? err.message : "Unknown error",
      details: err instanceof Error ? err.stack : undefined
    });
  } finally {
    session.endSession();
  }
};


export const getConvo = async (req: Request, res: Response, 
  next:NextFunction): Promise<void> => {
  try {
    // Get userId from query params instead of route params
    const { userId } = req.query;
    if (!userId) {
      res.status(400).json({ message: "userId is required" });
    }
       if (!Types.ObjectId.isValid(userId as string)) {
      res.status(400).json({ message: "Invalid conversationId" });
      return;
    }

    const userIdObj = new Types.ObjectId(userId as string);
    const conversations = await Conversation.find({
      participants: userIdObj,
      conversationType: "PM"
    })
    .populate({
      path: 'lastMessage',
      select: '_id conversation sender content messageType'
    })
    .populate({
      path: 'participants',
      select: '_id name avatar username'
})
    .select("_id lastMessage participants updatedAt")
    .sort({ updatedAt: -1 })
    .lean();
    res.status(200).json({
      success: true,
      message: "Conversation",
      data: conversations.map(c => ({
        Id: c._id,
        participants: c.participants,
        conversationtype: c.conversationType,
        lastMessage: c.lastMessage,
        updatedAt: c.updatedAt,
      }))
    });
    
  } catch (error) {
    console.error(error);
    if (error instanceof TypeError && error.message.includes('ObjectId')) {
      res.status(400).json({ message: "Invalid user ID format" });
      next(error);
    }
    res.status(500).json({ message: "Server error" });
  }
};

export const getMessagebyId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { conversationId } = req.query;

    if (!conversationId || typeof conversationId !== "string") {
      res.status(400).json({ message: "conversationId is required" });
      return;
    }

    if (!Types.ObjectId.isValid(conversationId)) {
      res.status(400).json({ message: "Invalid conversationId" });
      return;
    }

    const convoId = new Types.ObjectId(conversationId);

    const message = await MessageSchema.find({
      conversation: convoId,
    })
      .select("_id content sender createdAt")
      .sort({_id: 1})
      .lean();
      
    res.status(200).json({
      message: "Message",
      data: message.map((m) => ({
        Id: m._id,
        content: m.content,
        sender: m.sender,
        createdAt: m.createdAt,
      })),
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};