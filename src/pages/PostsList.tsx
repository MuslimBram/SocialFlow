import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { db, collection, query, where, onSnapshot, orderBy, getDocs } from '../lib/firebase';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  MoreVertical, 
  Calendar, 
  Share2,
  Trash2,
  Edit2,
  ExternalLink,
  ChevronRight,
  BarChart3,
  MessageCircle,
  Heart,
  Eye,
  Globe,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, formatDate } from '../lib/utils';
import { Link } from 'react-router-dom';
import { SocialPlatform } from '../services/socialService';

interface SocialAccount {
  id: string;
  platform: SocialPlatform;
  profileName: string;
}

interface Post {
  id: string;
  content: string;
  status: 'draft' | 'scheduled' | 'publishing' | 'published' | 'failed';
  scheduledAt?: string;
  accountIds: string[];
  media?: string[];
  createdAt: any;
  updatedAt: any;
}

export function PostsList({ type }: { type: 'draft' | 'scheduled' | 'published' }) {
  const { activeWorkspace } = useWorkspace();
  const [posts, setPosts] = useState<Post[]>([]);
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeWorkspace) return;

    // Fetch accounts for platform icons
    getDocs(collection(db, `workspaces/${activeWorkspace.id}/social_accounts`)).then(snap => {
       setAccounts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as SocialAccount)));
    });

    let q = query(
      collection(db, `workspaces/${activeWorkspace.id}/posts`),
      where('status', '==', type),
      orderBy('createdAt', 'desc')
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post)));
      setLoading(false);
    });

    return () => unsub();
  }, [activeWorkspace, type]);

  const getTitle = () => {
    switch(type) {
      case 'draft': return 'Dark Vault';
      case 'scheduled': return 'Release Queue';
      case 'published': return 'Operational Archive';
      default: return 'Data Segment';
    }
  };

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight mb-2">{getTitle()}</h1>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] leading-none opacity-60">System-wide {type} records</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-3 py-1.5 bg-zinc-950 border border-zinc-900 rounded-lg flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-zinc-500">{posts.length} ENTRIES</span>
           </div>
        </div>
      </div>

      <div className={cn(
        "grid gap-4",
        type === 'published' ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
      )}>
        {loading ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center gap-3">
             <div className="w-8 h-8 rounded-full border-2 border-[#3E63DD]/20 border-t-[#3E63DD] animate-spin" />
             <span className="text-zinc-700 text-[10px] font-black uppercase tracking-widest">Hydrating Segment Archive...</span>
          </div>
        ) : posts.length > 0 ? (
          <AnimatePresence>
            {posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "bento-card relative group transition-all active:scale-[0.99] border-zinc-900",
                  type === 'published' ? "p-4 flex flex-col" : "p-5 flex items-start md:items-center gap-6"
                )}
              >
                  {type === 'published' && post.media && post.media.length > 0 && (
                    <div className="aspect-video mb-4 rounded-xl overflow-hidden border border-zinc-800 relative grow-0">
                       <img src={post.media[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                       <div className="absolute top-2 right-2 flex gap-1">
                          {post.accountIds.map(id => (
                             <div key={id} className="w-6 h-6 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center">
                                {getPlatformIcon(id)}
                             </div>
                          ))}
                       </div>
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className={cn(
                      "font-bold text-zinc-200 leading-relaxed mb-4",
                      type === 'published' ? "text-sm line-clamp-3" : "text-base lg:text-lg tracking-tight"
                    )}>
                      {post.content}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                       <div className="flex items-center gap-2 text-[9px] text-zinc-600 font-black uppercase tracking-widest">
                          <Calendar className="w-3.5 h-3.5 opacity-40" />
                          {post.scheduledAt ? formatDate(post.scheduledAt) : (post.createdAt ? formatDate(post.createdAt.toDate()) : 'Recent')}
                       </div>
                       
                       {type === 'published' ? (
                          <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-500">
                             <div className="flex items-center gap-1.5"><Heart className="w-3 h-3 text-pink-500/50" /> 1.2k</div>
                             <div className="flex items-center gap-1.5"><MessageCircle className="w-3 h-3 text-blue-500/50" /> 42</div>
                             <div className="flex items-center gap-1.5"><Eye className="w-3 h-3 text-zinc-500/50" /> 8.4k</div>
                          </div>
                       ) : (
                          <div className="flex items-center gap-2 text-[9px] text-[#3E63DD] font-black uppercase tracking-[0.2em] bg-[#3E63DD]/5 px-2 py-0.5 rounded border border-[#3E63DD]/10">
                            SIGNAL::{post.status}
                          </div>
                       )}

                       {type !== 'published' && (
                          <div className="flex items-center gap-1.5">
                             {post.accountIds?.map(id => (
                                <div key={id} className="w-5 h-5 rounded-md bg-zinc-950 border border-zinc-900 flex items-center justify-center">
                                   {getPlatformIcon(id)}
                                </div>
                             ))}
                          </div>
                       )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 md:ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                     {type === 'published' ? (
                        <button className="p-2 hover:bg-zinc-900 rounded-xl text-zinc-600 hover:text-white transition-all cursor-pointer border border-transparent hover:border-zinc-800">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                     ) : (
                        <button className="p-2 hover:bg-zinc-900 rounded-xl text-zinc-600 hover:text-white transition-all cursor-pointer border border-transparent hover:border-zinc-800">
                           <Edit2 className="w-4 h-4" />
                        </button>
                     )}
                     <button className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-xl text-zinc-600 transition-all cursor-pointer border border-transparent hover:border-red-500/20">
                        <Trash2 className="w-4 h-4" />
                     </button>
                  </div>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="col-span-full bento-card py-32 border-dashed border-zinc-900 flex flex-col items-center justify-center text-center opacity-30">
            <div className="w-16 h-16 rounded-3xl bg-zinc-950 border border-zinc-900 flex items-center justify-center mb-6">
               {type === 'scheduled' ? <Clock className="w-6 h-6 text-zinc-700" /> : <FileText className="w-6 h-6 text-zinc-700" />}
            </div>
            <h3 className="text-[12px] font-black uppercase tracking-[0.3em] mb-2">Segment Silence</h3>
            <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-widest max-w-xs">Data index returned zero entries for current operational filter.</p>
            <Link to="/compose" className="mt-8 flex items-center gap-2 bg-[#3E63DD] text-white px-6 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/10">
               Initialize Publication
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

