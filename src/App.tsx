import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { EZShiftProvider, useEZShift } from './context/EZShiftContext';

// Import Pages
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import OnboardingPage from './pages/OnboardingPage';
import WorkerDashboard from './pages/WorkerDashboard';
import MapViewPage from './pages/MapViewPage';
import MessagesPage from './pages/MessagesPage';
import NotificationsPage from './pages/NotificationsPage';
import AdminDashboard from './pages/AdminDashboard';
import PostShiftPage from './pages/PostShiftPage';
import BillingReportPage from './pages/BillingReportPage';

// Protected Route wrapper to prevent auth bypass
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRole?: 'Worker' | 'Admin' }> = ({ children, allowedRole }) => {
  const { currentUser } = useEZShift();

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  if (allowedRole && currentUser.role !== allowedRole) {
    return <Navigate to={currentUser.role === 'Admin' ? '/admin' : '/dashboard'} replace />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <EZShiftProvider>
      <HashRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* HHA Worker Guarded Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRole="Worker">
                <WorkerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/onboarding" 
            element={
              <ProtectedRoute allowedRole="Worker">
                <OnboardingPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/map" 
            element={
              <ProtectedRoute allowedRole="Worker">
                <MapViewPage />
              </ProtectedRoute>
            } 
          />

          {/* Admin Guarded Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRole="Admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/post-shift" 
            element={
              <ProtectedRoute allowedRole="Admin">
                <PostShiftPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/billing" 
            element={
              <ProtectedRoute allowedRole="Admin">
                <BillingReportPage />
              </ProtectedRoute>
            } 
          />

          {/* Shared Guarded Routes */}
          <Route 
            path="/messages" 
            element={
              <ProtectedRoute>
                <MessagesPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/notifications" 
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            } 
          />

          {/* Fallback Catch-All Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </EZShiftProvider>
  );
}
