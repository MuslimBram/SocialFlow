import React, { useState, useEffect, useRef } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { db, collection, getDocs, addDoc, serverTimestamp } from '../lib/firebase';
import { 
  Sparkles, 
  Calendar, 
  Send, 
  Image as ImageIcon, 
  Hash, 
  Type, 
  AlertCircle,
  X,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  ChevronDown,
  Loader2,
  ShieldCheck,
  TrendingUp,
  Workflow,
  Camera,
  Layers,
  FileText,
  Search,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { aiService } from '../services/aiService';
import { socialService, SocialPlatform } from '../services/socialService';

interface SocialAccount {
  id: string;
  platform: SocialPlatform;
  profileName: string;
}

interface PreviewCardProps {
  key?: string | number;
  account: SocialAccount;
  content: string;
  mediaUrl: string | null;
}

const TEMPLATES = [
  { name: "Product Launch", content: "🚀 EXCITING NEWS: [Product Name] is finally here!\n\nWe've been working on this for months and we can't wait for you to try it. [Key Benefit].\n\nLink in bio to explore! #ProductLaunch #Innovation" },
  { name: "Behind the Scenes", content: "Ever wondered how we [Process/Service]? 🛠️\n\nToday we're taking you behind the curtain to show you our team in action. Consistency and passion are at the core of everything we build.\n\n#BehindTheScenes #WorkCulture" },
  { name: "Quick Tip", content: "💡 PRO TIP: [Share a 1-sentence value].\n\nMost people overlook this, but it can make a 10x difference in your [Outcome]. Try it today and let us know what you think!\n\n#TipsAndTricks #KnowledgeSharing" },
  { name: "Community Poll", content: "We want to hear from YOU! 👇\n\nWhich [Feature/Topic] do you prefer?\n\nA) [Option 1]\nB) [Option 2]\n\nDrop your vote in the comments! #CommunityFirst #Engagement" }
];

function getPlatformIcon(platform: string, className: string) {
  switch(platform) {
    case 'facebook': return <Facebook className={cn(className, "text-blue-500")} />;
    case 'instagram': return <Instagram className={cn(className, "text-pink-500")} />;
    case 'linkedin': return <Linkedin className={cn(className, "text-blue-700")} />;
    case 'twitter': return <Twitter className={cn(className, "text-white")} />;
    case 'telegram': return <Send className={cn(className, "text-sky-500")} />;
    default: return <ChevronDown className={cn(className, "text-zinc-500")} />;
  }
}

function PreviewCard({ account, content, mediaUrl }: PreviewCardProps) {
  const validation = socialService.getProvider(account.platform).validate(content, mediaUrl ? [mediaUrl] : []);
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={cn(
        "bento-card p-0 bg-[#0d0f13] border-zinc-900 overflow-hidden group/preview relative",
        !validation.valid && "ring-2 ring-red-500/20 border-red-500/10"
      )}
    >
       {!validation.valid && (
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2 px-2 py-1 bg-red-500/10 border border-red-500/20 rounded text-[8px] font-black text-red-500 uppercase tracking-widest animate-pulse">
             <AlertCircle className="w-3 h-3" /> ERROR_VALIDATION
          </div>
       )}

       <div className="p-6">
          <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-zinc-950 border border-zinc-900 flex items-center justify-center shadow-inner">
                   {getPlatformIcon(account.platform, "w-5 h-5 opacity-40")}
                </div>
                <div>
                   <div className="text-[12px] font-black text-white uppercase tracking-tighter">{account.profileName}</div>
                   <div className="text-[9px] font-mono text-zinc-600 uppercase">Signal_Source::{account.platform}</div>
                </div>
             </div>
             {validation.valid && <CheckCircle2 className="w-5 h-5 text-green-500/40" />}
          </div>

          <div className="space-y-4">
             <div className={cn(
               "text-[13px] leading-relaxed whitespace-pre-wrap font-medium h-auto min-h-[80px]",
               content ? "text-zinc-300" : "text-zinc-800 italic"
             )}>
                {content || "SIGNAL_EMPTY: Waiting for content input..."}
             </div>

             {mediaUrl && (
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-zinc-900 grayscale-[0.5] group-hover/preview:grayscale-0 transition-all duration-700">
                   <img src={mediaUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
             )}
          </div>
          
          <div className="mt-8 pt-6 border-t border-zinc-900 flex items-center justify-between">
             <div className="flex gap-4">
                <div className="w-3 h-3 rounded-full bg-zinc-900" />
                <div className="w-3 h-3 rounded-full bg-zinc-900" />
                <div className="w-3 h-3 rounded-full bg-zinc-900" />
             </div>
             <div className="text-[9px] font-black text-zinc-800 uppercase tracking-widest bg-zinc-950 px-2 py-1 rounded border border-zinc-900">Preview_Only</div>
          </div>
          
          {!validation.valid && (
             <div className="mt-4 p-3 bg-red-500/5 border border-red-500/10 rounded-xl">
                <p className="text-[9px] font-black text-red-400 uppercase leading-relaxed tracking-tight">
                   SIGNAL_CORRUPT :: {validation.error}
                </p>
             </div>
          )}
       </div>
    </motion.div>
  );
}

export function Composer() {
  const { activeWorkspace } = useWorkspace();
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);
  const [content, setContent] = useState('');
  const [scheduling, setScheduling] = useState(false);
  const [scheduledAt, setScheduledAt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [aiMediaConcept, setAiMediaConcept] = useState<string | null>(null);
  
  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!activeWorkspace) return;
    const fetchAccounts = async () => {
      const snap = await getDocs(collection(db, `workspaces/${activeWorkspace.id}/social_accounts`));
      setAccounts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as SocialAccount)));
    };
    fetchAccounts();
  }, [activeWorkspace]);

  const toggleAccount = (id: string) => {
    setSelectedAccountIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleAiGeneral = async () => {
    if (!content) return;
    setAiLoading(true);
    try {
      const platform = selectedAccountIds.length > 0 
        ? accounts.find(a => a.id === selectedAccountIds[0])?.platform || 'general'
        : 'general';
      const result = await aiService.generateCaption(content, platform);
      setContent(result);
    } catch (err) {
      setError("AI generation failed. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleAiRewrite = async (tone: 'formal' | 'casual' | 'sales' | 'witty') => {
    if (!content) return;
    setAiLoading(true);
    try {
      const result = await aiService.rewriteContent(content, tone);
      setContent(result);
    } catch (err) {
      setError("AI rewrite failed.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleAiHashtags = async () => {
    if (!content) return;
    setAiLoading(true);
    try {
      const result = await aiService.suggestHashtags(content);
      setHashtags(result);
    } catch (err) {
      setError("Hashtag suggestion failed.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleAiMediaSuggestion = async () => {
     if (!content) return;
     setAiLoading(true);
     try {
        const result = await aiService.suggestMedia(content);
        setAiMediaConcept(result);
     } catch (err) {
        setError("AI Media suggestion failed.");
     } finally {
        setAiLoading(false);
     }
  };

  const handleMediaUpload = () => {
    setIsUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      setMediaUrl(`https://picsum.photos/seed/${Math.random()}/1200/800`);
      setIsUploading(false);
      setAiMediaConcept(null);
    }, 2000);
  };

  const insertTemplate = (tmpl: string) => {
     setContent(tmpl);
     setShowTemplates(false);
  };

  const handleAction = async (status: 'draft' | 'scheduled' | 'publishing') => {
    if (!activeWorkspace || !content || selectedAccountIds.length === 0) return;
    
    // Check validation for all selected platforms
    for (const id of selectedAccountIds) {
       const acc = accounts.find(a => a.id === id);
       if (acc) {
          const validation = socialService.getProvider(acc.platform).validate(content, mediaUrl ? [mediaUrl] : []);
          if (!validation.valid) {
             setError(`Validation error on ${acc.platform}: ${validation.error}`);
             return;
          }
       }
    }

    setPublishing(true);
    setError(null);

    const postData = {
      workspaceId: activeWorkspace.id,
      content,
      status,
      scheduledAt: status === 'scheduled' ? scheduledAt : null,
      accountIds: selectedAccountIds,
      media: mediaUrl ? [mediaUrl] : [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
      if (status === 'publishing') {
         const platforms = accounts
            .filter(a => selectedAccountIds.includes(a.id))
            .map(a => a.platform);
         
         const results = await socialService.publishToAll(platforms, content, mediaUrl ? [mediaUrl] : []);
         
         const isFullSuccess = Object.values(results).every(r => r.success);
         
         await addDoc(collection(db, `workspaces/${activeWorkspace.id}/posts`), {
           ...postData,
           status: isFullSuccess ? 'published' : 'failed'
         });

         for (const [platform, res] of Object.entries(results)) {
           await addDoc(collection(db, `workspaces/${activeWorkspace.id}/publishing_logs`), {
             postId: 'async_broadcast', 
             platform,
             status: res.success ? 'success' : 'error',
             errorMessage: res.error || null,
             timestamp: serverTimestamp()
           });
         }
      } else {
        await addDoc(collection(db, `workspaces/${activeWorkspace.id}/posts`), postData);
      }
      
      setContent('');
      setSelectedAccountIds([]);
      setScheduling(false);
      setMediaUrl(null);
      setHashtags([]);
    } catch (err) {
      setError("Failed to process operational sequence.");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight mb-2">Signal Composer</h1>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] opacity-60 leading-none">Multiplex transmission & content generation</p>
        </div>
        
        <div className="flex items-center gap-3">
           <button 
             onClick={() => setShowTemplates(!showTemplates)}
             className="flex items-center gap-3 px-6 py-3 bg-zinc-950 border border-zinc-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white hover:border-zinc-800 transition-all group"
           >
              <FileText className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              Templates_Lib
           </button>
           <div className="w-px h-8 bg-zinc-900" />
           <div className="flex -space-x-3">
              {accounts.map((acc) => (
                <div 
                  key={acc.id} 
                  className={cn(
                    "w-10 h-10 rounded-full border-2 border-[#0A0B0E] bg-zinc-900 flex items-center justify-center transition-all cursor-help relative",
                    selectedAccountIds.includes(acc.id) ? "z-10 scale-110 border-[#3E63DD]/40 ring-4 ring-[#3E63DD]/5" : "z-0 opacity-40 grayscale"
                  )}
                  title={acc.profileName}
                >
                   {getPlatformIcon(acc.platform, "w-4 h-4")}
                </div>
              ))}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
         {/* Main Editor */}
         <div className="lg:col-span-8 space-y-6">
            <div className="bento-card bg-[#0d0f13] border-zinc-900 p-8 shadow-2xl relative overflow-hidden group">
               {/* Template Overlay */}
               <AnimatePresence>
                  {showTemplates && (
                     <motion.div 
                       initial={{ opacity: 0, y: -20 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: -20 }}
                       className="absolute inset-x-8 top-20 z-20 bg-zinc-950 border border-zinc-800 rounded-[2rem] p-6 shadow-2xl max-h-[400px] overflow-y-auto custom-scrollbar ring-1 ring-white/5"
                     >
                        <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-6 flex justify-between items-center px-2">
                           System_Templates
                           <button onClick={() => setShowTemplates(false)}><X className="w-4 h-4 hover:text-white" /></button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {TEMPLATES.map((tmpl, i) => (
                             <button 
                                key={i}
                                onClick={() => insertTemplate(tmpl.content)}
                                className="text-left p-5 rounded-2xl bg-zinc-900/50 border border-zinc-900 hover:border-[#3E63DD]/40 hover:bg-zinc-900 transition-all group/tmpl"
                             >
                                <div className="text-[11px] font-black text-zinc-400 group-hover:text-white mb-2 uppercase tracking-tighter">{tmpl.name}</div>
                                <p className="text-[10px] text-zinc-600 line-clamp-2 leading-relaxed font-medium">{tmpl.content}</p>
                             </button>
                           ))}
                        </div>
                     </motion.div>
                  )}
               </AnimatePresence>

               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                     <Workflow className="w-5 h-5 text-[#3E63DD]" />
                     <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-white">Central_Broadcaster</h2>
                  </div>
                  <div className="flex items-center gap-2">
                     {aiLoading && <div className="text-[9px] font-mono text-[#3E63DD] animate-pulse">PROCESSING_NEURAL_LAYER...</div>}
                     <button 
                       onClick={handleAiGeneral}
                       disabled={aiLoading || !content}
                       className="p-3 bg-zinc-950 border border-zinc-900 rounded-2xl text-[#3E63DD] hover:bg-[#3E63DD] hover:text-white transition-all disabled:opacity-20 cursor-pointer shadow-lg"
                     >
                        <Sparkles className="w-4 h-4" />
                     </button>
                  </div>
               </div>

               <div className="relative mb-8">
                  <textarea 
                    ref={contentRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="INITIATE_CONTENT_PAYLOAD..."
                    className="w-full min-h-[280px] bg-transparent text-xl font-medium text-white resize-none focus:outline-none placeholder:text-zinc-800 placeholder:font-black placeholder:uppercase placeholder:tracking-[0.4em] leading-relaxed custom-scrollbar"
                  />
                  <div className="absolute bottom-0 right-0 py-2 px-4 bg-zinc-950/50 backdrop-blur-md rounded-lg text-[9px] font-mono text-zinc-600 border border-zinc-900">
                     CHAR_SIZE::{content.length} / MAX::5000
                  </div>
               </div>

               <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
                  <div className="flex-1 w-full">
                     <label className="text-[10px] font-black text-zinc-700 uppercase tracking-widest mb-3 block ml-1">Transmission Nodes</label>
                     <div className="flex flex-wrap gap-2">
                        {accounts.map(acc => (
                           <button 
                              key={acc.id}
                              onClick={() => toggleAccount(acc.id)}
                              className={cn(
                                "px-4 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer",
                                selectedAccountIds.includes(acc.id)
                                  ? "bg-[#3E63DD] border-[#3E63DD] text-white shadow-xl shadow-blue-500/10"
                                  : "bg-zinc-950 border-zinc-900 text-zinc-600 hover:text-zinc-400 hover:border-zinc-800"
                              )}
                           >
                              {acc.profileName}
                           </button>
                        ))}
                     </div>
                  </div>
                  
                  <div className="w-full md:w-auto shrink-0 self-end">
                     <button 
                        onClick={() => setScheduling(!scheduling)}
                        className={cn(
                          "px-6 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-3 w-full md:w-auto",
                          scheduling 
                            ? "bg-[#3E63DD]/5 border-[#3E63DD]/20 text-[#3E63DD]" 
                            : "bg-zinc-950 border-zinc-900 text-zinc-600 hover:text-white"
                        )}
                     >
                        <Calendar className="w-4 h-4" />
                        {scheduling ? 'Time_Gate: ACTIVE' : 'Time_Gate: READY'}
                     </button>
                  </div>
               </div>

               <AnimatePresence>
                  {scheduling && (
                     <motion.div 
                       initial={{ height: 0, opacity: 0 }}
                       animate={{ height: 'auto', opacity: 1 }}
                       exit={{ height: 0, opacity: 0 }}
                       className="overflow-hidden mb-8"
                     >
                        <div className="p-6 bg-zinc-950 rounded-[1.5rem] border border-zinc-900 flex flex-col md:flex-row items-center gap-6">
                           <div className="flex-1 space-y-2">
                              <div className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Temporal_Shift_Protocol</div>
                              <input 
                                 type="datetime-local" 
                                 value={scheduledAt}
                                 onChange={(e) => setScheduledAt(e.target.value)}
                                 className="w-full bg-[#0d0f13] border border-zinc-900 rounded-xl px-5 py-3 text-sm text-white font-mono focus:outline-none focus:border-[#3E63DD]/40"
                              />
                           </div>
                           <div className="hidden md:block w-px h-12 bg-zinc-900" />
                           <div className="text-center md:text-left">
                              <div className="text-[9px] font-black text-zinc-700 uppercase tracking-widest mb-1">Status</div>
                              <div className="text-[11px] font-black text-amber-500 uppercase tracking-widest animate-pulse flex items-center gap-2">
                                 <Clock className="w-3 h-3" /> Awaiting_Timestamp
                              </div>
                           </div>
                        </div>
                     </motion.div>
                  )}
               </AnimatePresence>

               {error && (
                 <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="mb-8 p-4 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-center gap-3 text-red-500 text-[11px] font-bold"
                 >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                 </motion.div>
               )}

               <div className="flex items-center gap-4">
                  <button 
                    onClick={() => handleAction('publishing')}
                    disabled={publishing || !content || selectedAccountIds.length === 0}
                    className="flex-[3] h-16 bg-[#3E63DD] text-white text-[12px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-blue-600 transition-all shadow-2xl shadow-blue-500/20 active:scale-[0.98] disabled:opacity-20 flex items-center justify-center gap-3 group/send cursor-pointer"
                  >
                     {publishing ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                       <>
                         Initiate_Broadcast
                         <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                       </>
                     )}
                  </button>
                  <button 
                    onClick={() => handleAction('draft')}
                    disabled={publishing}
                    className="flex-1 h-16 bg-zinc-950 border border-zinc-900 text-zinc-600 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-zinc-900 hover:text-white transition-all cursor-pointer"
                  >
                     Save_Archive
                  </button>
               </div>
            </div>

            {/* AI Assets & Visuals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bento-card bg-[#0d0f13] border-zinc-900 p-8 shadow-xl">
                    <div className="flex items-center justify-between mb-8">
                       <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 flex items-center gap-2">
                          <Layers className="w-4 h-4" /> Neural_Vibe_Check
                       </h3>
                       <div className="flex gap-2">
                          <button onClick={() => handleAiRewrite('casual')} className="p-2 bg-zinc-950 border border-zinc-900 rounded-lg text-zinc-700 hover:text-white transition-all" title="Casual"><TrendingUp className="w-4 h-4 rotate-45" /></button>
                          <button onClick={() => handleAiRewrite('formal')} className="p-2 bg-zinc-950 border border-zinc-900 rounded-lg text-zinc-700 hover:text-white transition-all" title="Formal"><ShieldCheck className="w-4 h-4" /></button>
                          <button onClick={() => handleAiRewrite('witty')} className="p-2 bg-zinc-950 border border-zinc-900 rounded-lg text-zinc-700 hover:text-white transition-all" title="Witty"><Sparkles className="w-4 h-4" /></button>
                       </div>
                    </div>
                    
                    <div className="space-y-4">
                       <button 
                         onClick={handleAiHashtags}
                         className="w-full py-4 bg-zinc-950 border border-zinc-900 border-dashed rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] text-zinc-700 hover:text-[#3E63DD] hover:border-[#3E63DD]/40 transition-all group"
                       >
                          Analyze_Contextual_Tags
                       </button>

                       {hashtags.length > 0 && (
                         <div className="flex flex-wrap gap-2 p-4 bg-black/40 rounded-2xl border border-zinc-900">
                            {hashtags.map((tag, i) => (
                              <button 
                                key={i}
                                onClick={() => setContent(prev => `${prev}\n\n${tag.startsWith('#') ? tag : '#' + tag}`)}
                                className="text-[10px] font-mono text-zinc-500 hover:text-[#3E63DD] transition-colors"
                              >
                                {tag}
                              </button>
                            ))}
                         </div>
                       )}
                    </div>
                </div>

                <div className="bento-card bg-[#0d0f13] border-zinc-900 p-8 shadow-xl flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                       <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 flex items-center gap-2">
                          <Camera className="w-4 h-4" /> Visual_Capture
                       </h3>
                       <button 
                         onClick={handleAiMediaSuggestion}
                         disabled={aiLoading || !content}
                         className="p-2 bg-zinc-950 border border-zinc-900 rounded-lg text-[#3E63DD] hover:bg-[#3E63DD] hover:text-white transition-all disabled:opacity-20"
                       >
                          <Sparkles className="w-4 h-4" />
                       </button>
                    </div>

                    <div className="flex-1 flex flex-col">
                       {mediaUrl ? (
                         <div className="relative group flex-1 min-h-[160px]">
                            <img src={mediaUrl} className="w-full h-full object-cover rounded-2xl border border-zinc-900" referrerPolicy="no-referrer" />
                            <button 
                              onClick={() => setMediaUrl(null)}
                              className="absolute top-4 right-4 w-10 h-10 bg-black/60 backdrop-blur-md rounded-xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all border border-white/10"
                            >
                               <X className="w-5 h-5" />
                            </button>
                         </div>
                       ) : (
                         <div className="flex flex-col flex-1 gap-4">
                            <div 
                              onClick={handleMediaUpload}
                              className="flex-1 min-h-[160px] border-2 border-dashed border-zinc-900/50 rounded-3xl flex flex-col items-center justify-center gap-4 hover:bg-zinc-900/20 transition-all cursor-pointer group"
                            >
                               {isUploading ? <Loader2 className="w-8 h-8 text-[#3E63DD] animate-spin" /> : <ImageIcon className="w-8 h-8 text-zinc-800 group-hover:text-zinc-600 transition-all" />}
                               <div className="text-[10px] font-black text-zinc-700 uppercase tracking-widest group-hover:text-zinc-500">Inject_Asset</div>
                            </div>
                            
                            <AnimatePresence>
                               {aiMediaConcept && (
                                 <motion.div 
                                   initial={{ opacity: 0, scale: 0.95 }}
                                   animate={{ opacity: 1, scale: 1 }}
                                   className="p-4 bg-[#3E63DD]/5 border border-[#3E63DD]/20 rounded-2xl relative"
                                 >
                                    <div className="text-[8px] font-black text-[#3E63DD] uppercase tracking-widest mb-1 flex items-center gap-2">
                                       <Sparkles className="w-2.5 h-2.5" /> AI_CONCEPT_GEN
                                    </div>
                                    <p className="text-[10px] text-zinc-400 font-medium leading-relaxed">{aiMediaConcept}</p>
                                    <button onClick={() => setAiMediaConcept(null)} className="absolute top-3 right-3 text-zinc-700 hover:text-zinc-400"><X className="w-3.5 h-3.5" /></button>
                                 </motion.div>
                               )}
                            </AnimatePresence>
                         </div>
                       )}
                    </div>
                </div>
            </div>
         </div>

         {/* Platform Preview Sidebar */}
         <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center justify-between px-2">
               <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 flex items-center gap-2">
                  <Search className="w-4 h-4" /> Live_Signal_Inspection
               </h2>
               <div className="text-[9px] font-mono text-zinc-800">NODES::{selectedAccountIds.length}</div>
            </div>

            <div className="space-y-6 max-h-[1200px] overflow-y-auto pr-2 custom-scrollbar">
               {selectedAccountIds.length === 0 ? (
                  <div className="py-48 flex flex-col items-center justify-center opacity-20 text-center grayscale">
                     <Workflow className="w-16 h-16 text-zinc-800 mb-6" />
                     <p className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-700 max-w-[200px] leading-loose">
                        Select operational node to initialize preview matrix
                     </p>
                  </div>
               ) : (
                  <AnimatePresence mode="popLayout">
                     {selectedAccountIds.map(id => {
                        const acc = accounts.find(a => a.id === id);
                        if (!acc) return null;
                        return (
                           <PreviewCard key={acc.id} account={acc} content={content} mediaUrl={mediaUrl} />
                        );
                     })}
                  </AnimatePresence>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
