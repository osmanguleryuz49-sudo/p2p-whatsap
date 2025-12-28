
import React, { useState, useEffect, useRef } from 'react';
import { Peer } from 'peerjs';
import JoinScreen from './components/JoinScreen';
import ChatWindow from './components/ChatWindow';
import NewChatModal from './components/NewChatModal';
import SettingsModal from './components/SettingsModal';
import AdminPanel from './components/AdminPanel';
import { Message, Contact, ChatSession, UserSettings } from './types';
import { Wifi, UserPlus, Settings, WifiOff, ShieldCheck } from 'lucide-react';

const BADGES = ["P2P Ninja", "Emoji Kralı", "Gecelerin Yargıcı", "Hızlı Yazan", "Kod Cambazı", "Beta Yolcusu", "Efsane", "Sohbet Ustası"];
const OWNER_BADGE = "Sitenin Sahibi";

const toSafeId = (name: string): string => {
  const map: Record<string, string> = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'C', 'Ğ': 'G', 'İ': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U'
  };
  let safe = name.replace(/[çğıöşüÇĞİÖŞÜ]/g, (match) => map[match] || match);
  return safe.trim().toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
};

const App: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [userBio, setUserBio] = useState<string>('P2P dünyasında yeni bir macera!');
  const [userMood, setUserMood] = useState<string>("😊");
  const [sessions, setSessions] = useState<Record<string, ChatSession>>({});
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [typingPeers, setTypingPeers] = useState<Record<string, boolean>>({});
  const [isNudging, setIsNudging] = useState(false);
  const [emojiRain, setEmojiRain] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const userNameRef = useRef<string | null>(null);
  const userAvatarRef = useRef<string | null>(null);
  const peerRef = useRef<Peer | null>(null);
  const connectionsRef = useRef<Record<string, any>>({});

  const [settings, setSettings] = useState<UserSettings>({
    themeColor: '#00a884',
    wallpaper: 'bg-[#0b141a]',
    notificationsEnabled: true,
    fontSize: 'medium',
    showBlueTicks: true,
    funFont: false,
    hideTyping: false,
    userBadge: BADGES[0]
  });

  useEffect(() => {
    document.documentElement.style.setProperty('--accent-color', settings.themeColor);
  }, [settings.themeColor]);

  const addSystemMessage = (peerId: string, text: string) => {
    const newMessage: Message = {
      id: `sys-${Date.now()}`,
      senderId: 'system',
      senderName: 'System',
      text,
      type: 'system',
      timestamp: Date.now(),
      status: 'read',
    };

    setSessions(prev => {
      const session = prev[peerId];
      if (!session) return prev;
      return { ...prev, [peerId]: { ...session, messages: [...session.messages, newMessage] } };
    });
  };

  const handleJoin = (name: string, avatar: string | null, isPrivileged: boolean = false) => {
    const finalName = name;
    
    if (isPrivileged) {
      setIsAdmin(true);
      setSettings(prev => ({ ...prev, userBadge: OWNER_BADGE, themeColor: "#e11d48" }));
    }

    const safeName = toSafeId(finalName);
    if (!safeName) return alert("Geçersiz isim!");

    setUserName(finalName);
    userNameRef.current = finalName;
    setUserAvatar(avatar);
    userAvatarRef.current = avatar;

    const myPeerId = `p2p-direct-user-${safeName}`;
    const peer = new Peer(myPeerId, { debug: 1 });
    peerRef.current = peer;

    peer.on('open', (id) => console.log('Bağlanıldı:', id));
    peer.on('connection', (conn) => setupConnection(conn));
    peer.on('error', (err) => {
      if (err.type === 'unavailable-id') {
        alert("Bu isim şu an meşgul!");
        window.location.reload();
      } else if (err.type === 'disconnected') {
        peerRef.current?.reconnect();
      }
    });

    window.addEventListener('beforeunload', () => peer.destroy());
  };

  const setupConnection = (conn: any) => {
    if (connectionsRef.current[conn.peer] && connectionsRef.current[conn.peer].open) return;
    connectionsRef.current[conn.peer] = conn;

    setSessions(prev => ({
      ...prev,
      [conn.peer]: {
        ...prev[conn.peer],
        contact: {
          ...(prev[conn.peer]?.contact || {
            id: conn.peer,
            name: 'Bağlanıyor...',
            avatar: `https://picsum.photos/seed/${conn.peer}/200`,
            status: 'offline',
            unreadCount: 0
          }),
          connectionStatus: 'connecting'
        },
        messages: prev[conn.peer]?.messages || []
      }
    }));

    conn.on('open', () => {
      conn.send({ 
        type: 'handshake', 
        name: userNameRef.current, 
        avatar: userAvatarRef.current,
        bio: userBio,
        mood: userMood,
        themeColor: settings.themeColor,
        badge: isAdmin ? OWNER_BADGE : settings.userBadge,
        isAdmin: isAdmin
      });

      setSessions(prev => ({
        ...prev,
        [conn.peer]: {
          ...prev[conn.peer],
          contact: { ...prev[conn.peer].contact, connectionStatus: 'connected', status: 'online' }
        }
      }));
    });

    conn.on('data', (data: any) => {
      if (data.type === 'handshake') {
        setSessions(prev => {
          const ex = prev[conn.peer]?.contact;
          return {
            ...prev,
            [conn.peer]: {
              contact: {
                ...ex,
                id: conn.peer,
                name: data.name || ex?.name || 'Gizemli Kişi',
                avatar: data.avatar || ex?.avatar || `https://picsum.photos/seed/${conn.peer}/200`,
                bio: data.bio || 'Müsait',
                mood: data.mood || '😊',
                status: 'online',
                connectionStatus: 'connected',
                themeColor: data.themeColor || '#00a884',
                badge: data.isAdmin ? OWNER_BADGE : (data.badge || ""),
                unreadCount: ex?.unreadCount || 0
              },
              messages: prev[conn.peer]?.messages || []
            }
          };
        });
      } else if (data.type === 'typing') {
        setTypingPeers(prev => ({ ...prev, [conn.peer]: data.isTyping }));
      } else if (data.type === 'nudge') {
        setIsNudging(true);
        addSystemMessage(conn.peer, `Dürtüldünüz`);
        setTimeout(() => setIsNudging(false), 3000);
      } else if (data.type === 'reaction') {
        setEmojiRain(data.emoji);
        setTimeout(() => setEmojiRain(null), 3000);
        if (data.messageId) {
          setSessions(prev => {
            const s = prev[conn.peer];
            if (!s) return prev;
            return {
              ...prev,
              [conn.peer]: {
                ...s,
                messages: s.messages.map(m => {
                  if (m.id === data.messageId) {
                    const reactions = { ...(m.reactions || {}) };
                    reactions[data.emoji] = (reactions[data.emoji] || 0) + 1;
                    return { ...m, reactions };
                  }
                  return m;
                })
              }
            };
          });
        }
      } else if (['message', 'image', 'file', 'sticker', 'secret', 'ascii'].includes(data.type === 'message' ? 'text' : data.type)) {
        const newMessage: Message = {
          id: data.id || Date.now().toString(),
          senderId: conn.peer,
          senderName: data.name,
          text: data.text,
          image: data.image,
          fileData: data.fileData,
          fileName: data.fileName,
          type: data.type === 'message' ? 'text' : data.type,
          timestamp: Date.now(),
          status: settings.showBlueTicks ? 'read' : 'sent',
          expiresAt: data.expiresAt
        };

        setSessions(prev => {
          const s = prev[conn.peer];
          if (!s) return prev;
          return {
            ...prev,
            [conn.peer]: {
              ...s,
              messages: [...s.messages, newMessage],
              contact: { ...s.contact, unreadCount: activeChatId === conn.peer ? 0 : s.contact.unreadCount + 1 }
            }
          };
        });
      }
    });

    conn.on('close', () => {
      setSessions(prev => {
        if (!prev[conn.peer]) return prev;
        return { ...prev, [conn.peer]: { ...prev[conn.peer], contact: { ...prev[conn.peer].contact, status: 'offline', connectionStatus: 'disconnected' } } };
      });
      delete connectionsRef.current[conn.peer];
    });
  };

  const sendMessage = (payload: Partial<Message>) => {
    const conn = activeChatId ? connectionsRef.current[activeChatId] : null;
    if (!conn || !conn.open) return alert("Bağlantı hazır değil!");
    
    const msgId = Date.now().toString();
    const finalType = (payload.type as any) || 'text';
    const msgData = { 
      ...payload,
      id: msgId,
      type: finalType === 'text' ? 'message' : finalType,
      name: userName,
      timestamp: Date.now() 
    };
    conn.send(msgData);
    
    const newMessage: Message = {
      id: msgId, 
      senderId: 'me', 
      senderName: userName || 'Ben', 
      text: payload.text,
      image: payload.image,
      fileData: payload.fileData,
      fileName: payload.fileName,
      type: finalType,
      timestamp: Date.now(), 
      status: 'sent',
      expiresAt: payload.expiresAt
    };
    
    setSessions(prev => ({
      ...prev,
      [activeChatId!]: { ...prev[activeChatId!], messages: [...prev[activeChatId!].messages, newMessage] }
    }));
  };

  const handleReaction = (messageId: string, emoji: string) => {
    if (!activeChatId || !connectionsRef.current[activeChatId]) return;
    connectionsRef.current[activeChatId].send({ type: 'reaction', messageId, emoji });
    
    setEmojiRain(emoji);
    setTimeout(() => setEmojiRain(null), 3000);

    setSessions(prev => {
      const s = prev[activeChatId!];
      if (!s) return prev;
      return {
        ...prev,
        [activeChatId!]: {
          ...s,
          messages: s.messages.map(m => {
            if (m.id === messageId) {
              const reactions = { ...(m.reactions || {}) };
              reactions[emoji] = (reactions[emoji] || 0) + 1;
              return { ...m, reactions };
            }
            return m;
          })
        }
      };
    });
  };

  if (!userName) return <JoinScreen onJoin={handleJoin} />;

  const activeSession = activeChatId ? sessions[activeChatId] : null;

  return (
    <div className={`flex h-screen w-screen bg-[#0b141a] overflow-hidden text-[#e9edef] ${isNudging ? 'nudge-active' : ''} ${settings.funFont ? 'font-serif italic' : ''}`} style={{ '--whatsapp-green': settings.themeColor } as any}>
      {emojiRain && Array.from({ length: 20 }).map((_, i) => (
        <div key={i} className="fixed bottom-0 pointer-events-none text-4xl animate-bounce-up z-[200]" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 2}s` }}>{emojiRain}</div>
      ))}

      {isNudging && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
          <h1 className="text-8xl font-black text-red-600 animate-flash drop-shadow-[0_0_30px_rgba(255,0,0,0.8)] uppercase">DÜRTÜLDÜN!</h1>
        </div>
      )}

      <NewChatModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConnect={(name) => {
        const sid = toSafeId(name);
        const tid = `p2p-direct-user-${sid}`;
        if (tid === peerRef.current?.id) return alert("Kendinize bağlanamazsınız!");
        const c = peerRef.current?.connect(tid, { reliable: true });
        if (c) { setupConnection(c); setActiveChatId(tid); }
      }} />
      
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        settings={settings} 
        updateSettings={(s) => setSettings(prev => ({...prev, ...s}))} 
        userBio={userBio} 
        setUserBio={setUserBio}
        badges={BADGES}
        isAdmin={isAdmin}
      />

      <AdminPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} sessions={sessions} />

      <div className="flex w-full h-full md:max-w-[1600px] md:mx-auto shadow-2xl overflow-hidden relative">
        <div className={`${activeChatId ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-96 bg-[#111b21] border-r border-[#222d34] h-full`}>
          <div className="p-4 bg-[#202c33] flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img src={userAvatar || `https://picsum.photos/seed/${userName}/100`} className="w-10 h-10 rounded-full border border-[#3b4a54] object-cover" />
                <span className="absolute -bottom-1 -right-1 text-xs">{userMood}</span>
              </div>
              <div className="overflow-hidden">
                <h3 className="font-bold text-sm truncate">{userName}</h3>
                <p className="text-[10px] text-[#00a884] font-bold">{isAdmin ? OWNER_BADGE : settings.userBadge}</p>
              </div>
            </div>
            <div className="flex space-x-1">
              {isAdmin && (
                <button onClick={() => setIsAdminOpen(true)} className="p-2 text-rose-500 hover:bg-[#3b4a54] rounded-full transition"><ShieldCheck size={20} /></button>
              )}
              <button onClick={() => setIsModalOpen(true)} className="p-2 text-[#aebac1] hover:bg-[#3b4a54] rounded-full transition"><UserPlus size={20} /></button>
              <button onClick={() => setIsSettingsOpen(true)} className="p-2 text-[#aebac1] hover:bg-[#3b4a54] rounded-full transition"><Settings size={20} /></button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-[#111b21]">
            {Object.values(sessions).map((session) => (
              <div 
                key={session.contact.id}
                onClick={() => { setActiveChatId(session.contact.id); setSessions(prev => ({...prev, [session.contact.id]: {...prev[session.contact.id], contact: {...prev[session.contact.id].contact, unreadCount: 0}}})); }}
                className={`flex items-center p-3 cursor-pointer border-b border-[#222d34] hover:bg-[#202c33] ${activeChatId === session.contact.id ? 'bg-[#2a3942]' : ''}`}
              >
                <div className="relative">
                  <img src={session.contact.avatar} className="w-12 h-12 rounded-full mr-3 border border-[#3b4a54] object-cover" />
                  {session.contact.unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-[#00a884] text-[#111b21] text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-[#111b21]">{session.contact.unreadCount}</span>}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-sm truncate">{session.contact.name}</h4>
                    <span className="text-[10px] text-[#8696a0] font-bold">{session.contact.badge}</span>
                  </div>
                  <p className="text-xs text-[#8696a0] truncate">
                    {typingPeers[session.contact.id] ? <span className="text-[#00a884] font-medium animate-pulse">yazıyor...</span> : (session.messages.length > 0 ? (session.messages[session.messages.length - 1].text || "Medya") : session.contact.bio)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`${!activeChatId ? 'hidden md:flex' : 'flex'} flex-1 flex-col relative bg-[#0b141a] h-full overflow-hidden`}>
          {activeSession ? (
            <ChatWindow 
              contact={activeSession.contact} 
              messages={activeSession.messages} 
              onSend={sendMessage} 
              onEdit={() => {}} 
              onDelete={() => {}}
              onBack={() => setActiveChatId(null)}
              isTyping={typingPeers[activeSession.contact.id] || false}
              onTyping={(st) => !settings.hideTyping && connectionsRef.current[activeChatId!]?.send({ type: 'typing', isTyping: st })}
              themeColor={settings.themeColor}
              onNudge={() => { connectionsRef.current[activeChatId!]?.send({ type: 'nudge' }); addSystemMessage(activeChatId!, "Dürtüldü"); }}
              onReaction={handleReaction}
              isDisconnected={activeSession.contact.connectionStatus === 'disconnected'}
              isConnecting={activeSession.contact.connectionStatus === 'connecting'}
              wallpaperClass={settings.wallpaper}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
               <Wifi size={100} style={{ color: settings.themeColor }} className="opacity-10 animate-pulse mb-6" />
               <h2 className="text-2xl font-light tracking-widest uppercase">P2P DÜNYASINA HOŞGELDİN</h2>
               <p className="text-[#8696a0] text-sm mt-4">İsimle bağlanın ve doğrudan sohbete başlayın!</p>
               {isAdmin && <p className="mt-2 text-rose-500 font-mono text-xs">SİTENİN SAHİBİ MODU AKTİF</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
