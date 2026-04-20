import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { db, collection, query, where, onSnapshot, getDocs } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock, 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  LayoutGrid,
  List,
  Target,
  Zap,
  Globe,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Send
} from 'lucide-react';
import { cn, formatDate } from '../lib/utils';
import { Link } from 'react-router-dom';
import { SocialPlatform } from '../services/socialService';

interface SocialAccount {
  id: string;
  platform: SocialPlatform;
  profileName: string;
}

export function CalendarView() {
  const { activeWorkspace } = useWorkspace();
  const [scheduledPosts, setScheduledPosts] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [density, setDensity] = useState<'compact' | 'expanded'>('expanded');

  useEffect(() => {
    if (!activeWorkspace) return;
    
    // Fetch accounts first to show icons
    getDocs(collection(db, `workspaces/${activeWorkspace.id}/social_accounts`)).then(snap => {
       setAccounts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as SocialAccount)));
    });

    const q = query(
      collection(db, `workspaces/${activeWorkspace.id}/posts`),
      where('status', '==', 'scheduled')
    );
    return onSnapshot(q, (snapshot) => {
      setScheduledPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, [activeWorkspace]);

  // Generate next 14 days for a longer horizon
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  const getPlatformIcon = (id: string) => {
    const acc = accounts.find(a => a.id === id);
    if (!acc) return <Globe className="w-3 h-3" />;
    switch(acc.platform) {
      case 'facebook': return <Facebook className="w-3 h-3 text-blue-500" />;
      case 'instagram': return <Instagram className="w-3 h-3 text-pink-500" />;
      case 'linkedin': return <Linkedin className="w-3 h-3 text-blue-700" />;
      case 'twitter': return <Twitter className="w-3 h-3 text-white" />;
      case 'telegram': return <Send className="w-3 h-3 text-sky-500" />;
      default: return <Globe className="w-3 h-3" />;
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight mb-2">Operational Horizon</h1>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">High-density content deployment schedule</p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800">
              <button 
                onClick={() => setDensity('compact')}
                className={cn("p-2 rounded-lg transition-all", density === 'compact' ? "bg-zinc-800 text-[#3E63DD]" : "text-zinc-600")}
              >
                <List className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setDensity('expanded')}
                className={cn("p-2 rounded-lg transition-all", density === 'expanded' ? "bg-zinc-800 text-[#3E63DD]" : "text-zinc-600")}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
           </div>
           
           <div className="flex items-center gap-2 bg-[#15181E] p-1 rounded-xl border border-zinc-900">
              <button className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 cursor-pointer"><ChevronLeft className="w-4 h-4" /></button>
              <span className="text-[10px] font-black uppercase tracking-widest px-4 text-zinc-400">14 DAY HORIZON</span>
              <button className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
           </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute top-0 bottom-0 left-[24px] md:left-[112px] w-px bg-zinc-900/50" />

        <div className="space-y-12">
          {days.map((day, i) => {
            const dateStr = day.toISOString().split('T')[0];
            const posts = scheduledPosts.filter(p => p.scheduledAt?.startsWith(dateStr));
            const isToday = i === 0;
            
            return (
              <div key={dateStr} className="flex gap-4 md:gap-12 group relative">
                  <div className={cn(
                    "w-12 md:w-28 pt-1 flex flex-col items-center md:items-end flex-shrink-0 z-10",
                    isToday ? "text-[#3E63DD]" : "text-zinc-600"
                  )}>
                     <div className="text-[9px] font-black uppercase tracking-[0.3em] mb-1">{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                     <div className={cn(
                       "text-2xl md:text-4xl font-black tracking-tighter leading-none px-2 rounded-lg",
                       isToday && "bg-[#3E63DD]/10 border border-[#3E63DD]/20 py-1"
                     )}>{day.getDate()}</div>
                     {isToday && <span className="text-[8px] font-bold mt-2 uppercase tracking-widest">Active_Node</span>}
                  </div>

                  <div className="flex-1 space-y-4 pb-4">
                     {posts.length > 0 ? (
                       <div className={cn(
                         "grid gap-4",
                         density === 'expanded' ? "grid-cols-1 xl:grid-cols-2" : "grid-cols-1"
                       )}>
                         {posts.map(post => {
                           const mediaUrl = post.media && post.media.length > 0 ? post.media[0] : null;
                           return (
                             <motion.div 
                               key={post.id}
                               whileHover={{ scale: 1.01, x: 4 }}
                               className="p-5 rounded-3xl bento-card border-zinc-900 bg-[#0d0f13] flex flex-col md:flex-row gap-5 hover:border-[#3E63DD]/40 transition-all cursor-pointer group/card active:scale-[0.99]"
                             >
                                {mediaUrl && density === 'expanded' && (
                                   <div className="w-full md:w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 border border-zinc-800">
                                      <img src={mediaUrl} className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                                   </div>
                                )}
                                <div className="flex-1 min-w-0 flex flex-col h-full">
                                   <div className="flex items-center justify-between mb-3">
                                      <div className="text-[10px] font-black text-[#3E63DD] uppercase tracking-[0.1em] flex items-center gap-2">
                                         <Clock className="w-3.5 h-3.5" />
                                         {post.scheduledAt.split('T')[1].substring(0, 5)} SIGNAL_OUT
                                      </div>
                                      <div className="flex items-center gap-1.5 translate-y-[-2px]">
                                         {post.accountIds.map((id: string) => (
                                            <div key={id} className="w-6 h-6 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center hover:border-zinc-600 transition-colors">
                                               {getPlatformIcon(id)}
                                            </div>
                                         ))}
                                      </div>
                                   </div>
                                   
                                   <p className="text-sm font-bold text-zinc-300 line-clamp-2 leading-relaxed flex-1">{post.content}</p>
                                   
                                   <div className="mt-4 pt-4 border-t border-zinc-900 flex items-center justify-between">
                                      <div className="flex items-center gap-2 text-[9px] font-mono text-zinc-600">
                                         <Target className="w-3 h-3" />
                                         OPTIMIZED_SCORE: 0.94
                                      </div>
                                      <div className="flex items-center gap-1 text-[9px] font-black text-white/40 uppercase group-hover/card:text-[#3E63DD] transition-colors">
                                         View Trace <ChevronRight className="w-3 h-3" />
                                      </div>
                                   </div>
                                </div>
                             </motion.div>
                           )
                         })}
                       </div>
                     ) : (
                       <div className="p-6 rounded-3xl border border-dashed border-zinc-900/50 flex items-center justify-between hover:bg-zinc-900/20 transition-all group/empty">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-zinc-900 flex items-center justify-center opacity-40">
                                <Zap className="w-4 h-4 text-zinc-700" />
                             </div>
                             <span className="text-[10px] text-zinc-700 font-bold uppercase tracking-[0.2em]">Silence operational</span>
                          </div>
                          <Link to="/compose" className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-600 hover:text-[#3E63DD] hover:border-[#3E63DD]/40 hover:bg-zinc-800 transition-all active:scale-90">
                             <Plus className="w-4 h-4" />
                          </Link>
                       </div>
                     )}
                  </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
