
import React, { useState, useRef } from 'react';
import { Camera, User, ArrowRight, ShieldCheck, Key } from 'lucide-react';

interface JoinScreenProps {
  onJoin: (name: string, avatar: string | null, isAdmin: boolean) => void;
}

const JoinScreen: React.FC<JoinScreenProps> = ({ onJoin }) => {
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isAdminValidated, setIsAdminValidated] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isSecretCodeEntered = name.trim() === "babakürdopropro";

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSecretCodeEntered && !isAdminValidated) {
      setIsAdminValidated(true);
      return;
    }

    if (isAdminValidated) {
      if (nickname.trim()) {
        onJoin(nickname.trim(), avatar, true);
      }
    } else {
      if (name.trim()) {
        onJoin(name.trim(), avatar, false);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0b141a] p-4">
      <div className={`p-8 rounded-2xl shadow-2xl w-full max-w-md text-center border transition-all duration-500 ${isAdminValidated || isSecretCodeEntered ? 'bg-rose-950/20 border-rose-500 shadow-rose-500/20' : 'bg-[#111b21] border-[#222d34]'}`}>
        
        {isAdminValidated ? (
          <ShieldCheck className="mx-auto text-rose-500 mb-2 animate-bounce" size={48} />
        ) : isSecretCodeEntered ? (
          <Key className="mx-auto text-rose-500 mb-2 animate-pulse" size={48} />
        ) : (
          <h1 className="text-3xl font-bold text-[#e9edef] mb-2 tracking-tight">WhatsApp P2P</h1>
        )}
        
        <p className={`mb-8 text-sm leading-relaxed ${isAdminValidated || isSecretCodeEntered ? 'text-rose-300 font-bold' : 'text-[#8696a0]'}`}>
          {isAdminValidated 
            ? 'KİMLİK DOĞRULANDI! ŞİMDİ GÖRÜNECEK İSMİNİZİ SEÇİN.' 
            : isSecretCodeEntered 
              ? 'GİZLİ ERİŞİM KODU TESPİT EDİLDİ!' 
              : 'Profilinizi oluşturun ve doğrudan sohbete başlayın.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`relative w-28 h-28 rounded-full bg-[#202c33] flex items-center justify-center cursor-pointer group border-2 transition-all overflow-hidden ${isAdminValidated || isSecretCodeEntered ? 'border-rose-500' : 'border-transparent hover:border-[#00a884]'}`}
            >
              {avatar ? (
                <img src={avatar} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <User size={48} className={`${isAdminValidated || isSecretCodeEntered ? 'text-rose-500' : 'text-[#8696a0]'} group-hover:scale-110 transition`} />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition">
                <Camera size={24} className="text-white mb-1" />
                <span className="text-[10px] text-white font-bold uppercase">Değiştir</span>
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              accept="image/*" 
              className="hidden" 
            />
            <p className={`mt-3 text-[11px] font-medium uppercase tracking-widest ${isAdminValidated || isSecretCodeEntered ? 'text-rose-400' : 'text-[#8696a0]'}`}>Profil Fotoğrafı</p>
          </div>

          <div className="space-y-4">
            {!isAdminValidated ? (
              <div>
                <label className={`block text-left text-[10px] font-bold uppercase mb-1.5 ml-1 ${isSecretCodeEntered ? 'text-rose-400' : 'text-[#8696a0]'}`}>
                  {isSecretCodeEntered ? 'ERİŞİM KODU' : 'İSMİNİZ'}
                </label>
                <input
                  autoFocus
                  type="text"
                  placeholder="Örn: Volkan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full text-[#e9edef] placeholder-[#8696a0] px-4 py-3.5 rounded-xl border transition shadow-sm outline-none ${isSecretCodeEntered ? 'bg-rose-900/20 border-rose-500 focus:ring-rose-500' : 'bg-[#2a3942] border-transparent focus:ring-[#00a884]'}`}
                />
              </div>
            ) : (
              <div className="animate-in slide-in-from-bottom fade-in duration-500">
                <label className="block text-left text-[10px] font-bold uppercase mb-1.5 ml-1 text-rose-400">GÖRÜNECEK TAKMA İSİM</label>
                <input
                  autoFocus
                  type="text"
                  placeholder="Diğerleri sizi ne olarak görsün?"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full text-[#e9edef] placeholder-[#8696a0] px-4 py-3.5 rounded-xl border bg-rose-900/20 border-rose-500 focus:ring-rose-500 shadow-sm outline-none"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isAdminValidated ? !nickname.trim() : !name.trim()}
            className={`w-full py-4 rounded-xl font-bold transition-all disabled:opacity-50 shadow-lg flex items-center justify-center space-x-2 active:scale-[0.98] ${isAdminValidated || isSecretCodeEntered ? 'bg-rose-600 text-white hover:bg-rose-700' : 'bg-[#00a884] text-[#111b21] hover:bg-[#008f72]'}`}
          >
            <span>
              {isAdminValidated 
                ? 'Sahip Olarak Bağlan' 
                : isSecretCodeEntered 
                  ? 'Kodu Doğrula' 
                  : 'Sohbete Başla'}
            </span>
            <ArrowRight size={18} />
          </button>
        </form>

        <p className="mt-8 text-[11px] text-[#8696a0] italic opacity-60">
          Uçtan uca şifreli, sunucusuz doğrudan bağlantı.
        </p>
      </div>
    </div>
  );
};

export default JoinScreen;
