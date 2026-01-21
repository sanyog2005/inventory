import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation ,useNavigate} from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/contractor/Dashboard';
import CertificateForm from './pages/contractor/CertificateForm';
import StockView from './pages/contractor/StockView';
import BillingView from './pages/contractor/BillingView';
import ReportsView from './pages/contractor/ReportsView';
import Login from './pages/Login';
import { FileQuestion, Home } from 'lucide-react';



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

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
      <div className="bg-slate-50 p-6 rounded-full mb-6">
        <FileQuestion size={64} className="text-slate-400" />
      </div>
      <h1 className="text-4xl font-bold text-slate-800 mb-2">404 - Page Not Found</h1>
      <p className="text-slate-500 mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved. 
        Please check the URL or return to the dashboard.
      </p>
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
      >
        <Home size={20} /> Back to Dashboard
      </button>
    </div>
  );
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
          <Route path="*" element={<NotFound />} />


        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;