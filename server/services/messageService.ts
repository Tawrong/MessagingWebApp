// services/messageService.ts
import PrivateMessage from "../models/PrivateMessage";

interface SaveMessageParams {
  senderId: string;
  receiverId: string;
  content: string;
}

export const saveMessage = async ({
  senderId,
  receiverId,
  content
}: SaveMessageParams) => {
  const newMessage = new PrivateMessage({
    participants: [senderId, receiverId],
    sender: senderId,
    content
  });

  return await newMessage.save();
};