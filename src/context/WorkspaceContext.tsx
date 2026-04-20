import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { 
  db, 
  collection, 
  query, 
  where, 
  getDocs, 
  setDoc, 
  doc, 
  onSnapshot,
  serverTimestamp 
} from '../lib/firebase';

export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
  plan: 'free' | 'pro' | 'enterprise';
}

interface WorkspaceContextType {
  activeWorkspace: Workspace | null;
  workspaces: Workspace[];
  loading: boolean;
  switchWorkspace: (id: string) => void;
  createWorkspace: (name: string) => Promise<void>;
  updateWorkspace: (id: string, data: Partial<Workspace>) => Promise<void>;
  deleteWorkspace: (id: string) => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setWorkspaces([]);
      setActiveWorkspace(null);
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'workspaces'), where('ownerId', '==', user.uid));
    
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const ws = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Workspace));
      setWorkspaces(ws);
      
      // Auto-create default workspace if none exists
      if (ws.length === 0) {
        await createDefaultWorkspace(user.uid, user.displayName || 'Default');
      } else if (!activeWorkspace || !ws.find(w => w.id === activeWorkspace.id)) {
        setActiveWorkspace(ws[0]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  async function createDefaultWorkspace(uid: string, name: string) {
    const wsId = `ws_${uid.substring(0, 8)}`;
    const wsRef = doc(db, 'workspaces', wsId);
    const wsData = {
      name: `${name}'s Workspace`,
      ownerId: uid,
      plan: 'free',
      createdAt: serverTimestamp()
    };
    await setDoc(wsRef, wsData);
    
    // Also create membership document
    await setDoc(doc(db, `workspaces/${wsId}/members`, uid), {
      userId: uid,
      role: 'owner',
      joinedAt: serverTimestamp()
    });
  }

  const switchWorkspace = (id: string) => {
    const ws = workspaces.find(w => w.id === id);
    if (ws) setActiveWorkspace(ws);
  };

  const createWorkspace = async (name: string) => {
    if (!user) return;
    const id = `ws_${Math.random().toString(36).substr(2, 9)}`;
    const wsRef = doc(db, 'workspaces', id);
    await setDoc(wsRef, {
      name,
      ownerId: user.uid,
      plan: 'free',
      createdAt: serverTimestamp()
    });
    await setDoc(doc(db, `workspaces/${id}/members`, user.uid), {
      userId: user.uid,
      role: 'owner',
      joinedAt: serverTimestamp()
    });
  };

  const updateWorkspace = async (id: string, data: Partial<Workspace>) => {
    const wsRef = doc(db, 'workspaces', id);
    // filter out id from data
    const { id: _, ...updateData } = data as any;
    await setDoc(wsRef, updateData, { merge: true });
  };

  const deleteWorkspace = async (id: string) => {
    if (workspaces.length <= 1) throw new Error("Cannot delete your only workspace.");
    const wsRef = doc(db, 'workspaces', id);
    await setDoc(wsRef, { deleted: true, deletedAt: serverTimestamp() }, { merge: true });
    // In a real app, you might actually delete or soft-delete and move to another ws
  };

  return (
    <WorkspaceContext.Provider value={{ activeWorkspace, workspaces, loading, switchWorkspace, createWorkspace, updateWorkspace, deleteWorkspace }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}
