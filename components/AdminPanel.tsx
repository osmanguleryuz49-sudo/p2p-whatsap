
import React from 'react';
import { X, Users, Activity, ShieldCheck, Wifi, Globe } from 'lucide-react';
import { ChatSession } from '../types';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: Record<string, ChatSession>;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose, sessions }) => {
  if (!isOpen) return null;

  const totalSessions = Object.keys(sessions).length;
  const activeSessions = Object.values(sessions).filter(s => s.contact.status === 'online').length;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="bg-[#111b21] w-full max-w-2xl rounded-2xl shadow-2xl border border-rose-900/50 overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-4 bg-rose-950/20 border-b border-rose-900/30 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-rose-500" />
            <h2 className="font-bold text-rose-100 uppercase tracking-tighter">Sitenin Sahibi - Kontrol Merkezi</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-rose-900/20 rounded-full transition text-rose-300"><X size={24} /></button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* İstatistikler */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#202c33] p-4 rounded-xl border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <Users size={16} className="text-blue-400" />
                <span className="text-[10px] text-gray-500 font-bold uppercase">Toplam Peer</span>
              </div>
              <p className="text-2xl font-black text-white">{totalSessions}</p>
            </div>
            <div className="bg-[#202c33] p-4 rounded-xl border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <Wifi size={16} className="text-green-400" />
                <span className="text-[10px] text-gray-500 font-bold uppercase">Aktif Bağlantı</span>
              </div>
              <p className="text-2xl font-black text-white">{activeSessions}</p>
            </div>
            <div className="bg-[#202c33] p-4 rounded-xl border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <Globe size={16} className="text-purple-400" />
                <span className="text-[10px] text-gray-500 font-bold uppercase">Sistem Durumu</span>
              </div>
              <p className="text-xl font-bold text-green-500 flex items-center gap-2">
                <Activity size={14} className="animate-pulse" /> Stabil
              </p>
            </div>
          </div>

          {/* Aktif Kullanıcı Listesi */}
          <div>
            <h3 className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-4">Ağdaki Kullanıcılar</h3>
            <div className="space-y-2">
              {totalSessions === 0 ? (
                <div className="text-center py-10 bg-[#202c33] rounded-xl border border-dashed border-white/10">
                  <p className="text-gray-500 text-sm italic">Henüz bir bağlantı tespit edilemedi.</p>
                </div>
              ) : (
                Object.values(sessions).map(s => (
                  <div key={s.contact.id} className="bg-[#202c33] p-3 rounded-lg flex items-center justify-between border border-white/5 hover:border-rose-500/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <img src={s.contact.avatar} className="w-8 h-8 rounded-full border border-white/10" />
                      <div>
                        <p className="text-sm font-bold text-white">{s.contact.name}</p>
                        <p className="text-[10px] text-gray-500 font-mono">{s.contact.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400">{s.messages.length} mesaj</p>
                        <p className={`text-[10px] font-bold ${s.contact.status === 'online' ? 'text-green-500' : 'text-gray-600'}`}>
                          {s.contact.status.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="p-4 bg-rose-950/10 border-t border-rose-900/20 text-center">
          <p className="text-[10px] text-rose-400/60 font-mono">OWNER PANEL - ACCESS AUTHORIZED</p>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
