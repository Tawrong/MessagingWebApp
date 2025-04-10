// src/types.ts
export interface User {
  id: string;
  name: string;
  avatar: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
  lastMessage?: string;
  unreadCount?: number;
  lastMessageTime?: Date;
}

export interface ChatMessage {
  id: number;
  text: string;
  timestamp: string;
  sender: string;
  senderName?: string;
  senderAvatar?: string;
}