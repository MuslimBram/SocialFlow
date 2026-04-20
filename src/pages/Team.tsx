import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { 
  db, 
  collection, 
  onSnapshot, 
  query, 
  serverTimestamp, 
  addDoc,
  doc,
  deleteDoc
} from '../lib/firebase';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  ShieldAlert, 
  Mail, 
  MoreVertical, 
  X,
  Plus,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface TeamMember {
  id: string;
  userId: string;
  email?: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  joinedAt: any;
}

export function Team() {
  const { activeWorkspace } = useWorkspace();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [showInvite, setShowInvite] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'editor' | 'viewer'>('editor');

  useEffect(() => {
    if (!activeWorkspace) return;
    const q = query(collection(db, `workspaces/${activeWorkspace.id}/members`));
    const unsub = onSnapshot(q, (snapshot) => {
      setMembers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TeamMember)));
    });
    return () => unsub();
  }, [activeWorkspace]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeWorkspace || !email) return;
    
    try {
      await addDoc(collection(db, `workspaces/${activeWorkspace.id}/members`), {
        email,
        role,
        joinedAt: serverTimestamp(),
        status: 'invited'
      });
      setEmail('');
      setShowInvite(false);
    } catch (err) {
      console.error(err);
    }
  };

  const removeMember = async (id: string) => {
    if (!activeWorkspace) return;
    if (confirm("Revoke workspace access for this member?")) {
      await deleteDoc(doc(db, `workspaces/${activeWorkspace.id}/members`, id));
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight mb-2">Collaboration Core</h1>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] opacity-60 leading-none">Permission matrix & node authorization</p>
        </div>
        <button 
          onClick={() => setShowInvite(true)}
          className="flex items-center gap-3 bg-[#3E63DD] text-white px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/10 active:scale-95 group"
        >
          <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
          Provision Access Node
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Members List */}
        <div className="lg:col-span-8 space-y-4">
           <div className="bento-card p-0 overflow-hidden divide-y divide-zinc-900/50 border-zinc-900 bg-[#0d0f13]">
              <AnimatePresence initial={false}>
                {members.map((member, i) => (
                  <motion.div 
                    key={member.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-6 flex items-center justify-between hover:bg-zinc-900/40 transition-all group"
                  >
                     <div className="flex items-center gap-5">
                        <div className="relative">
                           <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-[#3E63DD]/40 transition-colors">
                              <Users className="w-6 h-6 text-zinc-700 group-hover:text-[#3E63DD]/60 transition-colors" />
                           </div>
                           <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-[#0d0f13] shadow-lg shadow-green-500/20" />
                        </div>
                        <div>
                           <div className="text-[13px] font-black text-white tracking-tight mb-1">{member.email || 'Workspace Founder'}</div>
                           <div className="flex items-center gap-3">
                              <div className={cn(
                                "flex items-center gap-1.5 px-2 py-0.5 rounded border text-[8px] font-black uppercase tracking-widest",
                                member.role === 'owner' ? "bg-[#3E63DD]/10 text-[#3E63DD] border-[#3E63DD]/20" : "bg-zinc-900 text-zinc-500 border-zinc-800"
                              )}>
                                 {member.role === 'owner' ? <ShieldCheck className="w-2.5 h-2.5" /> : <ShieldAlert className="w-2.5 h-2.5" />}
                                 {member.role}
                              </div>
                              <span className="text-[9px] font-mono text-zinc-700">NODE_AUTH_OK</span>
                           </div>
                        </div>
                     </div>

                     <div className="flex items-center gap-6">
                        <div className="text-[9px] font-mono text-zinc-800 hidden md:block tracking-tighter">HEX::{member.id.substring(0, 8).toUpperCase()}</div>
                        <div className="flex items-center gap-2">
                           {member.role !== 'owner' && (
                              <button 
                                onClick={() => removeMember(member.id)}
                                className="p-2 text-zinc-700 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer opacity-0 group-hover:opacity-100 border border-transparent hover:border-red-500/20"
                              >
                                 <X className="w-4 h-4" />
                              </button>
                           )}
                           <button className="p-2 text-zinc-700 hover:text-white rounded-xl transition-all cursor-pointer border border-transparent hover:border-zinc-800 shadow-xl">
                              <MoreVertical className="w-4 h-4" />
                           </button>
                        </div>
                     </div>
                  </motion.div>
                ))}
              </AnimatePresence>
           </div>
           
           <div className="p-4 bg-zinc-950/40 rounded-2xl border border-zinc-900 border-dashed flex items-center justify-center text-[10px] font-black text-zinc-800 uppercase tracking-[0.2em]">
              Network Encryption level: AES-256-GCM Active
           </div>
        </div>

        {/* Stats / Help */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bento-card p-6 border-zinc-900 bg-[#0d0f13]">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-8 flex items-center gap-2">
                 <Activity className="w-3.5 h-3.5" /> Deployment Quota
              </h2>
              <div className="space-y-6">
                 <div className="flex items-end justify-between">
                    <div>
                       <span className="text-3xl font-black text-white tracking-tighter">{members.length}</span>
                       <span className="text-lg font-black text-zinc-800 tracking-tighter ml-1">/ 5</span>
                    </div>
                    <span className="text-[10px] font-black text-[#3E63DD] uppercase tracking-widest bg-[#3E63DD]/5 px-2 py-0.5 rounded">Standard_Node</span>
                 </div>
                 <div className="h-2 w-full bg-zinc-950 rounded-lg overflow-hidden border border-zinc-900">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(members.length / 5) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-[#3E63DD] shadow-[0_0_10px_rgba(62,99,221,0.3)]" 
                    />
                 </div>
                 <p className="text-[10px] text-zinc-500 font-medium leading-relaxed italic opacity-80">
                    Your current environment configuration supports up to 5 collaboration nodes. Contact terminal admin for expansion protocols.
                 </p>
              </div>
           </div>

           <div className="bento-card p-6 bg-[#3E63DD]/5 border-[#3E63DD]/10 group hover:border-[#3E63DD]/40 transition-colors">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3E63DD] mb-6 flex items-center gap-2">
                 <ShieldCheck className="w-3.5 h-3.5" /> Authorization Logic
              </h2>
              <ul className="space-y-3">
                 <RoleInfo role="Admin" desc="Full CRUD across all mission segments." />
                 <RoleInfo role="Editor" desc="Manage active publishing signals." />
                 <RoleInfo role="Viewer" desc="Read-only access to resonance data." />
              </ul>
           </div>
        </div>
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInvite && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="w-full max-w-md bg-[#0d0f13] border border-zinc-800 rounded-3xl p-10 shadow-2xl relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 p-4">
                  <button onClick={() => setShowInvite(false)} className="w-10 h-10 rounded-xl hover:bg-zinc-900 flex items-center justify-center text-zinc-600 hover:text-white transition-all"><X className="w-5 h-5" /></button>
               </div>

               <div className="mb-10 text-center">
                  <div className="w-16 h-16 rounded-3xl bg-[#3E63DD]/10 border border-[#3E63DD]/20 flex items-center justify-center mx-auto mb-6">
                     <UserPlus className="w-7 h-7 text-[#3E63DD]" />
                  </div>
                  <h2 className="text-xl font-black uppercase tracking-tight text-white mb-2">Provision Access Node</h2>
                  <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">Deployment Protocol v2.1</p>
               </div>

               <form onSubmit={handleInvite} className="space-y-8">
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Target Network Email</label>
                     <div className="relative group">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700 group-focus-within:text-[#3E63DD] transition-colors" />
                        <input 
                           type="email" 
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           className="w-full bg-zinc-950 border border-zinc-900 rounded-2xl pl-14 pr-5 py-4 text-sm text-white font-bold tracking-tight focus:outline-none focus:border-[#3E63DD]/50 transition-all placeholder:text-zinc-800"
                           placeholder="colleague@enterprise.io"
                           required
                        />
                     </div>
                  </div>

                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Access Tier Designation</label>
                     <div className="grid grid-cols-3 gap-3">
                        {(['admin', 'editor', 'viewer'] as const).map(r => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setRole(r)}
                            className={cn(
                              "relative py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all border overflow-hidden",
                              role === r ? "bg-[#3E63DD] text-white border-[#3E63DD] shadow-lg shadow-blue-500/20" : "bg-zinc-950 text-zinc-600 border-zinc-900 hover:border-zinc-700"
                            )}
                          >
                            {r}
                            {role === r && <div className="absolute inset-0 bg-white/20 animate-pulse" />}
                          </button>
                        ))}
                     </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-5 bg-[#3E63DD] text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/10 active:scale-[0.98]"
                  >
                    Authorize Signal
                  </button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RoleInfo({ role, desc }: { role: string, desc: string }) {
   return (
      <li className="flex gap-3">
         <div className="w-1 h-auto bg-[#3E63DD]/20 rounded-full" />
         <div>
            <div className="text-[10px] font-black text-[#3E63DD] uppercase tracking-widest mb-0.5">{role}</div>
            <p className="text-[10px] text-zinc-500 font-medium leading-relaxed uppercase tracking-tighter group-hover:text-zinc-400 transition-colors">{desc}</p>
         </div>
      </li>
   );
}

