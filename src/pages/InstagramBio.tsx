import React, { useState } from 'react';
import { 
  Instagram, 
  Smartphone, 
  Plus, 
  GripVertical, 
  Trash2, 
  ExternalLink, 
  Palette, 
  Eye, 
  Share2, 
  BarChart2,
  Settings as SettingsIcon,
  Layout,
  CheckCircle2,
  Copy,
  Link2
} from 'lucide-react';
import { motion, Reorder, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

interface BioLink {
  id: string;
  title: string;
  url: string;
  enabled: boolean;
}

export function InstagramBio() {
  const { user } = useAuth();
  const [links, setLinks] = useState<BioLink[]>([
    { id: '1', title: 'Visit Website', url: 'https://example.com', enabled: true },
    { id: '2', title: 'New Collection', url: 'https://example.com/shop', enabled: true },
    { id: '3', title: 'Book a Call', url: 'https://calendly.com', enabled: false },
  ]);
  const [activeTab, setActiveTab] = useState<'links' | 'design' | 'analytics'>('links');
  const [previewMode, setPreviewMode] = useState<'mobile' | 'list'>('mobile');

  const addLink = () => {
    const newLink: BioLink = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'New Link',
      url: 'https://',
      enabled: true,
    };
    setLinks([newLink, ...links]);
  };

  const removeLink = (id: string) => {
    setLinks(links.filter(l => l.id !== id));
  };

  const updateLink = (id: string, data: Partial<BioLink>) => {
    setLinks(links.map(l => l.id === id ? { ...l, ...data } : l));
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight mb-2">Instagram_Bio_Core</h1>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] opacity-60 leading-none">Multiplex link routing & visual engagement</p>
        </div>
        
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-4 py-2 bg-zinc-950 border border-zinc-900 rounded-xl text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all">
              <Copy className="w-3.5 h-3.5" /> Copy_Bio_URL
           </button>
           <div className="w-px h-6 bg-zinc-900" />
           <button className="flex items-center gap-2 px-6 py-2.5 bg-[#3E63DD] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95">
              <Share2 className="w-3.5 h-3.5" /> Publish_Signal
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
         {/* Editor Area */}
         <div className="xl:col-span-7 space-y-6">
            <div className="flex bg-zinc-950 p-1 rounded-2xl border border-zinc-900 w-fit">
               <NavTab active={activeTab === 'links'} onClick={() => setActiveTab('links')} label="Link_Nodes" icon={Link2} />
               <NavTab active={activeTab === 'design'} onClick={() => setActiveTab('design')} label="Visual_Skin" icon={Palette} />
               <NavTab active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} label="Hit_Matrix" icon={BarChart2} />
            </div>

            <div className="space-y-4">
               {activeTab === 'links' && (
                 <>
                    <button 
                      onClick={addLink}
                      className="w-full py-6 bg-[#3E63DD]/5 border-2 border-dashed border-[#3E63DD]/20 rounded-3xl flex flex-col items-center justify-center gap-2 hover:bg-[#3E63DD]/10 hover:border-[#3E63DD]/40 transition-all group"
                    >
                       <Plus className="w-6 h-6 text-[#3E63DD] group-hover:scale-125 transition-transform" />
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3E63DD]">Initialize_New_Link_Node</span>
                    </button>

                    <Reorder.Group axis="y" values={links} onReorder={setLinks} className="space-y-4">
                       {links.map((link) => (
                         <Reorder.Item 
                           key={link.id} 
                           value={link}
                           className="bento-card p-6 bg-[#0d0f13] border-zinc-900 flex items-center gap-6 group/link"
                         >
                            <GripVertical className="w-5 h-5 text-zinc-800 cursor-grab active:cursor-grabbing hover:text-zinc-600 transition-colors shrink-0" />
                            <div className="flex-1 space-y-3">
                               <input 
                                 type="text" 
                                 value={link.title}
                                 onChange={(e) => updateLink(link.id, { title: e.target.value })}
                                 className="w-full bg-transparent text-sm font-black text-white focus:outline-none placeholder:text-zinc-800"
                                 placeholder="Node_Title"
                               />
                               <div className="flex items-center gap-2">
                                  <Link2 className="w-3.5 h-3.5 text-zinc-700" />
                                  <input 
                                    type="text" 
                                    value={link.url}
                                    onChange={(e) => updateLink(link.id, { url: e.target.value })}
                                    className="flex-1 bg-transparent text-[10px] font-mono text-zinc-500 focus:outline-none"
                                    placeholder="https://routing_path..."
                                  />
                               </div>
                            </div>
                            <div className="flex items-center gap-4">
                               <button 
                                 onClick={() => updateLink(link.id, { enabled: !link.enabled })}
                                 className={cn(
                                   "w-12 h-6 rounded-full transition-all relative p-1",
                                   link.enabled ? "bg-[#3E63DD]" : "bg-zinc-800"
                                 )}
                               >
                                  <div className={cn(
                                    "w-4 h-4 rounded-full bg-white transition-all shadow-sm",
                                    link.enabled ? "translate-x-6" : "translate-x-0"
                                  )} />
                               </button>
                               <button 
                                 onClick={() => removeLink(link.id)}
                                 className="p-2 text-zinc-800 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                               >
                                  <Trash2 className="w-4 h-4" />
                               </button>
                            </div>
                         </Reorder.Item>
                       ))}
                    </Reorder.Group>
                 </>
               )}

               {activeTab === 'design' && (
                  <div className="bento-card p-10 text-center flex flex-col items-center justify-center gap-6 opacity-30 grayscale min-h-[400px]">
                     <Palette className="w-12 h-12" />
                     <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500">Skin_Editor_Restricted</h3>
                     <p className="text-[10px] font-medium max-w-xs leading-relaxed uppercase tracking-widest">Upgrade to SocialFlow PRO to customize visual shaders and brand layouts.</p>
                  </div>
               )}
            </div>
         </div>

         {/* Preview Area */}
         <div className="xl:col-span-5 flex justify-center sticky top-10">
            <div className="relative w-full max-w-[340px] aspect-[9/18.5] bg-[#050505] rounded-[3rem] border-[10px] border-[#1a1a1a] shadow-2xl p-6 overflow-hidden ring-1 ring-white/10 ring-inset">
               {/* Phone UI Header */}
               <div className="h-6 w-32 bg-[#1a1a1a] absolute top-0 left-1/2 -translate-x-1/2 rounded-b-2xl z-10" />
               <div className="flex items-center justify-between mb-10 mt-4 relative z-10">
                  <span className="text-[10px] font-bold text-white px-2 uppercase tracking-tighter transition-all">9:41</span>
                  <div className="flex gap-1.5 px-2 grayscale opacity-40">
                     <div className="w-3.5 h-3.5 rounded-full bg-white/20" />
                     <div className="w-3.5 h-3.5 rounded-full bg-white/20" />
                  </div>
               </div>

               {/* Bio Content */}
               <div className="flex flex-col items-center text-center space-y-6 relative z-10 h-full">
                  <div className="relative">
                     <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 mb-2">
                        <img 
                          src={user?.photoURL || "https://picsum.photos/seed/bio/200/200"} 
                          className="w-full h-full rounded-full border-4 border-[#050505] object-cover"
                          referrerPolicy="no-referrer"
                        />
                     </div>
                     <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-4 border-[#050505] shadow-lg" />
                  </div>

                  <div>
                     <h4 className="text-white font-black text-lg tracking-tight mb-1">{user?.displayName || "Social Explorer"}</h4>
                     <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest">@{user?.displayName?.toLowerCase().replace(/\s/g, '_') || 'socialflow_node'}</p>
                  </div>

                  <div className="w-full space-y-3 pt-6 overflow-y-auto no-scrollbar max-h-[350px]">
                     {links.filter(l => l.enabled).map((link, i) => (
                       <motion.a
                         key={link.id}
                         href={link.url}
                         target="_blank"
                         rel="noopener noreferrer"
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: i * 0.1 }}
                         className="w-full py-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex items-center justify-between px-6 hover:bg-[#3E63DD]/20 hover:border-[#3E63DD]/40 transition-all group"
                       >
                          <span className="text-xs font-black text-white group-hover:text-[#3E63DD] transition-colors">{link.title}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-zinc-700 group-hover:text-[#3E63DD] transition-colors" />
                       </motion.a>
                     ))}
                  </div>

                  <div className="mt-auto pt-8 flex items-center gap-3 opacity-40 grayscale">
                     <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800"><Instagram className="w-4 h-4 text-white" /></div>
                     <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800"><Smartphone className="w-4 h-4 text-white" /></div>
                  </div>
               </div>

               {/* Background Glow */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#3E63DD]/10 blur-[100px] rounded-full pointer-events-none" />
            </div>
         </div>
      </div>
    </div>
  );
}

function NavTab({ active, onClick, label, icon: Icon }: { active: boolean, onClick: () => void, label: string, icon: any }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
        active 
          ? "bg-[#3E63DD] text-white shadow-lg shadow-blue-500/20" 
          : "text-zinc-600 hover:text-white"
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      <span className="hidden md:inline">{label}</span>
    </button>
  );
}
