export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'Worker' | 'Admin';
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  workerId: string;
  workerName: string;
  lastMessageText: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}
