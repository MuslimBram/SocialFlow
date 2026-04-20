import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { db, collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, deleteDoc, doc } from '../lib/firebase';
import { 
  Image as ImageIcon, 
  Search, 
  Filter, 
  Layout, 
  Grid, 
  List, 
  Plus, 
  Download,
  Trash2,
  ExternalLink,
  MoreVertical,
  X,
  Loader2,
  AlertCircle,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface Asset {
  id: string;
  url: string;
  type: 'image' | 'video';
  mimeType: string;
  size: number;
  name: string;
  createdAt: any;
}

export function MediaLibrary() {
  const { activeWorkspace } = useWorkspace();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!activeWorkspace) return;
    
    // Subscribe to the dedicated media collection
    const q = query(
      collection(db, `workspaces/${activeWorkspace.id}/media`), 
      orderBy('createdAt', 'desc')
    );
    
    const unsub = onSnapshot(q, (snapshot) => {
      const mediaList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Asset));
      setAssets(mediaList);
    }, (err) => {
      console.error(err);
      setError("Failed to synchronize with Asset Database.");
    });

    return () => unsub();
  }, [activeWorkspace]);

  const handleIngestPayload = async () => {
    if (!activeWorkspace) return;
    setIsUploading(true);
    setError(null);
    try {
      // Simulate real file selection and upload
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newAsset = {
        url: `https://picsum.photos/seed/${Math.random()}/1200/800`,
        type: 'image',
        mimeType: 'image/jpeg',
        size: Math.floor(200000 + Math.random() * 800000),
        name: `SIGNAL_ASSET_${Math.random().toString(36).substring(7).toUpperCase()}.JPG`,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, `workspaces/${activeWorkspace.id}/media`), newAsset);
    } catch (err) {
      setError("Asset ingestion protocol failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const handlePurge = async (assetId: string) => {
    if (!activeWorkspace) return;
    if (confirm("Executing PURGE protocol will permanently delete this asset segment. Proceed?")) {
      try {
        await deleteDoc(doc(db, `workspaces/${activeWorkspace.id}/media`, assetId));
        if (selectedAsset?.id === assetId) setSelectedAsset(null);
      } catch (err) {
        setError("Purge execution failed.");
      }
    }
  };

  const filteredAssets = assets.filter(a => a.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight mb-2">Asset Matrix</h1>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] opacity-60 leading-none">Global media objects & mission components</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-3 bg-zinc-950 border border-zinc-900 text-zinc-500 px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-zinc-900 hover:text-zinc-300 transition-all active:scale-95 group">
              <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
              Manifest_Export
           </button>
           <button 
             onClick={handleIngestPayload}
             disabled={isUploading}
             className="flex items-center gap-3 bg-[#3E63DD] text-white px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/10 active:scale-95 group disabled:opacity-50"
           >
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />}
              {isUploading ? "Uploading..." : "Ingest_Payload"}
           </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-[11px] font-black uppercase tracking-widest animate-pulse">
           <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
         <div className="lg:col-span-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 bg-[#0d0f13] p-5 rounded-3xl border border-zinc-900 shadow-2xl">
               <div className="relative flex-1 max-w-xl">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700" />
                  <input 
                     type="text"
                     placeholder="QUERY_ASSET_DATABASE..."
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                     className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-14 pr-5 py-4 text-xs text-white font-bold tracking-tight focus:outline-none focus:border-[#3E63DD]/50 transition-all placeholder:text-zinc-800 placeholder:font-black placeholder:uppercase placeholder:tracking-widest"
                  />
               </div>

               <div className="flex items-center gap-4">
                  <div className="flex bg-zinc-950 rounded-2xl p-1.5 border border-zinc-900 shadow-inner">
                     <button 
                       onClick={() => setViewMode('grid')}
                       className={cn(
                         "p-3 rounded-xl transition-all cursor-pointer", 
                         viewMode === 'grid' ? "bg-zinc-800 text-[#3E63DD] shadow-lg" : "text-zinc-700 hover:text-zinc-500"
                       )}
                     >
                        <Grid className="w-5 h-5" />
                     </button>
                     <button 
                       onClick={() => setViewMode('list')}
                       className={cn(
                         "p-3 rounded-xl transition-all cursor-pointer", 
                         viewMode === 'list' ? "bg-zinc-800 text-[#3E63DD] shadow-lg" : "text-zinc-700 hover:text-zinc-500"
                       )}
                     >
                        <List className="w-5 h-5" />
                     </button>
                  </div>
                  <button className="flex items-center gap-3 px-6 py-4 bg-zinc-950 border border-zinc-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 hover:text-white hover:border-zinc-800 transition-all group">
                     <Filter className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                     Sub_Filter
                  </button>
               </div>
            </div>

            {assets.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-48 bg-[#0d0f13] rounded-[2.5rem] border border-zinc-900 border-dashed opacity-40">
                  <div className="w-20 h-20 rounded-3xl bg-zinc-950 border border-zinc-900 flex items-center justify-center mb-8">
                     <FileText className="w-10 h-10 text-zinc-800" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700">No media nodes detected in registry</p>
                  <button 
                    onClick={handleIngestPayload}
                    className="mt-6 text-[9px] font-black text-[#3E63DD] uppercase tracking-[0.2em] hover:underline cursor-pointer"
                  >
                    Initiate First Ingestion
                  </button>
               </div>
            ) : (
               <div className={cn(
                  "grid gap-6",
                  viewMode === 'grid' ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" : "grid-cols-1"
               )}>
                  <AnimatePresence initial={false}>
                     {filteredAssets.map((asset, i) => (
                       <motion.div
                          key={asset.id}
                          layout
                          initial={{ opacity: 0, scale: 0.9, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ delay: i * 0.03, type: "spring", damping: 20 }}
                       >
                          <AssetCard asset={asset} mode={viewMode} onSelect={() => setSelectedAsset(asset)} onPurge={handlePurge} />
                       </motion.div>
                     ))}
                  </AnimatePresence>
               </div>
            )}
         </div>
      </div>

      {/* Quick Access Overlay */}
      <AnimatePresence>
         {selectedAsset && (
            <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[60] flex items-center justify-center p-8 overflow-hidden">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.9 }}
                 className="w-full max-w-6xl flex flex-col md:flex-row h-full gap-8"
               >
                  <div className="flex-1 bg-[#0d0f13] rounded-[2.5rem] border border-zinc-800 p-8 flex items-center justify-center relative overflow-hidden group">
                     <div className="absolute top-8 right-8 z-10">
                        <button 
                          onClick={() => setSelectedAsset(null)}
                          className="w-12 h-12 rounded-2xl bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
                        >
                           <X className="w-6 h-6" />
                        </button>
                     </div>
                     <img 
                       src={selectedAsset.url} 
                       className="max-w-full max-h-full object-contain rounded-xl shadow-2xl relative z-0" 
                       referrerPolicy="no-referrer"
                     />
                  </div>
                  
                  <div className="w-full md:w-96 space-y-6">
                     <div className="bento-card p-8 border-zinc-900 bg-[#0d0f13]">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-8">Asset_Metadata</h3>
                        <div className="space-y-6 font-mono">
                           <MetaRow label="FILENAME" value={selectedAsset.name} />
                           <MetaRow label="UUID" value={selectedAsset.id} />
                           <MetaRow label="MIME_TYPE" value={selectedAsset.mimeType} />
                           <MetaRow label="MAGNITUDE" value={`${(selectedAsset.size / 1024).toFixed(1)} KB`} />
                           <MetaRow label="ORIGIN_SIGNAL" value="USER_UPLINK" />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 mt-10">
                           <button className="flex items-center justify-center gap-2 py-4 bg-zinc-950 border border-zinc-900 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#3E63DD] hover:bg-[#3E63DD] hover:text-white transition-all cursor-pointer">
                              <Download className="w-4 h-4" /> B_ST_DL
                           </button>
                           <button 
                             onClick={() => handlePurge(selectedAsset.id)}
                             className="flex items-center justify-center gap-2 py-4 bg-zinc-950 border border-red-900/40 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                           >
                              <Trash2 className="w-4 h-4" /> PURGE
                           </button>
                        </div>
                     </div>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
}

function AssetCard({ asset, mode, onSelect, onPurge }: { asset: Asset, mode: 'grid' | 'list', onSelect: () => void, onPurge: (id: string) => void }) {
  const sizeKb = (asset.size / 1024).toFixed(0);

  if (mode === 'list') {
    return (
      <div 
        onClick={onSelect}
        className="bento-card flex items-center gap-6 p-5 border-zinc-900 bg-[#0d0f13] hover:border-[#3E63DD]/40 transition-all group cursor-pointer active:scale-[0.99]"
      >
         <div className="w-16 h-16 rounded-2xl overflow-hidden border border-zinc-800 shrink-0">
            <img src={asset.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
         </div>
         <div className="flex-1">
            <div className="text-[13px] font-black text-white mb-1 group-hover:text-[#3E63DD] transition-colors">{asset.name}</div>
            <div className="text-[10px] font-mono text-zinc-700 tracking-tight uppercase font-black tracking-[0.2em]">OBJ_PTR :: {asset.id.substring(0,12)}</div>
         </div>
         <div className="hidden md:block">
            <div className="text-[9px] font-black text-zinc-700 uppercase tracking-widest mb-1">Magnitude</div>
            <div className="text-[10px] text-zinc-500 font-mono font-black">{sizeKb} KB</div>
         </div>
         <div className="flex items-center gap-2">
            <button className="p-3 text-zinc-700 hover:text-white rounded-xl hover:bg-zinc-800 transition-all"><Download className="w-4 h-4" /></button>
            <button 
              onClick={(e) => { e.stopPropagation(); onPurge(asset.id); }}
              className="p-3 text-zinc-700 hover:text-red-500 rounded-xl hover:bg-red-500/10 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
         </div>
      </div>
    );
  }

  return (
    <div 
      onClick={onSelect}
      className="bento-card p-0 overflow-hidden border-zinc-900 bg-[#0d0f13] group hover:border-[#3E63DD]/40 transition-all flex flex-col h-full cursor-pointer active:scale-[0.98]"
    >
       <div className="relative aspect-square overflow-hidden bg-zinc-950">
          <img src={asset.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
             <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white">
                <ExternalLink className="w-5 h-5" />
             </div>
          </div>
          <div className="absolute top-4 left-4 px-2.5 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg text-[8px] font-black text-white uppercase tracking-[0.2em] shadow-2xl">
             {asset.mimeType.split('/')[1]}
          </div>
       </div>
       <div className="p-5 flex flex-col flex-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity">
             <div className="w-1.5 h-1.5 rounded-full bg-[#3E63DD]" />
          </div>
          <div className="flex items-center justify-between mb-4">
             <span className="text-[11px] font-black text-white/90 truncate group-hover:text-white transition-colors">{asset.name}</span>
          </div>
          <div className="mt-auto flex items-end justify-between">
             <div>
                <div className="text-[8px] font-black text-zinc-700 uppercase tracking-widest mb-1">Capacity</div>
                <div className="text-[9px] font-mono text-zinc-500 font-bold">{sizeKb} KB</div>
             </div>
             <span className="text-[8px] font-black text-zinc-800 uppercase tracking-widest bg-zinc-950 px-2 py-1 rounded-md border border-zinc-900 group-hover:border-[#3E63DD]/20 transition-colors">V_NODE</span>
          </div>
       </div>
    </div>
  );
}

function MetaRow({ label, value }: { label: string, value: string }) {
   return (
      <div className="space-y-1.5">
         <div className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.3em]">{label}</div>
         <div className="text-[11px] font-black text-zinc-400 break-all leading-tight tracking-tight">{value}</div>
      </div>
   );
}
