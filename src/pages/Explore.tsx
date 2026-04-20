import React, { useState } from 'react';
import { 
  Globe, 
  Search, 
  Rss, 
  TrendingUp, 
  Zap, 
  Newspaper, 
  Hash, 
  ChevronRight,
  Plus,
  Filter,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface FeedSource {
  id: string;
  name: string;
  category: string;
  subscribers: string;
  type: 'rss' | 'social' | 'news';
}

const SOURCES: FeedSource[] = [
  { id: '1', name: 'TechCrunch', category: 'Technology', subscribers: '1.2M', type: 'news' },
  { id: '2', name: 'The Verge', category: 'Culture', subscribers: '800K', type: 'news' },
  { id: '3', name: 'Digital Marketing Daily', category: 'Marketing', subscribers: '450K', type: 'rss' },
  { id: '4', name: 'Social Media Today', category: 'Marketing', subscribers: '620K', type: 'news' },
  { id: '5', name: 'Gizmodo', category: 'Gadgets', subscribers: '300K', type: 'news' },
  { id: '6', name: 'Wired', category: 'Innovation', subscribers: '1.5M', type: 'news' },
];

const CURATED_ARTICLES = [
  {
    title: "The Future of AI in Social Content Generation",
    source: "TechPulse",
    time: "2h ago",
    image: "https://picsum.photos/seed/ai-tech/600/400",
    excerpt: "New research shows that AI-assisted content has 40% higher engagement when personalized with human-centric narratives."
  },
  {
    title: "How to Build a Sustainable Brand in 2026",
    source: "Modern Marketing",
    time: "5h ago",
    image: "https://picsum.photos/seed/brand/600/400",
    excerpt: "Consistency is key, but authenticity is the engine. Discover the 5 pillars of modern brand building."
  },
  {
    title: "10 Viral Trends to Watch This Month",
    source: "Social Buzz",
    time: "1h ago",
    image: "https://picsum.photos/seed/trends/600/400",
    excerpt: "From lo-fi edits to audio-first storytelling, here are the trends dominating the digital landscape."
  }
];

export function Explore() {
  const [activeTab, setActiveTab] = useState<'discover' | 'rss' | 'trending'>('discover');
  const [selectedSources, setSelectedSources] = useState<string[]>(['1', '3']);

  const toggleSource = (id: string) => {
    setSelectedSources(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight mb-2">Explore Matrix</h1>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] opacity-60 leading-none">Global signal discovery & RSS integration</p>
        </div>
        
        <div className="flex bg-zinc-950 p-1 rounded-2xl border border-zinc-900">
          <TabButton 
            active={activeTab === 'discover'} 
            onClick={() => setActiveTab('discover')} 
            label="Discover" 
            icon={Globe} 
          />
          <TabButton 
            active={activeTab === 'rss'} 
            onClick={() => setActiveTab('rss')} 
            label="RSS_Feeds" 
            icon={Rss} 
          />
          <TabButton 
            active={activeTab === 'trending'} 
            onClick={() => setActiveTab('trending')} 
            label="Trends" 
            icon={TrendingUp} 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left: Feed Area */}
        <div className="xl:col-span-8 space-y-6">
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-[#3E63DD] transition-colors" />
              <input 
                 type="text" 
                 placeholder="Search across 150,000+ sources..."
                 className="w-full bg-black border border-zinc-900 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white placeholder:text-zinc-800 focus:outline-none focus:border-[#3E63DD]/40 transition-all bg-[#0d0f13]"
              />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CURATED_ARTICLES.map((article, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bento-card p-0 overflow-hidden group/card bg-[#0d0f13] border-zinc-900"
                >
                   <div className="relative h-48 overflow-hidden grayscale-[0.6] group-hover/card:grayscale-0 transition-all duration-700">
                      <img src={article.image} className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110" referrerPolicy="no-referrer" />
                      <div className="absolute top-4 left-4 px-2 py-1 bg-black/60 backdrop-blur-md rounded border border-white/10 text-[8px] font-black uppercase tracking-widest text-white">
                         {article.source}
                      </div>
                   </div>
                   <div className="p-6">
                      <div className="text-[9px] font-mono text-zinc-600 mb-3 uppercase tracking-tighter">{article.time} // Signal_Captured</div>
                      <h3 className="text-sm font-black text-white leading-tight mb-3 group-hover/card:text-[#3E63DD] transition-colors line-clamp-2">{article.title}</h3>
                      <p className="text-[11px] text-zinc-500 font-medium leading-relaxed mb-6 line-clamp-2">{article.excerpt}</p>
                      <div className="flex items-center justify-between">
                         <button className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-all">
                            Read Summary <ChevronRight className="w-3 h-3" />
                         </button>
                         <button className="p-2 bg-zinc-950 border border-zinc-900 rounded-xl text-[#3E63DD] hover:bg-[#3E63DD] hover:text-white transition-all shadow-lg active:scale-95">
                            <Plus className="w-4 h-4" />
                         </button>
                      </div>
                   </div>
                </motion.div>
              ))}
           </div>
           
           <div className="p-8 border-2 border-dashed border-zinc-900/50 rounded-3xl flex flex-col items-center justify-center text-center opacity-40 hover:opacity-100 transition-all cursor-pointer group">
              <RefreshCw className="w-8 h-8 text-zinc-800 mb-4 group-hover:rotate-180 transition-transform duration-1000" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700">Syncing deeper archive signals...</p>
           </div>
        </div>

        {/* Right: Sources & Filters */}
        <div className="xl:col-span-4 space-y-6">
           <div className="bento-card border-zinc-900 bg-[#0d0f13] p-6 shadow-xl">
              <div className="flex items-center justify-between mb-8">
                 <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 flex items-center gap-2">
                    <Filter className="w-4 h-4" /> Source_Filter
                 </h2>
                 <span className="text-[9px] font-mono text-zinc-800">ACTIVE::{selectedSources.length}</span>
              </div>

              <div className="space-y-3">
                 {SOURCES.map(source => (
                    <button 
                      key={source.id}
                      onClick={() => toggleSource(source.id)}
                      className={cn(
                        "w-full p-4 rounded-2xl flex items-center justify-between border transition-all group",
                        selectedSources.includes(source.id) 
                          ? "bg-[#3E63DD]/5 border-[#3E63DD]/40" 
                          : "bg-zinc-950 border-zinc-900 hover:border-zinc-800"
                      )}
                    >
                       <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center border",
                            selectedSources.includes(source.id) ? "bg-[#3E63DD] border-white/20 text-white" : "bg-black border-zinc-900 text-zinc-600"
                          )}>
                             {source.type === 'rss' ? <Rss className="w-3.5 h-3.5" /> : <Newspaper className="w-3.5 h-3.5" />}
                          </div>
                          <div className="text-left">
                             <div className={cn("text-[11px] font-black tracking-tight", selectedSources.includes(source.id) ? "text-white" : "text-zinc-500")}>{source.name}</div>
                             <div className="text-[8px] font-mono text-zinc-700 uppercase">{source.subscribers} Subs</div>
                          </div>
                       </div>
                       {selectedSources.includes(source.id) ? (
                         <CheckCircle2 className="w-4 h-4 text-[#3E63DD]" />
                       ) : (
                         <div className="w-4 h-4 rounded-full border border-zinc-900 group-hover:border-zinc-700" />
                       )}
                    </button>
                 ))}
              </div>

              <button className="w-full mt-6 py-4 bg-zinc-950 border border-zinc-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-[#3E63DD] hover:bg-[#3E63DD] hover:text-white transition-all shadow-lg active:scale-[0.98]">
                 Deploy Custom RSS URL
              </button>
           </div>

           <div className="bento-card border-none bg-gradient-to-br from-purple-900/20 to-blue-900/20 p-6 flex flex-col gap-4">
              <h3 className="text-white font-black text-sm tracking-tight flex items-center gap-2">
                 <Zap className="w-4 h-4 text-amber-400" /> Auto-Discovery
              </h3>
              <p className="text-[11px] text-zinc-400 font-medium leading-loose leading-relaxed">
                 AI will monitor your selected sources and suggest high-resonance content patterns automatically.
              </p>
              <div className="flex items-center gap-2">
                 <div className="flex -space-x-2">
                    {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-[#121419] bg-zinc-800" />)}
                 </div>
                 <span className="text-[9px] font-black uppercase tracking-widest text-[#3E63DD]">Active monitoring</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, label, icon: Icon }: { active: boolean, onClick: () => void, label: string, icon: any }) {
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
