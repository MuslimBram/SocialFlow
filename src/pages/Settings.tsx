import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { useAuth } from '../context/AuthContext';
import { 
  Settings as SettingsIcon, 
  User, 
  Globe, 
  Shield, 
  CreditCard, 
  Trash2, 
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export function Settings() {
  const { user } = useAuth();
  const { activeWorkspace, updateWorkspace } = useWorkspace();
  const [wsName, setWsName] = useState(activeWorkspace?.name || '');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'workspace' | 'security' | 'billing'>('profile');

  const handleUpdateWorkspace = async () => {
    if (!activeWorkspace || !wsName) return;
    setSaving(true);
    try {
      await updateWorkspace(activeWorkspace.id, { name: wsName });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight mb-2">System Variables</h1>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] opacity-60 leading-none">Global environment & access parameters</p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="px-3 py-1.5 bg-[#3E63DD]/5 border border-[#3E63DD]/20 rounded-lg flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#3E63DD] animate-pulse" />
              <span className="text-[10px] font-black uppercase text-[#3E63DD] tracking-widest">Protocol_V2.1_Active</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Navigation / Secondary Sidebar */}
        <div className="md:col-span-3 space-y-2">
          <SettingsTab 
            icon={<User className="w-4 h-4" />} 
            label="Node Identity" 
            active={activeTab === 'profile'} 
            onClick={() => setActiveTab('profile')}
          />
          <SettingsTab 
            icon={<Globe className="w-4 h-4" />} 
            label="Root Workspace" 
            active={activeTab === 'workspace'} 
            onClick={() => setActiveTab('workspace')}
          />
          <SettingsTab 
            icon={<Shield className="w-4 h-4" />} 
            label="Firewall Ops" 
            active={activeTab === 'security'} 
            onClick={() => setActiveTab('security')}
          />
          <SettingsTab 
            icon={<CreditCard className="w-4 h-4" />} 
            label="Resource Billing" 
            active={activeTab === 'billing'} 
            onClick={() => setActiveTab('billing')}
          />
          
          <div className="mt-8 pt-6 border-t border-zinc-900 px-3">
             <div className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-4">Environment Stats</div>
             <div className="space-y-3 opacity-60">
                <div className="flex justify-between text-[9px] font-mono"><span className="text-zinc-500">Uptime</span> <span className="text-zinc-400">99.98%</span></div>
                <div className="flex justify-between text-[9px] font-mono"><span className="text-zinc-500">Latency</span> <span className="text-zinc-400">14ms</span></div>
             </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="md:col-span-9 space-y-6">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="bento-card p-6 border-zinc-900 bg-[#0d0f13]">
                   <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-8 flex items-center gap-2">
                      <User className="w-3.5 h-3.5" /> Core_Identity_Matrix
                   </h2>
                   <div className="flex flex-col md:flex-row items-center gap-8 pt-2">
                      <div className="relative group">
                        <img 
                          src={user?.photoURL || 'https://picsum.photos/seed/user/120/120'} 
                          className="w-24 h-24 rounded-3xl border border-zinc-800 group-hover:border-[#3E63DD] transition-all duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl flex items-center justify-center cursor-pointer">
                           <Save className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="space-y-4 flex-1">
                         <div className="space-y-1 text-center md:text-left">
                            <div className="text-2xl font-black tracking-tighter text-white">{user?.displayName || 'Social User'}</div>
                            <div className="text-xs text-zinc-500 font-mono tracking-wider">{user?.email}</div>
                         </div>
                         <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
                            <div className="text-[9px] text-zinc-400 font-black uppercase tracking-widest px-3 py-1 bg-zinc-950 border border-zinc-900 rounded-lg">
                               UID::{user?.uid.substring(0, 12)}
                            </div>
                            <div className="text-[9px] text-[#3E63DD] font-black uppercase tracking-widest px-3 py-1 bg-[#3E63DD]/5 border border-[#3E63DD]/10 rounded-lg">
                               LEVEL_01_ADMIN
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="bento-card p-6 border-zinc-900">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-6">Regional Settings</h3>
                      <div className="space-y-4">
                         <div className="space-y-2">
                            <label className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Timezone Node</label>
                            <div className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-3 text-xs text-zinc-400 font-mono">
                               UTC-07:00_PACIFIC
                            </div>
                         </div>
                      </div>
                   </div>
                   <div className="bento-card p-6 border-zinc-900 bg-black overflow-hidden relative">
                      <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-[#3E63DD] rounded-full blur-[60px] opacity-10" />
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-6">Activity Pulse</h3>
                      <div className="flex gap-1 items-end h-8 mb-4">
                         {[0.4, 0.7, 0.2, 0.9, 0.5, 0.8, 0.3, 0.6, 1, 0.4].map((v, i) => (
                           <div key={i} className="flex-1 bg-[#3E63DD]/40 rounded-t-sm" style={{ height: `${v * 100}%` }} />
                         ))}
                      </div>
                      <p className="text-[9px] text-zinc-500 font-mono">NODE_LAST_RESPONSE: 0.02ms ago</p>
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'workspace' && (
              <motion.div
                key="workspace"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Workspace Settings */}
                <div className="bento-card p-8 border-zinc-900 bg-[#0d0f13]">
                   <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-8">Root_Workspace_Parameters</h2>
                   <div className="space-y-8">
                      <div className="space-y-3">
                         <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Environment Title</label>
                         <input 
                            type="text" 
                            value={wsName}
                            onChange={(e) => setWsName(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-900 rounded-2xl px-5 py-4 text-sm text-white font-bold focus:outline-none focus:border-[#3E63DD] transition-all tracking-tight"
                            placeholder="SocialFlow Operational Node"
                         />
                      </div>

                      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4 border-t border-zinc-900/50">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-[#3E63DD]/5 border border-[#3E63DD]/10 flex items-center justify-center">
                               <Globe className="w-5 h-5 text-[#3E63DD]" />
                            </div>
                            <div>
                               <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Active Tier</div>
                               <div className="text-sm font-black text-white uppercase tracking-tighter">{activeWorkspace?.plan || 'Free'} PROTOCOL</div>
                            </div>
                         </div>
                         <button 
                            onClick={handleUpdateWorkspace}
                            disabled={saving}
                            className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-3.5 bg-[#3E63DD] text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-blue-600 transition-all cursor-pointer disabled:opacity-50 group shadow-xl shadow-blue-500/10 active:scale-95"
                         >
                            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : success ? <CheckCircle2 className="w-4 h-4" /> : (
                               <>
                                 Commit Variables <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                               </>
                            )}
                         </button>
                      </div>
                   </div>
                </div>

                {/* Danger Zone */}
                <div className="bento-card p-8 border-red-500/10 bg-red-500/5 group hover:bg-red-500/10 transition-all">
                   <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500/60 mb-8 flex items-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5" /> Self_Destruct_Sequence
                   </h2>
                   <p className="text-[11px] text-zinc-500 font-medium mb-8 leading-relaxed max-w-xl">
                      Executing a workspace termination will immediately purge all node data, including active publishing queues, archived resonance telemetry, and mission assets. This action is terminal and non-reversible.
                   </p>
                   <button className="flex items-center gap-3 px-8 py-3.5 bg-transparent border border-red-500/20 text-red-400 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-red-500 hover:text-white transition-all cursor-pointer active:scale-95">
                      <Trash2 className="w-4 h-4" />
                      Decommission Environment
                   </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="bento-card p-8 border-zinc-900 bg-[#0d0f13]">
                   <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-8 flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5" /> Firewall_Configurations
                   </h2>
                   <div className="space-y-6">
                      <SecurityToggle 
                        label="Multi-Factor Authentication" 
                        desc="Verify node access with an external secondary signal." 
                        enabled={true} 
                      />
                      <SecurityToggle 
                        label="Force Encryption" 
                        desc="Automatically encrypt all outgoing signal payloads." 
                        enabled={true} 
                      />
                      <SecurityToggle 
                        label="Log Trace Exposure" 
                        desc="Expose internal trace IDs in operational logs." 
                        enabled={false} 
                      />
                   </div>
                </div>

                <div className="bento-card p-8 border-zinc-900">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-6">Access Control Tokens</h3>
                   <div className="space-y-4">
                      <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-900 flex items-center justify-between">
                         <div className="flex flex-col">
                            <span className="text-[10px] font-black text-white uppercase mb-1">Production_Main_Key</span>
                            <span className="text-[10px] font-mono text-zinc-600">••••••••••••••••••••••••••••••••</span>
                         </div>
                         <button className="text-[10px] font-black text-[#3E63DD] uppercase tracking-widest hover:underline">Reveal</button>
                      </div>
                      <button className="w-full py-4 border border-dashed border-zinc-800 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 hover:text-white hover:border-zinc-700 transition-all">
                         Generate New Access Module
                      </button>
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'billing' && (
              <motion.div
                key="billing"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="bento-card p-8 border-zinc-900 bg-[#0d0f13]">
                   <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-8 flex items-center gap-2">
                      <CreditCard className="w-3.5 h-3.5" /> Resource_Consumption
                   </h2>
                   <div className="flex items-end justify-between mb-8">
                      <div>
                         <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Current Balance</div>
                         <div className="text-4xl font-black tracking-tighter text-white font-mono">$12,402<span className="text-zinc-700">.82</span></div>
                      </div>
                      <div className="text-right">
                         <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Cycle ends in</div>
                         <div className="text-xl font-black tracking-tight text-[#3E63DD]">12 Days</div>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-900">
                         <div className="h-full bg-[#3E63DD] w-[64%]" />
                      </div>
                      <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-zinc-600">
                         <span>Quota: 6.4k/10k Signals</span>
                         <span>64% Consumed</span>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="bento-card p-6 border-zinc-900">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-6">Active Plan</h3>
                      <div className="flex items-center gap-4 mb-6">
                         <div className="w-10 h-10 rounded-xl bg-[#3E63DD]/10 flex items-center justify-center border border-[#3E63DD]/20">
                            <RefreshCw className="w-5 h-5 text-[#3E63DD]" />
                         </div>
                         <div>
                            <div className="text-[11px] font-black text-white uppercase">Enterprise Protocol</div>
                            <div className="text-[9px] text-zinc-500 uppercase font-black tracking-widest">v2.1 Master</div>
                         </div>
                      </div>
                      <button className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all">Manage License</button>
                   </div>
                   <div className="bento-card p-6 border-zinc-900 flex flex-col justify-between">
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-4">Neural_AI_Token_Pool</div>
                      <div className="text-2xl font-black tracking-tighter text-zinc-400">82.4M <span className="text-[10px] font-mono text-zinc-700">TORENS</span></div>
                      <div className="mt-4 flex gap-1">
                         {[1,1,1,1,1,1,1,0.5,0.2,0.1].map((v, i) => (
                           <div key={i} className="h-1 flex-1 bg-[#3E63DD] rounded-full" style={{ opacity: v }} />
                         ))}
                      </div>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function SettingsTab({ icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer group",
        active 
          ? "bg-[#0d0f13] text-[#3E63DD] border border-zinc-900 shadow-xl" 
          : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50"
      )}
    >
      <div className="flex items-center gap-3">
         {React.cloneElement(icon, { className: cn("w-4 h-4", active ? "text-[#3E63DD]" : "text-zinc-600 group-hover:text-zinc-400") })}
         {label}
      </div>
      {active && <div className="w-1.5 h-1.5 rounded-full bg-[#3E63DD]" />}
    </button>
  );
}

function SecurityToggle({ label, desc, enabled }: { label: string, desc: string, enabled: boolean }) {
  const [isOn, setIsOn] = useState(enabled);
  return (
    <div className="flex items-center justify-between group/toggle py-2">
       <div>
          <div className="text-[11px] font-black text-white uppercase tracking-tight mb-1">{label}</div>
          <p className="text-[10px] text-zinc-600 font-medium group-hover/toggle:text-zinc-500 transition-colors uppercase tracking-tighter">{desc}</p>
       </div>
       <button 
         onClick={() => setIsOn(!isOn)}
         className={cn(
           "w-12 h-6 rounded-full transition-all relative border border-zinc-800",
           isOn ? "bg-[#3E63DD]/20 border-[#3E63DD]/40" : "bg-zinc-950"
         )}
       >
          <motion.div 
             animate={{ x: isOn ? 24 : 4 }}
             className={cn(
               "absolute top-1 w-4 h-4 rounded-full",
               isOn ? "bg-[#3E63DD]" : "bg-zinc-800"
             )}
          />
       </button>
    </div>
  );
}
