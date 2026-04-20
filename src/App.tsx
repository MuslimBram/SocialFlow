/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Accounts } from './pages/Accounts';
import { Composer } from './pages/Composer';
import { CalendarView } from './pages/CalendarView';
import { PostsList } from './pages/PostsList';
import { Login } from './pages/Login';
import { Analytics } from './pages/Analytics';
import { Team } from './pages/Team';
import { Settings } from './pages/Settings';
import { MediaLibrary } from './pages/MediaLibrary';
import { HelpCenter } from './pages/HelpCenter';
import { Explore } from './pages/Explore';
import { InstagramBio } from './pages/InstagramBio';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WorkspaceProvider } from './context/WorkspaceContext';
import { NotificationProvider } from './context/NotificationContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-zinc-950 text-zinc-400">Loading SocialFlow...</div>;
  if (!user) return <Navigate to="/login" />;
  
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WorkspaceProvider>
          <NotificationProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="accounts" element={<Accounts />} />
                <Route path="compose" element={<Composer />} />
                <Route path="calendar" element={<CalendarView />} />
                <Route path="scheduled" element={<PostsList type="scheduled" />} />
                <Route path="drafts" element={<PostsList type="draft" />} />
                <Route path="published" element={<PostsList type="published" />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="media" element={<MediaLibrary />} />
                <Route path="team" element={<Team />} />
                <Route path="settings" element={<Settings />} />
                <Route path="help" element={<HelpCenter />} />
                <Route path="explore" element={<Explore />} />
                <Route path="bio" element={<InstagramBio />} />
              </Route>
            </Routes>
          </NotificationProvider>
        </WorkspaceProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
