import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { CommandPalette } from './CommandPalette';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';

export function Layout() {
  const location = useLocation();

  return (
    <div className="flex bg-zinc-950 text-white min-h-screen">
      <Sidebar />
      <main className="flex-1 h-screen overflow-y-auto bg-[#0A0B0E]">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.01 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="p-4 md:p-8 max-w-[1400px] mx-auto w-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <CommandPalette />
      
      {/* Help Hint */}
      <div className="fixed bottom-4 right-6 hidden lg:flex items-center gap-2 px-3 py-1.5 bg-zinc-950 border border-zinc-900 rounded-lg text-[10px] text-zinc-600 font-black uppercase tracking-widest shadow-2xl z-40">
         <span className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded">CMD</span>
         <span>+</span>
         <span className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded">K</span>
         <span className="ml-2">to search signals</span>
      </div>
    </div>
  );
}
