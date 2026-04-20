import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Command, 
  Zap, 
  PenBox, 
  BarChart3, 
  Settings as SettingsIcon,
  Users,
  Image as ImageIcon,
  Calendar,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const commands = [
    { id: 'compose', label: 'Create New Post', icon: PenBox, path: '/compose' },
    { id: 'analytics', label: 'View Analytics', icon: BarChart3, path: '/analytics' },
    { id: 'media', label: 'Open Media Library', icon: ImageIcon, path: '/media' },
    { id: 'calendar', label: 'Open Content Calendar', icon: Calendar, path: '/calendar' },
    { id: 'team', label: 'Manage Team Access', icon: Users, path: '/team' },
    { id: 'settings', label: 'System Settings', icon: SettingsIcon, path: '/settings' }
  ];

  const filtered = commands.filter(c => c.label.toLowerCase().includes(search.toLowerCase()));

  const runCommand = (path: string) => {
    navigate(path);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 pointer-events-none">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md pointer-events-auto"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="w-full max-w-xl bg-[#15181E] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl relative z-[110] pointer-events-auto"
          >
             <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                <input 
                   autoFocus
                   type="text"
                   placeholder="Type a command or signal name..."
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                   className="w-full bg-transparent p-6 pl-16 text-lg text-white placeholder:text-zinc-800 focus:outline-none border-b border-zinc-900"
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
                   <span className="px-2 py-1 bg-zinc-950 border border-zinc-800 rounded text-[10px] font-black text-zinc-600">ESC</span>
                </div>
             </div>

             <div className="p-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                {filtered.length === 0 ? (
                   <div className="py-20 text-center opacity-40">
                      <Zap className="w-8 h-8 text-zinc-800 mx-auto mb-4" />
                      <p className="text-[10px] font-black uppercase tracking-[0.2em]">No operational signals matching your query</p>
                   </div>
                ) : (
                   <div className="space-y-1">
                      <div className="px-3 py-2 text-[8px] font-black text-zinc-700 uppercase tracking-[0.3em]">Operational Shortcuts</div>
                      {filtered.map(cmd => (
                        <button 
                          key={cmd.id}
                          onClick={() => runCommand(cmd.path)}
                          className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-[#3E63DD] hover:text-white transition-all text-zinc-400 group text-left cursor-pointer"
                        >
                           <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-900 flex items-center justify-center group-hover:bg-[#3E63DD] group-hover:border-white/20 transition-all">
                              <cmd.icon className="w-5 h-5 group-hover:text-white" />
                           </div>
                           <span className="text-sm font-bold flex-1">{cmd.label}</span>
                           <span className="text-[10px] opacity-0 group-hover:opacity-60 font-mono tracking-widest text-white">EXECUTE_SIGNAL</span>
                        </button>
                      ))}
                   </div>
                )}
             </div>

             <div className="bg-zinc-950 p-4 border-t border-zinc-900 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                     <span className="w-4 h-4 bg-zinc-900 border border-zinc-800 rounded flex items-center justify-center text-[10px] font-mono text-zinc-500">↑↓</span>
                     <span className="text-[9px] font-bold text-zinc-700 uppercase">Navigate</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                     <span className="w-4 h-4 bg-zinc-900 border border-zinc-800 rounded flex items-center justify-center text-[10px] font-mono text-zinc-500">↵</span>
                     <span className="text-[9px] font-bold text-zinc-700 uppercase">Select</span>
                  </div>
                </div>
                <div className="text-[9px] font-black text-zinc-800 uppercase tracking-widest">SocialFlow Command Palette v1.0</div>
             </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
