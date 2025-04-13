// services/messageService.ts
import PrivateMessage from "../models/PrivateMessage";

interface SaveMessageParams {
  senderId: string;
  receiverId: string;
  content: string;
  status?: string; // Make optional since we'll set it automatically
}

export const saveMessage = async ({
  senderId,
  receiverId,
  content,
  status = "sending", // Default to "sent" if not provided
}: SaveMessageParams) => {
  try {
    // 1. First save with "sent" status
    const newMessage = new PrivateMessage({
      participants: [senderId, receiverId],
      sender: senderId,
      content,
      status // Will be "sent" unless overridden
    });

    const savedMessage = await newMessage.save();
    
    // 2. Update status to "delivered" after successful save
    const updatedMessage = await PrivateMessage.findByIdAndUpdate(
      savedMessage._id,
      { status: "delivered" },
      { new: true } // Return the updated document
    );

    return updatedMessage;
    
  } catch (error) {
    console.error("Error saving message:", error);
    throw error; // Re-throw for the caller to handle
  }
};