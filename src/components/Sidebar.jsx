import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  BarChart3, 
  Database, 
  CreditCard, 
  LogOut, 
  Hexagon, 
  UserCircle,
  Shield,
  Users,
  Settings
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();

  // 1. Get User Info safely from LocalStorage
  const userRole = localStorage.getItem('userRole') || 'guest';
  const userName = localStorage.getItem('userName') || 'Guest User';

  // 2. Define the Menu Structure
  // 'roles' array defines who can see which section
  const MENU_SECTIONS = [
    {
      title: "Main Menu",
      items: [
        { to: "/dashboard", icon: <LayoutDashboard size={20}/>, label: "Dashboard", roles: [ 'operator'] },
        { to: "/certificates", icon: <FileText size={20}/>, label: "Certificates", roles: ['operator'] },
        { to: "/reports", icon: <BarChart3 size={20}/>, label: "Reports", roles: [ 'operator'] }
      ]
    },
    {
      title: "Operations",
      items: [
        { to: "/stock", icon: <Database size={20}/>, label: "Stock Inventory", roles: [ 'operator'] },
        { to: "/billing", icon: <CreditCard size={20}/>, label: "Billing", roles: ['operator'] }
      ]
    },
    {
      title: "Administration",
      items: [
        { to: "/admin/dashboard", icon: <Users size={20}/>, label: "Dashboard", roles: ['admin'] },

        { to: "/admin/users", icon: <Users size={20}/>, label: "User Mgmt", roles: ['admin'] },
        { to: "/admin/branch", icon: <Users size={20}/>, label: "Branch Mgmt", roles: ['admin'] },

        { to: "/admin/masters", icon: <Shield size={20}/>, label: "Master Data", roles: ['admin'] },
        { to: "/admin/settings", icon: <Settings size={20}/>, label: "System Config", roles: ['admin'] }
      ]
    }
  ];

  // 3. Logout Logic
  const handleLogout = () => {
    // Clear all session data
    localStorage.clear();
    // Redirect to Login Page
    navigate('/login');
  };

  return (
    <div className="w-64 bg-slate-900 h-screen fixed left-0 top-0 flex flex-col shadow-2xl z-20 text-slate-300 font-sans border-r border-slate-800">
      
      {/* --- Brand Header --- */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg shadow-blue-500/20">
          <Hexagon size={24} fill="currentColor" className="text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white tracking-wide">FumiManager</h1>
          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
            {userRole === 'admin' ? 'Admin Panel' : 'Operator Portal'}
          </p>
        </div>
      </div>

      {/* --- Dynamic Navigation Menu --- */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto custom-scrollbar">
        {MENU_SECTIONS.map((section, index) => {
          // Filter items: Only show if current userRole is in the allowed 'roles' array
          const visibleItems = section.items.filter(item => item.roles.includes(userRole));
          
          // If a section has no visible items (e.g., Admin section for Operator), don't render it
          if (visibleItems.length === 0) return null;

          return (
            <div key={index} className="animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {section.title}
              </div>
              <div className="space-y-1">
                {visibleItems.map((item) => (
                  <NavItem key={item.to} to={item.to} icon={item.icon} label={item.label} />
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      {/* --- Footer Section (User Profile & Sign Out) --- */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 mb-4 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Sign Out</span>
        </button>

        <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
          <div className={`rounded-full p-0.5 ${userRole === 'admin' ? 'bg-indigo-500' : 'bg-emerald-500'}`}>
            <div className="bg-slate-900 rounded-full p-1">
               <UserCircle size={24} className="text-white" />
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold text-white truncate">{userName}</p>
            <p className="text-xs text-blue-400 capitalize truncate">{userRole}</p>
          </div>
        </div>
      </div>

    </div>
  );
};

// --- Sub-Component: Nav Item ---
const NavItem = ({ to, icon, label }) => (
  <NavLink 
    to={to}
    className={({ isActive }) => 
      `flex items-center space-x-3 w-full p-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
        isActive 
          ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-500/20 translate-x-1' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white hover:translate-x-1'
      }`
    }
  >
    <span className="shrink-0 relative z-10">{icon}</span>
    <span className="font-medium relative z-10">{label}</span>
  </NavLink>
);

export default Sidebar;