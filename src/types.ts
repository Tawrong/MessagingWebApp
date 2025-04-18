// src/types.ts
export interface userSearch {
  Id: string;
  name: string;
  avatar: string;
  username: string;
  email: string;
  lastMessage: string
}
export interface Messages {
Id: string;
content: string;
createdAt: Date;
sender: string;
}



export interface Conversation {
  Id: string;
  participants: {
    _id: string;
    name: string;
    avatar: string;
    username: string;
  }[];
  lastMessage: {
    _id: string;
    content: string;
    messageType: string;
    sender: string;
  };
  updatedAt: string;
}

export interface MessageType {
      Id: string
      content: string;
      sender: string;
      participants: string[];
      status: string;
      createdAt: string;
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
    name: string;
    email: string;
    avatar: string;
}