import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/contractor/Dashboard';
import CertificateForm from './pages/contractor/CertificateForm';
import StockView from './pages/contractor/StockView';
import BillingView from './pages/contractor/BillingView';
import ReportsView from './pages/contractor/ReportsView';
import Login from './pages/Login';



// Import Admin Pages
import UserManagement from './pages/admin/UserManagement';
import MasterData from './pages/admin/MasterData';
import SystemSettings from './pages/admin/SystemSettings';
import BranchManagement from './pages/admin/BranchManagement';
import AdminDashboard from './pages/admin/AdminDashboard';

// --- Guards ---

const PrivateRoute = ({ children }) => {
  const userRole = localStorage.getItem('userRole');
  return userRole ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const userRole = localStorage.getItem('userRole');
  // Only allow if role is EXACTLY 'admin'
  return userRole === 'admin' ? children : <Navigate to="/dashboard" replace />;
};

// --- Layout ---

const AppLayout = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans text-slate-900">
      {!isLoginPage && <Sidebar />}
      {/* Added p-8 padding here so every page has consistent spacing */}
      <main className={`${!isLoginPage ? 'ml-64' : ''} flex-1 p-8`}>
        {children}
      </main>
    </div>
  );
};

// --- Main App ---

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Operator Routes */}
          <Route path="/" element={<PrivateRoute><Navigate to="/dashboard" replace /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/certificates" element={<PrivateRoute><CertificateForm /></PrivateRoute>} />
          <Route path="/stock" element={<PrivateRoute><StockView /></PrivateRoute>} />
          <Route path="/billing" element={<PrivateRoute><BillingView /></PrivateRoute>} />
          <Route path="/reports" element={<PrivateRoute><ReportsView /></PrivateRoute>} />

          {/* Admin Routes (Directly mapped) */}
          <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
          <Route path="/admin/masters" element={<AdminRoute><MasterData /></AdminRoute>} />
          <Route path="/admin/settings" element={<AdminRoute><SystemSettings /></AdminRoute>} />
          
          <Route path="/admin/branch" element={<AdminRoute><BranchManagement /></AdminRoute>} />
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          


        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;