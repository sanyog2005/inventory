import React, { useState, useMemo } from 'react';
import { 
  Building2, MapPin, Phone, User, Plus, Search, Trash2, Edit2, 
  X, CheckCircle2, Globe, LayoutGrid, List, AlertCircle, Briefcase, 
  MoreHorizontal, ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- MOCK DATA ---
const INITIAL_BRANCHES = [
  { id: 1, name: 'Gujarat Head Office', code: 'GUJ-01', manager: 'Rajesh Verma', phone: '+91 98765 43210', location: 'Mundra, Gujarat', status: 'Active', gst: '24AAACC1234J1Z2' },
  { id: 2, name: 'Punjab Regional Office', code: 'PUN-02', manager: 'Amit Singh', phone: '+91 98765 12345', location: 'Ludhiana, Punjab', status: 'Active', gst: '03BBBDD1234K1Z5' },
  { id: 3, name: 'Mumbai Port Unit', code: 'MUM-03', manager: 'Sarah Jones', phone: '+91 98123 45678', location: 'Navi Mumbai', status: 'Maintenance', gst: '27CCCCD5678L1Z9' },
  { id: 4, name: 'Karnal Depot', code: 'KAR-04', manager: 'Vikram Malhotra', phone: '+91 99887 77665', location: 'Karnal, Haryana', status: 'Active', gst: '06DDDEE5566M2Z8' },
];

const BranchManagement = () => {
  const [branches, setBranches] = useState(INITIAL_BRANCHES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '', code: '', manager: '', phone: '', location: '', gst: ''
  });

  // --- Stats Calculation ---
  const stats = useMemo(() => ({
    total: branches.length,
    active: branches.filter(b => b.status === 'Active').length,
    maintenance: branches.filter(b => b.status === 'Maintenance').length
  }), [branches]);

  // --- Logic ---
  const filteredBranches = branches.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (branch = null) => {
    if (branch) {
      setEditingId(branch.id);
      setFormData(branch);
    } else {
      setEditingId(null);
      setFormData({ name: '', code: '', manager: '', phone: '', location: '', gst: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setBranches(branches.map(b => b.id === editingId ? { ...b, ...formData } : b));
    } else {
      setBranches([...branches, { id: Date.now(), ...formData, status: 'Active' }]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if(window.confirm("Remove this branch?")) setBranches(branches.filter(b => b.id !== id));
  };

  const toggleStatus = (id) => {
    setBranches(branches.map(b => b.id === id ? { ...b, status: b.status === 'Active' ? 'Maintenance' : 'Active' } : b));
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* --- 1. Header & Stats --- */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Branch Operations</h1>
            <p className="text-slate-500 mt-2 text-sm">Manage your regional offices and compliance details.</p>
          </div>
          <div className="flex gap-4">
             <StatBadge label="Total" value={stats.total} icon={Globe} color="bg-blue-100 text-blue-700" />
             <StatBadge label="Active" value={stats.active} icon={CheckCircle2} color="bg-emerald-100 text-emerald-700" />
             <StatBadge label="Issues" value={stats.maintenance} icon={AlertCircle} color="bg-amber-100 text-amber-700" />
          </div>
        </div>

        {/* --- 2. Floating Action Bar --- */}
        <div className="sticky top-4 z-30 bg-white/80 backdrop-blur-md p-2 rounded-2xl border border-slate-200/60 shadow-lg shadow-slate-200/50 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-96 group">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
             <input 
               type="text" 
               placeholder="Search by name, city or code..." 
               className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-transparent rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
             <div className="flex bg-slate-100 p-1 rounded-xl">
                <ViewBtn icon={LayoutGrid} active={viewMode === 'grid'} onClick={() => setViewMode('grid')} />
                <ViewBtn icon={List} active={viewMode === 'list'} onClick={() => setViewMode('list')} />
             </div>
             <div className="w-px h-8 bg-slate-200 mx-1 hidden md:block"></div>
             <button 
               onClick={() => openModal()}
               className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 transition-all active:scale-95 font-semibold text-sm"
             >
               <Plus size={18} /> <span className="hidden sm:inline">Add Branch</span>
             </button>
          </div>
        </div>

        {/* --- 3. Content Area --- */}
        <AnimatePresence mode='wait'>
          {viewMode === 'grid' ? (
            <motion.div 
              key="grid"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredBranches.map((branch) => (
                <BranchCard 
                  key={branch.id} 
                  data={branch} 
                  onEdit={() => openModal(branch)} 
                  onDelete={() => handleDelete(branch.id)}
                  onToggleStatus={() => toggleStatus(branch.id)}
                />
              ))}
              {/* Add New Placeholder Card */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => openModal()}
                className="group border-2 border-dashed border-slate-300 rounded-3xl flex flex-col items-center justify-center min-h-[280px] hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer"
              >
                 <div className="p-4 bg-slate-100 rounded-full group-hover:bg-indigo-100 text-slate-400 group-hover:text-indigo-600 transition-colors mb-3">
                   <Plus size={32} />
                 </div>
                 <span className="font-semibold text-slate-500 group-hover:text-indigo-700">Register New Office</span>
              </motion.button>
            </motion.div>
          ) : (
            <motion.div 
              key="list"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
            >
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase font-bold text-xs">
                   <tr>
                      <th className="p-5">Details</th>
                      <th className="p-5">Contact Info</th>
                      <th className="p-5">Location</th>
                      <th className="p-5">Status</th>
                      <th className="p-5 text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {filteredBranches.map(branch => (
                      <tr key={branch.id} className="group hover:bg-slate-50/80 transition-colors">
                         <td className="p-5">
                            <div className="font-bold text-slate-800 text-base">{branch.name}</div>
                            <div className="inline-flex items-center gap-1.5 mt-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-xs font-mono border border-slate-200">
                              {branch.code}
                            </div>
                         </td>
                         <td className="p-5">
                            <div className="flex items-center gap-2 text-slate-700 font-medium"><User size={14} className="text-indigo-500"/> {branch.manager}</div>
                            <div className="flex items-center gap-2 text-slate-500 text-xs mt-1"><Phone size={14}/> {branch.phone}</div>
                         </td>
                         <td className="p-5 text-slate-600">{branch.location}</td>
                         <td className="p-5">
                            <button onClick={() => toggleStatus(branch.id)} className="focus:outline-none">
                               <StatusPill status={branch.status} />
                            </button>
                         </td>
                         <td className="p-5 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                               <ActionButton icon={Edit2} onClick={() => openModal(branch)} />
                               <ActionButton icon={Trash2} onClick={() => handleDelete(branch.id)} danger />
                            </div>
                         </td>
                      </tr>
                   ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- 4. Modal --- */}
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
                className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100"
              >
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <div>
                    <h3 className="font-bold text-xl text-slate-800">{editingId ? 'Edit Branch' : 'New Branch'}</h3>
                    <p className="text-xs text-slate-500 mt-1">Fill in the operational details below.</p>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 bg-white rounded-full hover:bg-slate-100 border border-slate-200 text-slate-400 hover:text-slate-600 transition-colors">
                    <X size={20} />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 space-y-5">
                  <div className="grid grid-cols-2 gap-5">
                    <InputGroup label="Branch Name" placeholder="e.g. Pune Hub" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    <InputGroup label="Branch Code" placeholder="e.g. PUN-01" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} />
                  </div>
                  <InputGroup label="Location / Address" placeholder="City, State" icon={MapPin} value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                  
                  <div className="grid grid-cols-2 gap-5">
                     <InputGroup label="Manager" placeholder="Full Name" icon={User} value={formData.manager} onChange={e => setFormData({...formData, manager: e.target.value})} />
                     <InputGroup label="Contact" placeholder="+91..." icon={Phone} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                  <InputGroup label="GSTIN" placeholder="22AAAAA0000A1Z5" icon={Briefcase} value={formData.gst} onChange={e => setFormData({...formData, gst: e.target.value})} />

                  <div className="pt-4 flex gap-3">
                     <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3.5 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors">Cancel</button>
                     <button type="submit" className="flex-1 py-3.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all active:scale-95">
                       {editingId ? 'Save Changes' : 'Create Branch'}
                     </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- SUB COMPONENTS ---

const StatBadge = ({ label, value, icon: Icon, color }) => (
  <div className={`hidden md:flex items-center gap-3 px-4 py-2 rounded-2xl ${color} bg-opacity-10 border border-current border-opacity-10`}>
     <Icon size={18} className="opacity-80"/>
     <div className="flex flex-col leading-none">
       <span className="text-[10px] font-bold uppercase opacity-60 mb-0.5">{label}</span>
       <span className="font-bold text-lg">{value}</span>
     </div>
  </div>
);

const ViewBtn = ({ icon: Icon, active, onClick }) => (
  <button onClick={onClick} className={`p-2 rounded-lg transition-all ${active ? 'bg-white shadow text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
    <Icon size={18}/>
  </button>
);

const BranchCard = ({ data, onEdit, onDelete, onToggleStatus }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
    className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 group overflow-hidden"
  >
    <div className="p-6">
       <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
             <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-sm">
                <Building2 size={22} />
             </div>
             <div>
                <h3 className="font-bold text-lg text-slate-800 leading-tight">{data.name}</h3>
                <span className="text-xs font-mono font-medium text-slate-400">{data.code}</span>
             </div>
          </div>
          <button onClick={onToggleStatus} className="focus:outline-none transition-transform active:scale-95">
             <StatusPill status={data.status} />
          </button>
       </div>

       <div className="space-y-3 mb-6">
          <DetailRow icon={MapPin} text={data.location} />
          <DetailRow icon={User} text={data.manager} />
          <DetailRow icon={Phone} text={data.phone} />
       </div>

       <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-100">
             <Briefcase size={12} className="text-slate-400"/>
             <span className="text-xs font-mono font-medium text-slate-500">{data.gst}</span>
          </div>
          <div className="flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
             <ActionButton icon={Edit2} onClick={onEdit} />
             <ActionButton icon={Trash2} onClick={onDelete} danger />
          </div>
       </div>
    </div>
  </motion.div>
);

const DetailRow = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-3 text-sm text-slate-600">
     <div className="w-6 flex justify-center"><Icon size={16} className="text-slate-400" /></div>
     <span className="truncate font-medium">{text}</span>
  </div>
);

const StatusPill = ({ status }) => (
  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold transition-all shadow-sm ${
    status === 'Active' 
      ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100' 
      : 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100'
  }`}>
    <span className={`relative flex h-2 w-2`}>
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${status === 'Active' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
      <span className={`relative inline-flex rounded-full h-2 w-2 ${status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
    </span>
    {status}
  </div>
);

const ActionButton = ({ icon: Icon, onClick, danger }) => (
  <button onClick={onClick} className={`p-2 rounded-lg transition-colors ${danger ? 'text-slate-400 hover:text-red-600 hover:bg-red-50' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}>
    <Icon size={16}/>
  </button>
);

const InputGroup = ({ label, placeholder, value, onChange, icon: Icon }) => (
  <div>
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
    <div className="relative group">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18}/>}
      <input 
        type="text" required 
        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none`} 
        placeholder={placeholder} 
        value={value} onChange={onChange} 
      />
    </div>
  </div>
);

export default BranchManagement;