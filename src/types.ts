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

export interface Participants {
  Id: string;
  content: string;
  createdAt: string;
  participants: {
    avatar: string;
    email: string;
    _id: string;
    name: string
  }
  sender: string;
  status: string;
}
export interface Message {
  Id: string;
  content: string;
  createdAt: string;
  participants: {
    _id: string;
    name: string;
    email: string;
    avatar: string;
  };
  sender: string;
  status: string;
}