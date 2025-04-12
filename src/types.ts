// src/types.ts
export interface User {
  Id: string;
  name: string;
  avatar: string;
  lastMessageTime?: Date;
  username: string
}

export interface ChatMessage {
  id: number;
  text: string;
  timestamp: string;
  sender: string;
  senderName?: string;
  senderAvatar?: string;
}