// src/types.ts
export interface User {
  Id: string;
  name: string;
  avatar: string;
  lastMessageTime?: Date;
  username: string
}

export interface ChatMessage {
  id: string;
  text: string;
  timestamp: string;
  sender: string;
  senderName?: string;
  senderAvatar?: string;
  status: string;
}

export interface MessageContainers {
  Id: string;
  content: string;
  participants: string[];
  sender: string;
  status: string;
}