// models/PrivateMessage.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IPrivateMessage extends Document {
  participants: mongoose.Types.ObjectId[]; // Array of User references
  content: string;
  sender: mongoose.Types.ObjectId;         // Reference to sender
}

const PrivateMessageSchema: Schema = new Schema(
  {
    participants: [{
      type: Schema.Types.ObjectId,
      ref: "User", // Links to User model
      required: true
    }],
    content: {
      type: String,
      required: true,
      trim: true
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { 
    timestamps: true // Adds createdAt, updatedAt automatically
  }
);

// Add index for faster queries
PrivateMessageSchema.index({ participants: 1, createdAt: -1 });

export default mongoose.model<IPrivateMessage>("PrivateMessage", PrivateMessageSchema);