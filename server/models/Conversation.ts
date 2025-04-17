import mongoose, { Schema, Document, model } from "mongoose";

export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[];
  lastMessage?: mongoose.Types.ObjectId;
  conversationType: "PM" | "Global" | "Group";
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema: Schema = new Schema(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
    conversationType: {
      type: String,
      enum: ["PM", "Global", "Group"],
      required: true,
    },
  },
  { timestamps: true }
);

export default model<IConversation>("Conversation", ConversationSchema);
