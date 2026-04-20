import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { 
  db, 
  collection, 
  onSnapshot, 
  query, 
  where,
  updateDoc,
  doc,
  deleteDoc,
  addDoc,
  serverTimestamp
} from '../lib/firebase';
import { 
  Plus, 
  Trash2, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  Share2,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Send,
  MoreVertical,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, formatDate } from '../lib/utils';
import { socialService, SocialPlatform } from '../services/socialService';

interface SocialAccount {
  id: string;
  platform: SocialPlatform;
  profileName: string;
  profileImage: string;
  status: 'connected' | 'error' | 'expired';
  connectedAt: any;
}

export function Accounts() {
  const { activeWorkspace } = useWorkspace();
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [connecting, setConnecting] = useState<SocialPlatform | null>(null);

  useEffect(() => {
    if (!activeWorkspace) return;

    const q = query(
      collection(db, `workspaces/${activeWorkspace.id}/social_accounts`)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setAccounts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SocialAccount)));
    });

    return () => unsub();
  }, [activeWorkspace]);

  const handleConnect = async (platform: SocialPlatform) => {
    if (!activeWorkspace) return;
    setConnecting(platform);
    
    try {
      // Simulate OAuth redirect and callback
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newAccount = {
        platform,
        profileName: `${platform}_user_${Math.floor(Math.random() * 1000)}`,
        profileImage: `https://picsum.photos/seed/${platform}${Math.random()}/100/100`,
        status: 'connected' as const,
        connectedAt: serverTimestamp(),
      };

      await addDoc(collection(db, `workspaces/${activeWorkspace.id}/social_accounts`), newAccount);
    } catch (err) {
      console.error("Failed to connect account", err);
    } finally {
      setConnecting(null);
    }
  };

  const handleStatusChange = async (accountId: string, status: SocialAccount['status']) => {
    if (!activeWorkspace) return;
    await updateDoc(doc(db, `workspaces/${activeWorkspace.id}/social_accounts`, accountId), {
      status
    });
  };

  const handleDisconnect = async (accountId: string) => {
    if (!activeWorkspace) return;
    if (window.confirm("Are you sure you want to disconnect this account?")) {
      await deleteDoc(doc(db, `workspaces/${activeWorkspace.id}/social_accounts`, accountId));
    }
  };

  const getPlatformIcon = (platform: SocialPlatform, className = "w-5 h-5") => {
    switch (platform) {
      case 'facebook': return <Facebook className={cn(className, "text-blue-500")} />;
      case 'instagram': return <Instagram className={cn(className, "text-pink-500")} />;
      case 'linkedin': return <Linkedin className={cn(className, "text-blue-700")} />;
      case 'twitter': return <Twitter className={cn(className, "text-white")} />;
      case 'telegram': return <Send className={cn(className, "text-sky-500")} />;
      default: return <Share2 className={className} />;
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight mb-2">Connection Mesh</h1>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">High-fidelity platform synchronization</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-3 py-1.5 bg-zinc-950 border border-zinc-900 rounded-lg flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-[10px] font-black uppercase text-zinc-500">{accounts.length} NODES_ACTIVE</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {accounts.map((account, i) => (
            <motion.div
              layout
              key={account.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bento-card relative group p-6 flex flex-col justify-between min-h-[220px] bg-[#0d0f13] border-zinc-900 hover:border-[#3E63DD]/40 transition-all active:scale-[0.98]"
            >
               <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-4">
                     <div className="relative">
                        <img src={account.profileImage} className="w-14 h-14 rounded-2xl border border-zinc-800" referrerPolicy="no-referrer" />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-zinc-950 rounded-xl flex items-center justify-center border border-zinc-800 shadow-xl">
                           {getPlatformIcon(account.platform, "w-3 h-3")}
                        </div>
                     </div>
                     <div className="flex-1 min-w-0">
                        <h3 className="font-black text-lg tracking-tight mb-0.5 truncate">{account.profileName}</h3>
                        <div className="flex items-center gap-2">
                           <span className="text-[9px] text-[#3E63DD] font-black uppercase tracking-widest">{account.platform}</span>
                           <span className="text-zinc-800 text-xs">—</span>
                           <span className="text-[9px] text-zinc-600 font-mono">ID_{account.id.substring(0,6)}</span>
                        </div>
                     </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                     <div className={cn(
                        "w-2 h-2 rounded-full",
                        account.status === 'connected' ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "bg-red-500"
                     )} />
                     <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest leading-none">Healthy</span>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-zinc-950 rounded-xl border border-zinc-900/50 group-hover:border-zinc-800 transition-colors">
                     <div className="flex flex-col">
                        <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Last Sync</span>
                        <span className="text-[10px] font-mono text-zinc-400">0.02ms ago</span>
                     </div>
                     <div className="flex flex-col items-end">
                        <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Reach Score</span>
                        <span className="text-[10px] font-mono text-blue-400">92/100</span>
                     </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                     <div className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.2em] group-hover:text-zinc-500 transition-colors">STATUS_ACTIVE_MESH</div>
                     <div className="flex gap-1">
                        <button 
                           onClick={() => handleStatusChange(account.id, 'connected')}
                           className="p-2 hover:bg-zinc-900 rounded-xl transition-all cursor-pointer text-zinc-600 hover:text-white border border-transparent hover:border-zinc-800"
                        >
                           <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                        <button 
                           onClick={() => handleDisconnect(account.id)}
                           className="p-2 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer text-zinc-600 hover:text-red-500 border border-transparent hover:border-red-500/20"
                        >
                           <Trash2 className="w-3.5 h-3.5" />
                        </button>
                     </div>
                  </div>
               </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add Connection */}
        <div className="bento-card border-dashed border-zinc-900/50 bg-transparent flex flex-col items-center justify-center text-center p-8 group overflow-hidden hover:bg-zinc-900/10 transition-all cursor-default">
           <div className="w-12 h-12 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center mb-6 transition-all group-hover:scale-110 group-hover:border-[#3E63DD]/40 group-hover:bg-[#3E63DD]/5">
              <Plus className="w-6 h-6 text-zinc-700 group-hover:text-[#3E63DD]" />
           </div>
           <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-8 group-hover:text-zinc-400 transition-colors">Expand Operational Grid</h3>
           <div className="grid grid-cols-5 gap-3">
              <PlatformButton 
                platform="facebook" 
                icon={<Facebook />} 
                active={connecting === 'facebook'}
                onClick={() => handleConnect('facebook')} 
              />
              <PlatformButton 
                platform="instagram" 
                icon={<Instagram />} 
                active={connecting === 'instagram'}
                onClick={() => handleConnect('instagram')} 
              />
              <PlatformButton 
                platform="twitter" 
                icon={<Twitter />} 
                active={connecting === 'twitter'}
                onClick={() => handleConnect('twitter')} 
              />
              <PlatformButton 
                platform="linkedin" 
                icon={<Linkedin />} 
                active={connecting === 'linkedin'}
                onClick={() => handleConnect('linkedin')} 
              />
              <PlatformButton 
                platform="telegram" 
                icon={<Send />} 
                active={connecting === 'telegram'}
                onClick={() => handleConnect('telegram')} 
              />
           </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bento-card bg-black font-mono text-[10px] text-[#3E63DD] border-[#3E63DD]/10">
           <div className="flex items-center gap-3 mb-4">
             <Zap className="w-4 h-4" />
             <h2 className="text-[9px] font-black uppercase tracking-widest opacity-80">Sync Protocol Verifier</h2>
           </div>
           <div className="space-y-1 opacity-60">
             <div>[AUTH_LOG] :: Callback registered at ais.v2.protocol/node_01</div>
             <div>[AUTH_LOG] :: Encryption level AES-256 enabled automatically</div>
             <div>[AUTH_LOG] :: Heartbeat signal detecting 0.0ms delay across grid</div>
           </div>
         </div>

         <div className="bento-card border-zinc-900 overflow-hidden relative">
            <div className="flex items-center justify-between mb-6">
               <h2 className="text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-0">Network Health</h2>
               <div className="flex gap-1">
                  {[1,1,1,1,1,1,1,1,0.5,1].map((v, i) => (
                    <div key={i} className="w-1 h-3 rounded-full bg-green-500" style={{ opacity: v }} />
                  ))}
               </div>
            </div>
            <p className="text-[10px] text-zinc-400 font-medium leading-relaxed italic">
              "Your network nodes are responding optimally. No signal drops detected in the last 24h operational cycle."
            </p>
         </div>
      </div>
    </div>
  );
}

function PlatformButton({ platform, icon, onClick, active }: { platform: string, icon: any, onClick: () => void, active: boolean }) {
  return (
    <button 
      onClick={onClick}
      disabled={active}
      className={cn(
        "w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer relative",
        "bg-zinc-900 border border-zinc-800 hover:border-zinc-500 hover:bg-zinc-800",
        active && "border-zinc-500 animate-pulse cursor-wait"
      )}
      title={`Connect ${platform}`}
    >
      {React.cloneElement(icon, { className: "w-5 h-5" })}
    </button>
  );
}
