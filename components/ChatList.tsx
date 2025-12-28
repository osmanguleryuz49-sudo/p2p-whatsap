
import React from 'react';
import { Contact, Chat } from '../types';
import { Search, MoreVertical, MessageSquarePlus } from 'lucide-react';

interface ChatListProps {
  contacts: Contact[];
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({ contacts, chats, activeChatId, onSelectChat }) => {
  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 w-full md:w-96">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-[#f0f2f5]">
        <img 
          src="https://picsum.photos/seed/user/100" 
          alt="Me" 
          className="w-10 h-10 rounded-full cursor-pointer hover:opacity-80 transition"
        />
        <div className="flex space-x-5 text-gray-500">
          <MessageSquarePlus className="w-6 h-6 cursor-pointer" />
          <MoreVertical className="w-6 h-6 cursor-pointer" />
        </div>
      </div>

      {/* Search */}
      <div className="p-2 bg-white">
        <div className="flex items-center bg-[#f0f2f5] rounded-lg px-3 py-1.5">
          <Search className="w-5 h-5 text-gray-500 mr-2" />
          <input 
            type="text" 
            placeholder="Aratın veya yeni bir sohbet başlatın"
            className="bg-transparent border-none outline-none text-sm w-full py-1"
          />
        </div>
      </div>

      {/* Chats */}
      <div className="flex-1 overflow-y-auto">
        {contacts.map((contact) => {
          const chat = chats.find(c => c.contactId === contact.id);
          const lastMsg = chat?.lastMessage;
          const isActive = activeChatId === contact.id;

          return (
            <div 
              key={contact.id}
              onClick={() => onSelectChat(contact.id)}
              className={`flex items-center p-3 cursor-pointer hover:bg-[#f5f6f6] transition-colors border-b border-gray-100 ${isActive ? 'bg-[#ebebeb]' : ''}`}
            >
              <img src={contact.avatar} alt={contact.name} className="w-12 h-12 rounded-full mr-4 object-cover" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold text-gray-900 truncate">{contact.name}</h3>
                  <span className="text-xs text-gray-500">
                    {lastMsg ? new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate mt-0.5">
                  {contact.status === 'typing...' ? <span className="text-green-600 font-medium">yazıyor...</span> : (lastMsg?.text || contact.bio)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatList;
