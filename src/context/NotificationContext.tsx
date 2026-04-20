import React, { createContext, useContext, useEffect, useState } from 'react';
import { useWorkspace } from './WorkspaceContext';
import { db, collection, onSnapshot, query, orderBy, limit } from '../lib/firebase';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  timestamp: any;
  platform?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { activeWorkspace } = useWorkspace();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!activeWorkspace) return;

    // Listen to publishing_logs for real-time notifications
    const q = query(
      collection(db, `workspaces/${activeWorkspace.id}/publishing_logs`),
      orderBy('timestamp', 'desc'),
      limit(20)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const logs = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          type: data.status === 'success' ? 'success' : 'error',
          message: data.status === 'success' 
            ? `Successfully published to ${data.platform}`
            : `Failed to publish to ${data.platform}: ${data.errorMessage || 'Unknown error'}`,
          timestamp: data.timestamp,
          platform: data.platform
        } as Notification;
      });
      
      setNotifications(logs);
      // For simplicity, we'll just track if we have new logs since last check
      setUnreadCount(prev => prev + snapshot.docChanges().filter(change => change.type === 'added').length);
    });

    return () => unsub();
  }, [activeWorkspace]);

  const markAsRead = () => {
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
