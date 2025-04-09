// This is the authController.ts file, which handles user authentication logic, including registration and login.
import { NextFunction, Request, Response } from "express";
import User from "../models/Users";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

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


    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    next(error); // Pass the error to the error-handling middleware
  }
};

export const SearchUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { username } = req.params; // Get the username from the request parameters

  try {
    // Find users by username (case-insensitive)
    const users = await User.find({
      username: { $regex: new RegExp(username, "i") },
    }).select("username name email avatar"); // Select only the fields you want to return

    if (users.length === 0) {
      res.status(404).json({ message: "No users found" });
      return;
    }

    res.status(200).json(users);
  } catch (error) {
    console.error("Error searching for users:", error);
    next(error); // Pass the error to the error-handling middleware
  }
}

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