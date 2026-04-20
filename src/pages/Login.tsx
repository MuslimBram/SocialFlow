import React from 'react';
import { motion } from 'motion/react';
import { LogIn, Share2, Sparkles, Calendar, Clock, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const { login } = useAuth();

  return (
    <div className="min-h-screen bg-[#0A0B0E] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Immersive background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#3E63DD]/5 blur-[160px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#3E63DD]/10 blur-[120px] rounded-full" />
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#3E63DD 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex items-center gap-3 mb-8">
               <div className="w-12 h-12 bg-[#3E63DD] rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/20">
                  <Share2 className="w-7 h-7 text-white" />
               </div>
               <span className="text-sm font-black uppercase tracking-[0.4em] text-zinc-600">Unified_Control_v4.2</span>
            </div>
            
            <h1 className="text-[120px] leading-[0.85] font-black tracking-tighter text-white mb-6">
              SOCIAL<br />
              <span className="text-[#3E63DD]">FLOW</span>
            </h1>
            
            <p className="max-w-md text-lg text-zinc-500 font-medium leading-relaxed mb-10">
              The next-generation Media OS for high-performance content teams. Orchestrate your global presence from a single, unified signal terminal.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
               <FeatureBadge icon={<Sparkles className="w-3 h-3" />} text="Neural Engine" />
               <FeatureBadge icon={<Clock className="w-3 h-3" />} text="Auto-Queue" />
               <FeatureBadge icon={<BarChart3 className="w-3 h-3" />} text="RT-Analytics" />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:justify-self-end"
        >
          <div className="w-full max-w-md bento-card border-zinc-900 bg-[#15181E]/40 backdrop-blur-xl p-10">
            <div className="mb-10">
               <h2 className="text-xl font-black uppercase tracking-tight text-white mb-2">Access Terminal</h2>
               <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest leading-none">Authorization Required</p>
            </div>

            <div className="space-y-6">
               <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                     <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Protocol</span>
                     <span className="text-[9px] font-black text-[#3E63DD] uppercase tracking-widest">Federated_Login</span>
                  </div>
                  <button 
                    onClick={login}
                    className="w-full h-14 bg-white text-zinc-950 font-black text-xs uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 hover:bg-[#3E63DD] hover:text-white transition-all duration-300 cursor-pointer group shadow-xl shadow-white/5 active:scale-95"
                  >
                    <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    Initialize System
                  </button>
               </div>

               <div className="pt-6 border-t border-zinc-900 grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                     <div className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">System_Status</div>
                     <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] text-zinc-500 font-bold uppercase">Ready</span>
                     </div>
                  </div>
                  <div className="space-y-1">
                     <div className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Encryption</div>
                     <div className="text-[10px] text-zinc-500 font-bold uppercase">AES-256_ACTIVE</div>
                  </div>
               </div>
            </div>

            <p className="mt-10 text-[9px] text-zinc-600 font-medium leading-relaxed italic group hover:text-zinc-500 transition-colors cursor-default">
              "Efficiency is doing things right; effectiveness is doing the right things." - Connection to SocialFlow core network active.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Hardware-style bottom bar */}
      <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between border-t border-zinc-900 pt-6 px-4 hidden lg:flex">
         <div className="flex gap-8">
            <div className="flex flex-col">
               <span className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.2em]">Revision</span>
               <span className="text-[10px] text-zinc-500 font-mono italic">v4.2.0-STABLE</span>
            </div>
            <div className="flex flex-col">
               <span className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.2em]">Hash</span>
               <span className="text-[10px] text-zinc-500 font-mono italic">#7FA89DE_SOC</span>
            </div>
         </div>
         <div className="flex gap-4">
            <span className="text-[9px] text-zinc-700 font-black uppercase tracking-widest">SOCIALFLOW_OS // 2026</span>
         </div>
      </div>
    </div>
  );
}

function FeatureBadge({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/50 rounded-xl border border-zinc-800/50 backdrop-blur-md">
      <div className="text-[#3E63DD]">{icon}</div>
      <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{text}</span>
    </div>
  );
}
