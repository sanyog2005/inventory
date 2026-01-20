import React, { useState, useMemo } from 'react';
import { 
  Search, Edit2, Trash2, Plus, Shield, MapPin, 
  User, X, CheckCircle2, AlertCircle, Filter, MoreHorizontal, Mail 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Mock Data ---
const INITIAL_USERS = [
  { id: 1, name: 'Rajeev Kumar', email: 'operator@dpcs.com', role: 'Operator', branch: 'Gujarat', status: 'Active', phone: '9876543210' },
  { id: 2, name: 'Amit Singh', email: 'amit@dpcs.com', role: 'Operator', branch: 'Punjab', status: 'Active', phone: '9123456780' },
  { id: 3, name: 'Sarah Jenkins', email: 'admin@dpcs.com', role: 'Admin', branch: 'Head Office', status: 'Active', phone: '9988776655' },
  { id: 4, name: 'Vikram Malhotra', email: 'vikram@dpcs.com', role: 'Operator', branch: 'Mumbai', status: 'Inactive', phone: '8877665544' },
];

const UserManagement = () => {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', role: 'Operator', branch: '', status: 'Active', phone: '' });

  // --- Derived Data (Stats & Filters) ---
  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter(u => u.status === 'Active').length,
    admins: users.filter(u => u.role === 'Admin').length
  }), [users]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // --- Handlers ---
  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData(user);
    } else {
      setEditingUser(null);
      setFormData({ name: '', email: '', role: 'Operator', branch: '', status: 'Active', phone: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...formData, id: u.id } : u));
    } else {
      setUsers([...users, { ...formData, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if(window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const toggleStatus = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 min-h-screen bg-slate-50/50">
      
      {/* --- 1. Header & Stats --- */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">User Management</h1>
          <p className="text-slate-500 mt-2 text-sm">Manage system access, assign roles, and monitor user status.</p>
        </div>
        <div className="flex gap-4">
           <StatBadge label="Total Users" value={stats.total} color="bg-indigo-50 text-indigo-700" />
           <StatBadge label="Active Now" value={stats.active} color="bg-emerald-50 text-emerald-700" />
           <StatBadge label="Admins" value={stats.admins} color="bg-purple-50 text-purple-700" />
        </div>
      </div>

      {/* --- 2. Toolbar (Search & Filter) --- */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-2 justify-between items-center">
        
        {/* Search */}
        <div className="relative w-full md:w-96 group">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
           <input 
             type="text" 
             placeholder="Search by name or email..." 
             className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-transparent rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>

        {/* Filters & Add Button */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
           <div className="flex bg-slate-100 p-1 rounded-xl shrink-0">
             {['All', 'Admin', 'Operator'].map(r => (
               <button 
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${roleFilter === r ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 {r}
               </button>
             ))}
           </div>
           
           <div className="w-px h-8 bg-slate-200 mx-1 hidden md:block"></div>

           <button 
             onClick={() => handleOpenModal()}
             className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-indigo-500/30 transition-all active:scale-95 whitespace-nowrap"
           >
             <Plus size={18} /> Add User
           </button>
        </div>
      </div>

      {/* --- 3. User Table --- */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase font-bold text-xs">
            <tr>
              <th className="p-5">User Profile</th>
              <th className="p-5">Role & Access</th>
              <th className="p-5">Location</th>
              <th className="p-5">Status</th>
              <th className="p-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <AnimatePresence>
              {filteredUsers.map((user) => (
                <motion.tr 
                  key={user.id} 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="group hover:bg-slate-50/80 transition-colors"
                >
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <Avatar name={user.name} />
                      <div>
                        <div className="font-bold text-slate-800 text-base">{user.name}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Mail size={12}/> {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${
                      user.role === 'Admin' 
                        ? 'bg-purple-50 text-purple-700 border-purple-200' 
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      {user.role === 'Admin' ? <Shield size={12} /> : <User size={12} />}
                      {user.role}
                    </span>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2 text-slate-600 font-medium">
                      <MapPin size={16} className="text-slate-400" /> {user.branch}
                    </div>
                  </td>
                  <td className="p-5">
                    <button onClick={() => toggleStatus(user.id)} className="focus:outline-none">
                      <StatusBadge status={user.status} />
                    </button>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button onClick={() => handleOpenModal(user)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Edit2 size={16}/></button>
                       <button onClick={() => handleDelete(user.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="p-12 text-center text-slate-400">
             <Filter size={48} className="mx-auto mb-4 opacity-20"/>
             <p>No users found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* --- 4. Add/Edit Modal --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-lg text-slate-800">{editingUser ? 'Edit User' : 'Add New User'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <InputGroup label="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. John Doe" />
                  <InputGroup label="Phone Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+91..." />
                </div>
                
                <InputGroup label="Email Address" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="john@company.com" />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Role</label>
                    <select 
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      value={formData.role} 
                      onChange={e => setFormData({...formData, role: e.target.value})}
                    >
                      <option value="Operator">Operator</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Status</label>
                    <select 
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      value={formData.status} 
                      onChange={e => setFormData({...formData, status: e.target.value})}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <InputGroup label="Branch" value={formData.branch} onChange={e => setFormData({...formData, branch: e.target.value})} placeholder="e.g. Gujarat Branch" />

                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50">Cancel</button>
                  <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/20">
                    {editingUser ? 'Save Changes' : 'Create User'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

// --- SUB COMPONENTS ---

const StatBadge = ({ label, value, color }) => (
  <div className={`hidden md:flex flex-col items-center justify-center px-4 py-2 rounded-xl border border-current border-opacity-10 ${color}`}>
     <span className="text-2xl font-bold leading-none">{value}</span>
     <span className="text-[10px] font-bold uppercase opacity-60 mt-1">{label}</span>
  </div>
);

const Avatar = ({ name }) => {
  const initials = name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
  const colors = ['bg-red-100 text-red-600', 'bg-blue-100 text-blue-600', 'bg-green-100 text-green-600', 'bg-yellow-100 text-yellow-600', 'bg-purple-100 text-purple-600'];
  const colorClass = colors[name.length % colors.length];

  return (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${colorClass}`}>
      {initials}
    </div>
  );
};

const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all hover:brightness-95 ${
    status === 'Active' 
      ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
      : 'bg-slate-100 text-slate-500 border-slate-200'
  }`}>
    <div className={`w-1.5 h-1.5 rounded-full ${status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
    {status}
  </span>
);

const InputGroup = ({ label, type = "text", value, onChange, placeholder }) => (
  <div>
    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{label}</label>
    <input 
      type={type} 
      required 
      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none placeholder:text-slate-400" 
      placeholder={placeholder} 
      value={value} 
      onChange={onChange} 
    />
  </div>
);

export default UserManagement;