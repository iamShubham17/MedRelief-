import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DonatePage } from './pages/DonatePage';
import { DonorDashboard } from './pages/DonorDashboard';
import { PharmacistDashboard } from './pages/PharmacistDashboard';
import { RiderDashboard } from './pages/RiderDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { SplashScreen } from './components/SplashScreen';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <SplashScreen />;

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="/donate" element={
            <ProtectedRoute allowedRoles={['donor']}>
              <DonatePage />
            </ProtectedRoute>
          } />

          <Route path="/dashboard/donor" element={
            <ProtectedRoute allowedRoles={['donor']}>
              <DonorDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard/pharmacist" element={
            <ProtectedRoute allowedRoles={['pharmacist']}>
              <PharmacistDashboard />
            </ProtectedRoute>
          } />

          <Route path="/dashboard/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="/dashboard/rider" element={
            <ProtectedRoute allowedRoles={['rider']}>
              <RiderDashboard />
            </ProtectedRoute>
          } />

          {/* Fallback for other roles */}
          <Route path="/dashboard/ngo" element={
            <ProtectedRoute allowedRoles={['ngo']}>
              <PlaceholderPage role="ngo" title="NGO Dashboard" />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/patient" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PlaceholderPage role="patient" title="Patient Dashboard" />
            </ProtectedRoute>
          } />

          {/* Sub-routes */}
          <Route path="/dashboard/:role/history" element={<ProtectedRoute><PlaceholderPage role="donor" title="History" /></ProtectedRoute>} />
          <Route path="/dashboard/:role/profile" element={<ProtectedRoute><PlaceholderPage role="donor" title="Profile" /></ProtectedRoute>} />
          <Route path="/dashboard/:role/settings" element={<ProtectedRoute><PlaceholderPage role="donor" title="Settings" /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
