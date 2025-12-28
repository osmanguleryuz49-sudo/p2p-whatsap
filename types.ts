
export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text?: string;
  image?: string;
  fileData?: string;
  fileName?: string;
  fileSize?: string;
  type: 'text' | 'image' | 'file' | 'nudge' | 'sticker' | 'secret' | 'system' | 'ascii';
  reactions?: Record<string, number>;
  timestamp: number;
  status: 'sent' | 'delivered' | 'read';
  expiresAt?: number;
  isEdited?: boolean;
  isDeleted?: boolean;
}

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  bio?: string;
  persona?: string;
  lastSeen?: string;
  status: 'online' | 'offline' | 'typing...';
  connectionStatus?: 'connecting' | 'connected' | 'disconnected';
  unreadCount: number;
  themeColor?: string;
  badge?: string;
  mood?: string;
  ip?: string; // Admin için ek bilgi
}

export interface Chat {
  contactId: string;
  lastMessage?: Message;
}

export interface ChatSession {
  contact: Contact;
  messages: Message[];
}

export interface UserSettings {
  themeColor: string;
  wallpaper: string;
  notificationsEnabled: boolean;
  fontSize: 'small' | 'medium' | 'large';
  showBlueTicks: boolean;
  funFont: boolean;
  hideTyping: boolean;
  userBadge: string;
  isAdmin?: boolean; // Admin yetkisi
}
