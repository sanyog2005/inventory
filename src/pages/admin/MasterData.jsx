import React, { useState, useMemo } from 'react';
import { 
  Database, Plus, Search, Trash2, Edit2, X, MapPin, 
  FlaskConical, Building2, CheckCircle2, LayoutGrid, List,
  MoreHorizontal, Download, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Initial Mock Data ---
const INITIAL_DATA = [
  { id: 1, category: 'exporters', name: 'KRBL Limited', detail: 'Delhi', status: 'Active' },
  { id: 2, category: 'exporters', name: 'Ralington Exports', detail: 'Karnal', status: 'Active' },
  { id: 3, category: 'exporters', name: 'Designers Desire', detail: 'Mumbai', status: 'Inactive' },
  { id: 4, category: 'treatments', name: 'Methyl Bromide (MB)', detail: 'Gas', status: 'Active' },
  { id: 5, category: 'treatments', name: 'Aluminum Phosphide (ALP)', detail: 'Tablet', status: 'Active' },
  { id: 6, category: 'branches', name: 'Gujarat Branch', detail: 'Mundra', status: 'Active' },
  { id: 7, category: 'branches', name: 'Punjab Branch', detail: 'Ludhiana', status: 'Active' },
];

const MasterData = () => {
  const [activeTab, setActiveTab] = useState('exporters');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState(INITIAL_DATA);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', detail: '' });

  // --- Stats ---
  const stats = useMemo(() => {
    const currentCatData = data.filter(d => d.category === activeTab);
    return {
      total: currentCatData.length,
      active: currentCatData.filter(d => d.status === 'Active').length,
      inactive: currentCatData.filter(d => d.status === 'Inactive').length
    };
  }, [data, activeTab]);

  // --- Logic: Filter ---
  const filteredData = data.filter(item => 
    item.category === activeTab && 
    (item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     item.detail.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // --- Logic: CRUD ---
  const openModal = (item = null) => {
    if (item) {
      setEditingId(item.id);
      setFormData({ name: item.name, detail: item.detail });
    } else {
      setEditingId(null);
      setFormData({ name: '', detail: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingId) {
      // Edit
      setData(data.map(item => item.id === editingId ? { ...item, ...formData } : item));
    } else {
      // Create
      const newRecord = {
        id: Date.now(),
        category: activeTab,
        name: formData.name,
        detail: formData.detail || '-',
        status: 'Active'
      };
      setData([newRecord, ...data]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if(window.confirm('Delete this record permanently?')) {
      setData(data.filter(item => item.id !== id));
    }
  };

  const toggleStatus = (id) => {
    setData(data.map(item => item.id === id ? { ...item, status: item.status === 'Active' ? 'Inactive' : 'Active' } : item));
  };

  // --- Config ---
  const TABS = [
    { id: 'exporters', label: 'Exporters', icon: <Building2 size={16}/>, color: 'blue' },
    { id: 'treatments', label: 'Treatments', icon: <FlaskConical size={16}/>, color: 'purple' },
    { id: 'branches', label: 'Branches', icon: <MapPin size={16}/>, color: 'emerald' },
  ];

  const activeTabConfig = TABS.find(t => t.id === activeTab);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto min-h-screen bg-slate-50/50 space-y-6">
      
      {/* --- 1. Header & Stats --- */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            Master Data Manager
          </h2>
          <p className="text-slate-500 mt-2 text-sm">Configure global dropdown lists and system constants.</p>
        </div>
        <div className="flex gap-4">
           <StatBadge label="Total Records" value={stats.total} />
           <StatBadge label="Active" value={stats.active} color="text-emerald-600 bg-emerald-50 border-emerald-100" />
           <StatBadge label="Inactive" value={stats.inactive} color="text-slate-500 bg-slate-100 border-slate-200" />
        </div>
      </div>

      {/* --- 2. Main Controller Card --- */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[600px]">
        
        {/* Toolbar */}
        <div className="p-2 border-b border-slate-200 bg-white flex flex-col md:flex-row justify-between items-center gap-3 sticky top-0 z-10">
          
          {/* Tabs */}
          <div className="flex p-1 bg-slate-100/80 rounded-xl overflow-x-auto w-full md:w-auto">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-white text-slate-800 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 w-full md:w-auto">
             <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder={`Search ${activeTab}...`} 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" 
                />
             </div>
             
             <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow text-indigo-600' : 'text-slate-400'}`}><LayoutGrid size={18}/></button>
                <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow text-indigo-600' : 'text-slate-400'}`}><List size={18}/></button>
             </div>

             <button 
               onClick={() => openModal()}
               className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold shadow-lg shadow-indigo-500/20 transition-all active:scale-95 whitespace-nowrap"
             >
               <Plus size={18} /> Add New
             </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-slate-50/30 p-4 overflow-y-auto">
          <AnimatePresence mode='wait'>
            {filteredData.length > 0 ? (
              viewMode === 'grid' ? (
                <motion.div 
                  key="grid"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {filteredData.map((item) => (
                    <GridCard 
                      key={item.id} 
                      item={item} 
                      config={activeTabConfig} 
                      onEdit={() => openModal(item)}
                      onDelete={() => handleDelete(item.id)}
                      onToggle={() => toggleStatus(item.id)}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                   key="list"
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                   className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm"
                >
                   <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase font-bold text-xs">
                         <tr>
                            <th className="p-4 pl-6">Name</th>
                            <th className="p-4">Detail</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right pr-6">Actions</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                         {filteredData.map(item => (
                            <tr key={item.id} className="group hover:bg-slate-50 transition-colors">
                               <td className="p-4 pl-6 font-bold text-slate-700">{item.name}</td>
                               <td className="p-4 text-slate-500">{item.detail}</td>
                               <td className="p-4">
                                  <button onClick={() => toggleStatus(item.id)}>
                                     <StatusBadge status={item.status} />
                                  </button>
                               </td>
                               <td className="p-4 pr-6 text-right">
                                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                     <button onClick={() => openModal(item)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"><Edit2 size={16}/></button>
                                     <button onClick={() => handleDelete(item.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 size={16}/></button>
                                  </div>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </motion.div>
              )
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60 min-h-[400px]">
                <Database size={64} className="mb-4 text-slate-300" strokeWidth={1} />
                <p className="text-lg font-medium">No records found</p>
                <p className="text-sm">Try adjusting your search or add a new record.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* --- ADD/EDIT MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-lg text-slate-800">{editingId ? 'Edit Record' : 'Add Record'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSave} className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    autoFocus
                    type="text" 
                    required
                    placeholder={activeTab === 'exporters' ? "e.g. Acme Corp Ltd" : "e.g. Heat Treatment"}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                    {activeTab === 'exporters' ? 'City / Location' : activeTab === 'treatments' ? 'Type / Code' : 'Location'}
                  </label>
                  <input 
                    type="text" 
                    placeholder="Optional details..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                    value={formData.detail}
                    onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)} 
                    className="flex-1 py-3 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                  >
                    Save
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

const StatBadge = ({ label, value, color = "text-blue-600 bg-blue-50 border-blue-100" }) => (
  <div className={`hidden md:flex flex-col items-center justify-center px-5 py-2 rounded-xl border ${color}`}>
     <span className="text-xl font-bold leading-none">{value}</span>
     <span className="text-[10px] font-bold uppercase opacity-70 mt-1">{label}</span>
  </div>
);

const GridCard = ({ item, config, onEdit, onDelete, onToggle }) => (
  <div className="group bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all">
    <div className="flex justify-between items-start mb-3">
      <div className={`p-2.5 rounded-xl ${config.color === 'blue' ? 'bg-blue-50 text-blue-600' : config.color === 'purple' ? 'bg-purple-50 text-purple-600' : 'bg-emerald-50 text-emerald-600'}`}>
        {config.icon}
      </div>
      <button onClick={onToggle} className="focus:outline-none hover:opacity-80 transition-opacity">
         <StatusBadge status={item.status} />
      </button>
    </div>
    
    <h4 className="font-bold text-slate-800 text-lg mb-1">{item.name}</h4>
    <p className="text-sm text-slate-400 font-medium mb-4">{item.detail}</p>
    
    <div className="flex gap-2 pt-4 border-t border-slate-50">
      <button onClick={onEdit} className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold text-slate-600 bg-slate-50 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
        <Edit2 size={14}/> Edit
      </button>
      <button onClick={onDelete} className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold text-slate-600 bg-slate-50 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors">
        <Trash2 size={14}/> Delete
      </button>
    </div>
  </div>
);

const StatusBadge = ({ status }) => (
  <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
    status === 'Active' 
      ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
      : 'bg-slate-100 text-slate-500 border-slate-200'
  }`}>
    <div className={`w-1.5 h-1.5 rounded-full ${status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
    {status}
  </span>
);

export default MasterData;