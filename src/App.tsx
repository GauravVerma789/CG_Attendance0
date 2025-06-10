import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AttendanceProvider } from './contexts/AttendanceContext';
import LoginChoice from './components/auth/LoginChoice';
import AdminLogin from './components/auth/AdminLogin';
import StaffLogin from './components/auth/StaffLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import StaffDashboard from './components/staff/StaffDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ParticlesBackground from './components/Particles';
import './styles/global.css';

function App() {
  // Load fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Inter:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <Router>
      <AuthProvider>
        <AttendanceProvider>
          <div className="min-h-screen font-sans relative">
            <div className="fixed inset-0 -z-10">
              <ParticlesBackground />
            </div>
            <div className="relative z-10">
              <Routes>
                <Route path="/" element={<LoginChoice />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/staff-login" element={<StaffLogin />} />
                <Route path="/admin/*" element={
                  <ProtectedRoute role="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/staff/*" element={
                  <ProtectedRoute role="staff">
                    <StaffDashboard />
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
          </div>
        </AttendanceProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
