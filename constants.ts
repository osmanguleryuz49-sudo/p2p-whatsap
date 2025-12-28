
import { Contact } from './types';

export const INITIAL_CONTACTS: Contact[] = [
  {
    id: '1',
    name: 'Merve Arslan',
    avatar: 'https://picsum.photos/seed/merve/200',
    status: 'online',
    // Added unreadCount to satisfy Contact interface requirement
    unreadCount: 0,
    bio: 'Coffee lover & Tech enthusiast ☕️💻',
    persona: 'Merve is a friendly, 28-year-old software developer from Istanbul. She is cheerful, uses emojis occasionally, and loves talking about tech, travel, and food.'
  },
  {
    id: '2',
    name: 'Can Yılmaz',
    avatar: 'https://picsum.photos/seed/can/200',
    status: 'online',
    // Added unreadCount to satisfy Contact interface requirement
    unreadCount: 0,
    bio: 'Gezgin, fotoğrafçı 📸',
    persona: 'Can is a 32-year-old photographer. He is calm, professional but warm, and speaks poetically about nature and light.'
  },
  {
    id: '3',
    name: 'Zeynep Kaya',
    avatar: 'https://picsum.photos/seed/zeynep/200',
    status: 'offline',
    // Added unreadCount to satisfy Contact interface requirement
    unreadCount: 0,
    lastSeen: 'today at 14:30',
    bio: 'Daima öğreniyorum 📚',
    persona: 'Zeynep is a PhD student in philosophy. She is deep, thoughtful, and asks insightful questions.'
  },
  {
    id: '4',
    name: 'Emre Demir',
    avatar: 'https://picsum.photos/seed/emre/200',
    status: 'online',
    // Added unreadCount to satisfy Contact interface requirement
    unreadCount: 0,
    bio: 'Basketball & Life 🏀',
    persona: 'Emre is a 21-year-old student. He uses slang, is very energetic, and loves talking about sports and music.'
  }
];
