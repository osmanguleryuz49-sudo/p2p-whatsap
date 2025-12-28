
import React, { useState } from 'react';
import { X, UserPlus, Shield } from 'lucide-react';

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (name: string) => void;
}

const NewChatModal: React.FC<NewChatModalProps> = ({ isOpen, onClose, onConnect }) => {
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onConnect(name.trim());
      setName('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b141a]/90 backdrop-blur-sm">
      <div className="bg-[#111b21] rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-[#222d34]">
        <div className="flex justify-between items-center p-5 border-b border-[#222d34] bg-[#202c33]">
          <div className="flex items-center space-x-2">
            <UserPlus size={20} className="text-[#00a884]" />
            <h3 className="text-lg font-bold text-[#e9edef]">Yeni Sohbet</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-[#3b4a54] rounded-full transition text-[#8696a0]">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-[10px] font-bold text-[#8696a0] uppercase mb-2 tracking-widest ml-1">
              ARKADAŞININ İSMİ
            </label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Örn: Mehmet"
              className="w-full bg-[#2a3942] text-[#e9edef] placeholder-[#8696a0] px-4 py-3.5 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[#00a884] transition"
            />
            <div className="mt-4 flex items-start space-x-2 text-[11px] text-[#8696a0] leading-relaxed italic bg-[#202c33] p-3 rounded-lg border border-[#3b4a54]/30">
               <Shield size={14} className="text-[#00a884] mt-0.5 flex-shrink-0" />
               <p>Bağlanmak istediğiniz kişinin uygulama üzerinde kendi ismiyle giriş yapmış olması gerekir.</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl font-semibold text-[#e9edef] hover:bg-[#202c33] border border-[#222d34] transition"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 py-3 px-4 bg-[#00a884] text-[#111b21] rounded-xl font-bold hover:bg-[#008f72] transition disabled:opacity-50"
            >
              Bağlan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewChatModal;
