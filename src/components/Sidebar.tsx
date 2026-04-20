import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  Calendar, 
  Clock, 
  PenBox, 
  Settings, 
  Share2, 
  Users, 
  TrendingUp,
  ChevronRight,
  LogOut,
  PlusCircle,
  Hash,
  FileText,
  CheckCircle2,
  HelpCircle,
  Globe,
  Instagram,
  Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWorkspace } from '../context/WorkspaceContext';
import { useNotifications } from '../context/NotificationContext';
import { cn } from '../lib/utils';
import { db, doc, onSnapshot, collection, query, where, getDocs } from '../lib/firebase';

export function Sidebar() {
  const { logout, user } = useAuth();
  const { activeWorkspace, workspaces, switchWorkspace } = useWorkspace();
  const { unreadCount } = useNotifications();
  const [userRole, setUserRole] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!user || !activeWorkspace) return;

    const q = query(
      collection(db, `workspaces/${activeWorkspace.id}/members`),
      where('userId', '==', user.uid)
    );

    const checkRole = async () => {
      const snap = await getDocs(q);
      if (!snap.empty) {
        setUserRole(snap.docs[0].data().role);
      }
    };

    checkRole();
  }, [user, activeWorkspace]);

  const isAdminOrOwner = userRole === 'admin' || userRole === 'owner';

  const menuGroups = [
    {
      label: 'Core',
      items: [
        { to: '/', icon: BarChart3, label: 'Dashboard', badge: unreadCount > 0 ? unreadCount : undefined },
        { to: '/analytics', icon: TrendingUp, label: 'Analytics' },
      ]
    },
    {
      label: 'Operations',
      items: [
        { to: '/compose', icon: PenBox, label: 'Create Post' },
        { to: '/media', icon: ImageIcon, label: 'Media Library' },
        { to: '/calendar', icon: Calendar, label: 'Calendar' },
        { to: '/explore', icon: Globe, label: 'Explore' },
        { to: '/bio', icon: Instagram, label: 'Bio Link' },
        { to: '/scheduled', icon: Clock, label: 'Scheduled' },
        { to: '/published', icon: CheckCircle2, label: 'Published' },
        { to: '/drafts', icon: FileText, label: 'Drafts' },
      ]
    },
    {
      label: 'System',
      items: [
        { to: '/accounts', icon: Share2, label: 'Connections' },
        { to: '/team', icon: Users, label: 'Team' },
        { to: '/settings', icon: Settings, label: 'Settings' },
      ]
    },
    ...(isAdminOrOwner ? [{
      label: 'Support',
      items: [
        { to: '/help', icon: HelpCircle, label: 'Help Center' },
      ]
    }] : [])
  ];

  return (
    <div className="w-20 lg:w-64 h-screen border-r border-zinc-900 bg-zinc-950 flex flex-col p-4 transition-all duration-300">
      {/* Brand */}
      <div className="flex items-center gap-3 px-2 mb-8">
        <div className="w-10 h-10 bg-[#3E63DD] rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/10 shrink-0">
          <Share2 className="w-6 h-6 text-white" />
        </div>
        <span className="font-bold tracking-tight text-lg hidden lg:block">SocialFlow</span>
      </div>

      {/* Workspace Switcher */}
      <div className="mb-8 px-2 hidden lg:block">
        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block opacity-40">Workspace_Kernel</label>
        <div className="relative group/ws">
          <button className="w-full flex items-center justify-between p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer overflow-hidden">
            <span className="text-xs font-semibold truncate">{activeWorkspace?.name || 'Loading...'}</span>
            <ChevronRight className="w-4 h-4 text-zinc-500 group-hover/ws:rotate-90 transition-transform" />
          </button>
          
          <div className="absolute top-full left-0 w-full mt-2 bg-[#1C2028] p-2 rounded-xl border border-zinc-800 space-y-1 z-50 opacity-0 invisible group-hover/ws:opacity-100 group-hover/ws:visible transition-all shadow-2xl">
            {workspaces.map(ws => (
              <button 
                key={ws.id}
                onClick={() => switchWorkspace(ws.id)}
                className="w-full text-left p-2 rounded-lg hover:bg-zinc-800 text-xs transition-colors truncate"
              >
                {ws.name}
              </button>
            ))}
            <div className="border-t border-zinc-800 my-1 pt-1">
              <button className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-800 text-xs text-zinc-400 transition-colors">
                <PlusCircle className="w-3 h-3" />
                New Workspace
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-6 overflow-y-auto no-scrollbar scroll-smooth">
        {menuGroups.map(group => (
          <div key={group.label} className="space-y-1.5 px-2">
            <h3 className="hidden lg:block text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-2 px-1 opacity-40">{group.label}_MODULES</h3>
            <div className="space-y-1">
              {group.items.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  title={item.label}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 p-2 rounded-xl text-sm font-semibold transition-all group lg:px-3",
                    isActive 
                      ? "bg-[#15181E] text-[#3E63DD] border border-zinc-800/50 shadow-sm" 
                      : "text-zinc-500 hover:text-white hover:bg-zinc-900/50"
                  )}
                >
                  <item.icon className="w-5 h-5 mx-auto lg:mx-0 lg:w-4 lg:h-4" />
                  <span className="hidden lg:block flex-1 text-[11px] font-bold uppercase tracking-wide">{item.label}</span>
                  {item.badge && (
                     <span className="hidden lg:flex px-1.5 py-0.5 items-center justify-center bg-[#3E63DD] text-[8px] text-white font-black rounded border border-white/10">
                        {item.badge}
                     </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User & Settings */}
      <div className="mt-auto space-y-1 pt-4 border-t border-zinc-900 px-2">
        <div className="flex items-center gap-3 px-1 py-2.5 mb-2 hover:bg-zinc-900/40 rounded-xl transition-all group">
           <img 
              src={user?.photoURL || 'https://picsum.photos/seed/user/32/32'} 
              className="w-8 h-8 rounded-full border border-zinc-800 group-hover:border-zinc-600 transition-colors"
              referrerPolicy="no-referrer"
           />
           <div className="flex-1 truncate hidden lg:block">
             <div className="text-[11px] font-black uppercase tracking-tight truncate">{user?.displayName || 'Social User'}</div>
             <div className="text-[9px] text-zinc-600 font-mono truncate">{user?.email}</div>
           </div>
        </div>
        <button 
          onClick={logout}
          className="w-full flex items-center justify-center lg:justify-start gap-3 p-2.5 rounded-xl text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-red-400 hover:bg-red-500/5 transition-all group cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden lg:block">Logout</span>
        </button>
      </div>
    </div>
  );
}
