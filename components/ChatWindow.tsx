
import React, { useState, useRef, useEffect } from 'react';
// Fixed: Changed PeerContact to Contact as PeerContact is not defined in types.ts
import { Contact, Message } from '../types';
import { Send, ArrowLeft, MoreVertical, Hand, X, Image as ImageIcon, Search } from 'lucide-react';
import MessageBubble from './MessageBubble';

interface ChatWindowProps {
  // Fixed: Changed PeerContact to Contact
  contact: Contact;
  messages: Message[];
  onSend: (payload: Partial<Message>) => void;
  onEdit: (messageId: string, newText: string) => void;
  onDelete: (messageId: string) => void;
  onBack: () => void;
  isTyping: boolean;
  onTyping: (status: boolean) => void;
  themeColor: string;
  onNudge: () => void;
  onReaction: (messageId: string, emoji: string) => void;
  isDisconnected?: boolean;
  isConnecting?: boolean;
  wallpaperClass: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ 
  contact, messages, onSend, onBack, 
  isTyping, onTyping, themeColor, onNudge, onReaction,
  wallpaperClass
}) => {
  const [text, setText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const endRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const filteredMessages = searchQuery 
    ? messages.filter(m => m.text?.toLowerCase().includes(searchQuery.toLowerCase()))
    : messages;

  return (
    <div className={`flex flex-col h-full overflow-hidden relative z-10 ${wallpaperClass}`}>
      <header className="bg-[#202c33]/90 backdrop-blur-md p-3 flex justify-between items-center z-20 border-b border-[#222d34]">
        <div className="flex items-center overflow-hidden">
          <button onClick={onBack} className="md:hidden mr-2 p-1 text-[#aebac1] hover:bg-[#3b4a54] rounded-full transition"><ArrowLeft size={24}/></button>
          <img src={contact.avatar} className="w-10 h-10 rounded-full mr-3 object-cover" />
          <div className="min-w-0">
            <h3 className="font-semibold text-sm truncate">{contact.name}</h3>
            <p className="text-[10px] text-[#8696a0]">{isTyping ? "yazıyor..." : (contact.status === 'online' ? 'çevrimiçi' : 'çevrimdışı')}</p>
          </div>
        </div>
        <div className="flex space-x-2 text-[#aebac1]">
          <button onClick={() => setShowSearch(!showSearch)} className={`p-2 rounded-full transition ${showSearch ? 'text-[#00a884]' : ''}`}><Search size={20}/></button>
          <button onClick={onNudge} className="p-2 hover:text-yellow-500 transition"><Hand size={20}/></button>
          <MoreVertical className="p-2 cursor-pointer" size={20}/>
        </div>
      </header>

      {showSearch && (
        <div className="p-2 bg-[#202c33] border-b border-[#222d34] flex items-center animate-in slide-in-from-top">
          <input 
            autoFocus
            type="text" 
            placeholder="Mesajlarda ara..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-[#2a3942] rounded-lg px-3 py-1.5 text-xs outline-none"
          />
          <button onClick={() => { setShowSearch(false); setSearchQuery(''); }} className="ml-2 text-[#8696a0]"><X size={18}/></button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-2 whatsapp-bg-overlay">
        {filteredMessages.map((m) => (
          <MessageBubble key={m.id} message={m} isMe={m.senderId === 'me'} themeColor={themeColor} onReaction={onReaction} />
        ))}
        <div ref={endRef} />
      </div>

      <footer className="bg-[#202c33] p-3 flex flex-col items-center z-20 border-t border-[#222d34]">
        <div className="w-full flex items-center space-x-2">
          <div className="flex space-x-1">
            <button onClick={() => imageInputRef.current?.click()} className="p-2 text-[#aebac1] hover:bg-[#3b4a54] rounded-full transition"><ImageIcon size={22}/></button>
            <input type="file" ref={imageInputRef} onChange={(e) => {
              const f = e.target.files?.[0];
              if(f) {
                const r = new FileReader();
                r.onload = () => onSend({ image: r.result as string, type: 'image' });
                r.readAsDataURL(f);
              }
            }} accept="image/*" className="hidden" />
          </div>
          <form onSubmit={(e) => { e.preventDefault(); if(text.trim()) { onSend({ text: text.trim(), type: 'text' }); setText(''); onTyping(false); } }} className="flex-1 flex items-center space-x-2">
            <input 
              type="text"
              value={text}
              onChange={(e) => { setText(e.target.value); onTyping(true); }}
              placeholder="Mesaj yazın"
              className="flex-1 bg-[#2a3942] text-[#e9edef] rounded-lg px-4 py-2.5 text-sm outline-none"
            />
            <button 
              type="submit" 
              disabled={!text.trim()}
              className="p-3 rounded-full text-[#111b21] disabled:opacity-50 transition" 
              style={{ backgroundColor: text.trim() ? themeColor : '#3b4a54' }}
            >
              <Send size={20}/>
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
};

export default ChatWindow;
