
import React, { useState } from 'react';
import { Message } from '../types';
import { CheckCheck, Smile } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  isMe: boolean;
  themeColor?: string;
  onReaction?: (messageId: string, emoji: string) => void;
}

const REACTION_EMOJIS = ["❤️", "😂", "👍", "😮", "😢", "🙏"];

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isMe, themeColor = '#00a884', onReaction }) => {
  const [showPicker, setShowPicker] = useState(false);

  const renderContent = () => {
    switch (message.type) {
      case 'image':
        return <img src={message.image} className="max-w-full rounded-md max-h-72 object-cover" />;
      case 'secret':
        return <p className="text-sm italic">🤫 Gizli Mesaj: {message.text}</p>;
      default:
        return <p className="text-[14.5px] whitespace-pre-wrap">{message.text}</p>;
    }
  };

  if (message.type === 'system') {
    return (
      <div className="flex w-full justify-center my-2">
        <span className="bg-[#111b21]/60 text-[#8696a0] px-3 py-1 rounded-full text-[10px] uppercase font-bold">{message.text}</span>
      </div>
    );
  }

  return (
    <div className={`flex w-full mb-2 group ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[85%] md:max-w-[70%]`}>
        <div 
          className={`rounded-lg shadow-sm px-3 py-1.5 relative ${isMe ? 'text-white rounded-tr-none' : 'bg-[#202c33] text-[#e9edef] rounded-tl-none border border-[#3b4a54]/30'}`}
          style={isMe ? { backgroundColor: themeColor } : {}}
        >
          {renderContent()}
          
          <div className="flex items-center justify-end space-x-1 mt-1">
            <span className="text-[9px] opacity-70">{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            {isMe && <CheckCheck size={12} className={message.status === 'read' ? 'text-[#53bdeb]' : 'opacity-50'} />}
          </div>

          {/* Reaksiyon Seçici Butonu (Hover'da görünür) */}
          <button 
            onClick={() => setShowPicker(!showPicker)}
            className={`absolute top-0 ${isMe ? '-left-8' : '-right-8'} p-1 text-[#8696a0] opacity-0 group-hover:opacity-100 transition rounded-full hover:bg-[#3b4a54]`}
          >
            <Smile size={16} />
          </button>

          {/* Reaksiyon Listesi */}
          {showPicker && (
            <div className={`absolute -top-10 ${isMe ? 'right-0' : 'left-0'} flex bg-[#202c33] border border-[#3b4a54] rounded-full p-1 shadow-xl z-50 animate-in fade-in zoom-in duration-100`}>
              {REACTION_EMOJIS.map(emoji => (
                <button 
                  key={emoji} 
                  onClick={() => { onReaction?.(message.id, emoji); setShowPicker(false); }}
                  className="hover:scale-125 transition px-1"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* Eklenen Reaksiyonlar */}
          {message.reactions && Object.keys(message.reactions).length > 0 && (
            <div className={`absolute -bottom-3 ${isMe ? 'right-2' : 'left-2'} flex gap-1 bg-[#202c33] border border-[#3b4a54] rounded-full px-1.5 py-0.5 shadow-sm text-[10px]`}>
              {Object.entries(message.reactions).map(([emoji, count]) => (
                <span key={emoji}>{emoji} {count > 1 && count}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
