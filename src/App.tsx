import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DonatePage } from './pages/DonatePage';
import { DonorDashboard } from './pages/DonorDashboard';
import { DonorHistory } from '@/pages/donor/DonorHistory';
import { DonorProfile } from '@/pages/donor/DonorProfile';
import { DonorSettings } from '@/pages/donor/DonorSettings';
import { PharmacistDashboard } from '@/pages/PharmacistDashboard';
import { PharmacistHistory } from '@/pages/pharmacist/PharmacistHistory';
import { PharmacistProfile } from '@/pages/pharmacist/PharmacistProfile';
import { PharmacistSettings } from '@/pages/pharmacist/PharmacistSettings';
import { RiderDashboard } from '@/pages/RiderDashboard';
import { RiderHistory } from '@/pages/rider/RiderHistory';
import { RiderProfile } from '@/pages/rider/RiderProfile';
import { RiderSettings } from '@/pages/rider/RiderSettings';
import { AdminDashboard } from '@/pages/AdminDashboard';
import { AdminHistory } from '@/pages/admin/AdminHistory';
import { AdminProfile } from '@/pages/admin/AdminProfile';
import { AdminSettings } from '@/pages/admin/AdminSettings';
import { NGODashboard } from '@/pages/NGODashboard';
import { NGOHistory } from '@/pages/ngo/NGOHistory';
import { NGOProfile } from '@/pages/ngo/NGOProfile';
import { NGOSettings } from '@/pages/ngo/NGOSettings';
import { PatientDashboard } from '@/pages/PatientDashboard';
import { PatientHistory } from '@/pages/patient/PatientHistory';
import { PatientProfile } from '@/pages/patient/PatientProfile';
import { PatientSettings } from '@/pages/patient/PatientSettings';
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
          <Route path="/dashboard/donor/history" element={<ProtectedRoute allowedRoles={['donor']}><DonorHistory /></ProtectedRoute>} />
          <Route path="/dashboard/donor/profile" element={<ProtectedRoute allowedRoles={['donor']}><DonorProfile /></ProtectedRoute>} />
          <Route path="/dashboard/donor/settings" element={<ProtectedRoute allowedRoles={['donor']}><DonorSettings /></ProtectedRoute>} />
          
          <Route path="/dashboard/pharmacist" element={
            <ProtectedRoute allowedRoles={['pharmacist']}>
              <PharmacistDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/pharmacist/history" element={<ProtectedRoute allowedRoles={['pharmacist']}><PharmacistHistory /></ProtectedRoute>} />
          <Route path="/dashboard/pharmacist/profile" element={<ProtectedRoute allowedRoles={['pharmacist']}><PharmacistProfile /></ProtectedRoute>} />
          <Route path="/dashboard/pharmacist/settings" element={<ProtectedRoute allowedRoles={['pharmacist']}><PharmacistSettings /></ProtectedRoute>} />

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
          <Route path="/dashboard/ngo" element={<ProtectedRoute allowedRoles={['ngo']}><NGODashboard /></ProtectedRoute>} />
          <Route path="/dashboard/ngo/history" element={<ProtectedRoute allowedRoles={['ngo']}><NGOHistory /></ProtectedRoute>} />
          <Route path="/dashboard/ngo/profile" element={<ProtectedRoute allowedRoles={['ngo']}><NGOProfile /></ProtectedRoute>} />
          <Route path="/dashboard/ngo/settings" element={<ProtectedRoute allowedRoles={['ngo']}><NGOSettings /></ProtectedRoute>} />

          <Route path="/dashboard/patient" element={<ProtectedRoute allowedRoles={['patient']}><PatientDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/patient/history" element={<ProtectedRoute allowedRoles={['patient']}><PatientHistory /></ProtectedRoute>} />
          <Route path="/dashboard/patient/profile" element={<ProtectedRoute allowedRoles={['patient']}><PatientProfile /></ProtectedRoute>} />
          <Route path="/dashboard/patient/settings" element={<ProtectedRoute allowedRoles={['patient']}><PatientSettings /></ProtectedRoute>} />

          {/* Sub-routes */}
          <Route path="/dashboard/rider/history" element={<ProtectedRoute allowedRoles={['rider']}><RiderHistory /></ProtectedRoute>} />
          <Route path="/dashboard/rider/profile" element={<ProtectedRoute allowedRoles={['rider']}><RiderProfile /></ProtectedRoute>} />
          <Route path="/dashboard/rider/settings" element={<ProtectedRoute allowedRoles={['rider']}><RiderSettings /></ProtectedRoute>} />

          <Route path="/dashboard/admin/history" element={<ProtectedRoute allowedRoles={['admin']}><AdminHistory /></ProtectedRoute>} />
          <Route path="/dashboard/admin/profile" element={<ProtectedRoute allowedRoles={['admin']}><AdminProfile /></ProtectedRoute>} />
          <Route path="/dashboard/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><AdminSettings /></ProtectedRoute>} />

          <Route path="/dashboard/:role/history" element={<ProtectedRoute><PlaceholderPage title="History" /></ProtectedRoute>} />
          <Route path="/dashboard/:role/profile" element={<ProtectedRoute><PlaceholderPage title="Profile" /></ProtectedRoute>} />
          <Route path="/dashboard/:role/settings" element={<ProtectedRoute><PlaceholderPage title="Settings" /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
