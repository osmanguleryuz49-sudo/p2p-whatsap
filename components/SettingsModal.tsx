
import React from 'react';
import { X, Palette, Bell, Shield, User } from 'lucide-react';
import { UserSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  userBio: string;
  setUserBio: (bio: string) => void;
  badges: string[];
  isAdmin?: boolean;
}

const THEME_COLORS = ['#00a884', '#007bff', '#6f42c1', '#fd7e14', '#e83e8c', '#20c997'];
const WALLPAPERS = [
  { id: 'bg-[#0b141a]', name: 'Koyu Safir' },
  { id: 'bg-gradient-to-br from-[#0b141a] to-[#1a2a33]', name: 'Gece Mavisi' },
  { id: 'bg-gradient-to-tr from-[#121212] to-[#333333]', name: 'Endüstriyel' },
  { id: 'bg-[#1e2321]', name: 'Orman Koyu' },
];

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, updateSettings, userBio, setUserBio, badges, isAdmin }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className={`bg-[#111b21] w-full max-w-md rounded-2xl shadow-2xl border ${isAdmin ? 'border-rose-900/50' : 'border-[#222d34]'} my-auto`}>
        <div className={`flex justify-between items-center p-4 ${isAdmin ? 'bg-rose-950/20' : 'bg-[#202c33]'} border-b border-[#222d34]`}>
          <h3 className={`font-bold flex items-center gap-2 ${isAdmin ? 'text-rose-100' : ''}`}>
            <Palette size={20} className={isAdmin ? 'text-rose-500' : 'text-[#00a884]'} /> 
            {isAdmin ? 'Sahip Ayarları' : 'Gelişmiş Ayarlar'}
          </h3>
          <button onClick={onClose} className="p-1 text-[#8696a0] hover:bg-[#3b4a54] rounded-full transition"><X size={24} /></button>
        </div>

        <div className="p-5 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Profil Ayarları */}
          <section className="space-y-4">
            <h4 className={`text-[10px] font-bold uppercase flex items-center gap-2 ${isAdmin ? 'text-rose-400' : 'text-[#8696a0]'}`}>
              <User size={14}/> Profil ve Görünüm
            </h4>
            <div>
              <label className="block text-xs text-[#8696a0] mb-1">Hakkımda Mesajı</label>
              <input type="text" value={userBio} onChange={(e) => setUserBio(e.target.value)} className="w-full bg-[#2a3942] text-sm px-3 py-2 rounded-lg outline-none focus:ring-1 ring-[#00a884]" />
            </div>
            <div>
              <label className="block text-xs text-[#8696a0] mb-2">Profil Rozetin</label>
              {isAdmin ? (
                <div className="bg-rose-900/20 border border-rose-500/50 text-rose-100 px-3 py-2 rounded-lg text-sm font-bold flex items-center justify-between">
                  <span>Sitenin Sahibi</span>
                  <Shield size={14} className="text-rose-500" />
                </div>
              ) : (
                <select 
                  value={settings.userBadge} 
                  onChange={(e) => updateSettings({ userBadge: e.target.value })}
                  className="w-full bg-[#2a3942] text-sm px-3 py-2 rounded-lg outline-none"
                >
                  {badges.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              )}
            </div>
          </section>

          {/* Tema Ayarları */}
          <section className="space-y-4">
            <h4 className={`text-[10px] font-bold uppercase flex items-center gap-2 ${isAdmin ? 'text-rose-400' : 'text-[#8696a0]'}`}>
              <Palette size={14}/> Tema ve Renkler
            </h4>
            <div className="flex gap-2">
              {THEME_COLORS.map(color => (
                <button key={color} onClick={() => updateSettings({ themeColor: color })} className={`w-8 h-8 rounded-full border-2 ${settings.themeColor === color ? 'border-white' : 'border-transparent'}`} style={{ backgroundColor: color }} />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {WALLPAPERS.map(wp => (
                <button 
                  key={wp.id} 
                  onClick={() => updateSettings({ wallpaper: wp.id })}
                  className={`p-2 rounded-lg border ${settings.wallpaper === wp.id ? 'border-[#00a884] bg-[#00a884]/10' : 'border-[#3b4a54]'} text-[10px] text-center transition`}
                >
                  <div className={`w-full h-8 rounded mb-1 ${wp.id}`} />
                  {wp.name}
                </button>
              ))}
            </div>
          </section>

          {/* Gizlilik */}
          <section className="space-y-4">
            <h4 className={`text-[10px] font-bold uppercase flex items-center gap-2 ${isAdmin ? 'text-rose-400' : 'text-[#8696a0]'}`}>
              <Shield size={14}/> Gizlilik Ayarları
            </h4>
            
            <div className="flex items-center justify-between p-2 bg-[#2a3942] rounded-lg">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-[#8696a0]" />
                <span className="text-xs">"Yazıyor..." Bilgisini Gizle</span>
              </div>
              <input type="checkbox" checked={settings.hideTyping} onChange={(e) => updateSettings({ hideTyping: e.target.checked })} className="accent-[#00a884]" />
            </div>

            <div className="flex items-center justify-between p-2 bg-[#2a3942] rounded-lg">
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-[#8696a0]" />
                <span className="text-xs">Mavi Tıkları Kapat</span>
              </div>
              <input type="checkbox" checked={!settings.showBlueTicks} onChange={(e) => updateSettings({ showBlueTicks: !e.target.checked })} className="accent-[#00a884]" />
            </div>
          </section>
        </div>

        <div className="p-4 bg-[#202c33] border-t border-[#222d34] flex justify-end">
          <button onClick={onClose} className={`${isAdmin ? 'bg-rose-600 hover:bg-rose-700' : 'bg-[#00a884] hover:bg-[#008f72]'} text-white px-8 py-2 rounded-lg font-bold transition`}>
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
