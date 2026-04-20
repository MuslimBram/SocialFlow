import { useState, useEffect } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { useNotifications } from '../context/NotificationContext';
import { db, collection, query, where, getDocs, onSnapshot, limit, orderBy } from '../lib/firebase';
import { 
  BarChart3, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Plus,
  Send,
  MoreHorizontal,
  TrendingUp,
  Users,
  Share2,
  Zap,
  Activity,
  XCircle,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { cn, formatDate } from '../lib/utils';

export function Dashboard() {
  const { activeWorkspace } = useWorkspace();
  const { notifications } = useNotifications();
  const [stats, setStats] = useState({
    scheduled: 0,
    published: 0,
    failed: 0,
    drafts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeWorkspace) return;

    const postsRef = collection(db, `workspaces/${activeWorkspace.id}/posts`);
    
    // Subscribe to all posts for stats
    const unsub = onSnapshot(postsRef, (snapshot) => {
      const allPosts = snapshot.docs.map(doc => doc.data());
      setStats({
        scheduled: allPosts.filter(p => p.status === 'scheduled').length,
        published: allPosts.filter(p => p.status === 'published').length,
        failed: allPosts.filter(p => p.status === 'failed').length,
        drafts: allPosts.filter(p => p.status === 'draft').length
      });
      setLoading(false);
    });

    return () => unsub();
  }, [activeWorkspace]);

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight mb-1">Network Control</h1>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] leading-none opacity-60">System-wide operational overview</p>
        </div>
        <Link 
          to="/compose"
          className="flex items-center gap-2 bg-[#3E63DD] text-white px-5 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-wider hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/10 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Create Post
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Queue" 
          value={stats.scheduled.toString()} 
          icon={<Clock className="w-4 h-4 text-blue-400" />} 
          trend="+2"
          to="/scheduled"
        />
        <StatCard 
          label="Archive" 
          value={stats.published.toString()} 
          icon={<CheckCircle2 className="w-4 h-4 text-green-400" />} 
          trend="+12"
          to="/published"
        />
        <StatCard 
          label="Sandbox" 
          value={stats.drafts.toString()} 
          icon={<Zap className="w-4 h-4 text-amber-400" />} 
          trend="0"
          to="/drafts"
        />
        <StatCard 
          label="Reach" 
          value="12.4k" 
          icon={<Users className="w-4 h-4 text-purple-400" />} 
          trend="+5.2%"
          to="/analytics"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-8 flex flex-col gap-6">
           <div className="bento-card border-zinc-900 bg-[#15181E]/50">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-[#3E63DD]" />
                    <h2 className="bento-heading mb-0">Operational Timeline</h2>
                 </div>
                 <span className="text-[9px] font-black uppercase tracking-widest text-[#3E63DD] bg-[#3E63DD]/10 px-2 py-1 rounded border border-[#3E63DD]/20 animate-pulse">Live_Feed</span>
              </div>

              <div className="space-y-6">
                 {notifications.length === 0 ? (
                    <div className="py-20 text-center opacity-30 italic text-sm">Waiting for incoming signals...</div>
                 ) : (
                    notifications.map((notif, i) => (
                      <motion.div 
                        key={notif.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex gap-4 group"
                      >
                         <div className="flex flex-col items-center">
                            <div className={cn(
                               "w-8 h-8 rounded-full flex items-center justify-center border",
                               notif.type === 'success' ? "bg-green-500/10 border-green-500/20 text-green-500" : "bg-red-500/10 border-red-500/20 text-red-500"
                            )}>
                               {notif.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                            </div>
                            <div className="w-px flex-1 bg-zinc-900 mt-2" />
                         </div>
                         <div className="flex-1 pb-6">
                            <div className="flex items-center justify-between mb-1">
                               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                                  {notif.platform || 'System'} // Event
                               </span>
                               <span className="text-[9px] font-mono text-zinc-700">
                                  {notif.timestamp ? new Date(notif.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                               </span>
                            </div>
                            <p className="text-sm font-medium text-zinc-300 leading-relaxed">{notif.message}</p>
                            <div className="mt-3 flex gap-2">
                               <button className="text-[9px] font-black uppercase text-zinc-600 hover:text-white transition-all tracking-widest cursor-pointer">Inspect Log</button>
                               <span className="text-zinc-800 tracking-tighter">—</span>
                               <button className="text-[9px] font-black uppercase text-zinc-600 hover:text-white transition-all tracking-widest cursor-pointer">Clear Trace</button>
                            </div>
                         </div>
                      </motion.div>
                    ))
                 )}
              </div>
           </div>
        </div>

        {/* Side Controls */}
        <div className="lg:col-span-4 flex flex-col gap-6">
           <div className="bento-card border-zinc-900 overflow-hidden group">
              <h2 className="bento-heading mb-4">Architecture</h2>
              <div className="space-y-4 pt-2">
                 <SystemIndicator label="Network Node" value="Primary" status="active" />
                 <SystemIndicator label="Sync Engine" value="Firestore_RT" status="active" />
                 <SystemIndicator label="AI Processor" value="Gemini_1.5" status="active" />
                 <SystemIndicator label="Auth Protocol" value="OAuth_2.0" status="active" />
              </div>
              <div className="mt-8 p-4 bg-zinc-950 rounded-2xl border border-zinc-900 group-hover:border-[#3E63DD]/40 transition-all">
                 <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase text-zinc-500">API Latency</span>
                    <span className="text-[10px] font-mono text-blue-400">22ms</span>
                 </div>
                 <div className="flex gap-1 items-end h-8">
                    {[12, 11, 14, 18, 12, 10, 8, 11, 15, 12, 10, 11, 9, 11, 13, 16, 14, 12, 11, 10].map((h, i) => (
                      <div key={i} className="flex-1 bg-[#3E63DD]/20 rounded-t-sm" style={{ height: `${h * 4}%` }} />
                    ))}
                 </div>
              </div>
           </div>

           <div className="bento-card bg-[#3E63DD] border-none text-white relative overflow-hidden group cursor-pointer active:scale-[0.98] transition-all">
              <div className="absolute top-0 right-0 p-6 opacity-20 transform -rotate-12 translate-x-4">
                 <Zap className="w-24 h-24" />
              </div>
              <h2 className="text-lg font-black uppercase tracking-tight mb-2 relative z-10">Power Up</h2>
              <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest mb-6 relative z-10 opacity-70">Unlock Enterprise Signals</p>
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest relative z-10">
                 Upgrade Now 
                 <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, trend, icon, to }: { label: string, value: string, trend: string, icon: any, to: string }) {
  return (
    <Link to={to} className="bento-card border-zinc-900 flex items-start justify-between hover:border-[#3E63DD]/40 transition-all group">
      <div>
        <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1 group-hover:text-zinc-400 transition-colors">{label}</h3>
        <div className="text-2xl font-black tracking-tight">{value}</div>
        <div className={cn(
          "text-[9px] font-bold mt-2 inline-block px-1.5 py-0.5 rounded",
          trend.startsWith('+') ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
        )}>
          {trend}
        </div>
      </div>
      <div className="p-2 bg-zinc-950 rounded-xl border border-zinc-900 group-hover:border-[#3E63DD]/20 transition-all">
        {icon}
      </div>
    </Link>
  );
}

function SystemIndicator({ label, value, status }: { label: string, value: string, status: 'active' | 'warning' | 'error' }) {
  return (
    <div className="flex justify-between items-center group/item hover:bg-zinc-900/50 p-1.5 rounded-lg transition-all">
      <div className="flex items-center gap-2">
         <div className={cn(
           "w-1.5 h-1.5 rounded-full shadow-sm",
           status === 'active' ? "bg-green-500 shadow-green-500/50" : "bg-yellow-500 shadow-yellow-500/50"
         )} />
         <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{label}</span>
      </div>
      <span className="text-[10px] font-mono text-zinc-600 group-hover/item:text-zinc-300 transition-colors uppercase">{value}</span>
    </div>
  );
}
