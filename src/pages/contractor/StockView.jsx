import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Plus, 
  History, 
  Package, 
  ArrowUpRight, 
  ArrowDownRight,
  Search,
  X
} from 'lucide-react';
import { MOCK_STOCK } from '../../data/mockData';

// --- Constants & Thresholds ---
const THRESHOLDS = { MB: 100, ALP: 60, Certificates: 100 }; // Low stock limits
const MAX_CAPACITY = { MB: 1000, ALP: 500, Certificates: 2000 }; // For progress bars

// --- Mock Transaction History ---
const INITIAL_HISTORY = [
  { id: 1, date: '2025-09-01', branch: 'Gujarat', type: 'Inward', item: 'Methyl Bromide', qty: 200, ref: 'PO-9921' },
  { id: 2, date: '2025-09-02', branch: 'Punjab', type: 'Consumption', item: 'ALP', qty: -15, ref: 'Cert #043 A' },
  { id: 3, date: '2025-09-05', branch: 'Gujarat', type: 'Consumption', item: 'Certificates', qty: -5, ref: 'Cert #095 A' },
];

const StockView = () => {
  const [stockData, setStockData] = useState(MOCK_STOCK);
  const [history, setHistory] = useState(INITIAL_HISTORY);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' or 'history'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('Gujarat'); // Default for modal

  // --- Logic: Add Stock ---
  const handleAddStock = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const branch = formData.get('branch');
    const itemType = formData.get('itemType'); // Matches keys in MOCK_STOCK (MB, ALP, Certificates)
    const qty = parseInt(formData.get('quantity'));
    
    // 1. Update Stock State
    setStockData(prev => ({
      ...prev,
      [branch]: {
        ...prev[branch],
        [itemType]: prev[branch][itemType] + qty
      }
    }));

    // 2. Add to History
    const newItem = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      branch: branch,
      type: 'Inward',
      item: itemType === 'MB' ? 'Methyl Bromide' : itemType === 'ALP' ? 'Alum. Phosphide' : 'Certificates',
      qty: qty,
      ref: formData.get('batchNo') || 'Manual Adjustment'
    };
    setHistory([newItem, ...history]);
    
    // 3. Close Modal
    setIsModalOpen(false);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto relative">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Stock Maintenance</h2>
          <p className="text-slate-500 text-sm mt-1">Track chemical inventory and stationery across branches.</p>
        </div>
        
        <div className="flex gap-3">
          <div className="flex bg-white rounded-lg border border-slate-200 p-1">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'history' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              History Log
            </button>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm"
          >
            <Plus size={18} /> Add Stock
          </button>
        </div>
      </div>

      {/* --- TAB 1: OVERVIEW (Cards) --- */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {Object.entries(stockData).map(([branch, stock]) => (
            <BranchStockCard 
              key={branch} 
              branch={branch} 
              stock={stock} 
              onAddClick={() => { setSelectedBranch(branch); setIsModalOpen(true); }}
            />
          ))}
        </div>
      )}

      {/* --- TAB 2: HISTORY (Table) --- */}
      {activeTab === 'history' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
           <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
              <History size={18} className="text-slate-500"/>
              <span className="font-semibold text-slate-700">Recent Transactions</span>
           </div>
           <table className="w-full text-left text-sm">
             <thead className="bg-slate-50 text-slate-600 uppercase font-semibold">
               <tr>
                 <th className="p-4">Date</th>
                 <th className="p-4">Branch</th>
                 <th className="p-4">Item</th>
                 <th className="p-4">Type</th>
                 <th className="p-4 text-right">Qty</th>
                 <th className="p-4">Reference</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {history.map((tx) => (
                 <tr key={tx.id} className="hover:bg-slate-50">
                   <td className="p-4 text-slate-600">{tx.date}</td>
                   <td className="p-4 font-medium">{tx.branch}</td>
                   <td className="p-4">{tx.item}</td>
                   <td className="p-4">
                     <span className={`px-2 py-1 rounded text-xs font-medium ${tx.type === 'Inward' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                       {tx.type}
                     </span>
                   </td>
                   <td className={`p-4 text-right font-bold ${tx.qty > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                     {tx.qty > 0 ? '+' : ''}{tx.qty}
                   </td>
                   <td className="p-4 text-slate-500 text-xs">{tx.ref}</td>
                 </tr>
               ))}
             </tbody>
           </table>
        </div>
      )}

      {/* --- MODAL: ADD STOCK --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">Inward Stock Entry</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddStock} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Branch</label>
                <select 
                  name="branch" 
                  defaultValue={selectedBranch}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-slate-50"
                >
                  {Object.keys(stockData).map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Item Type</label>
                  <select name="itemType" className="w-full p-2.5 border border-slate-300 rounded-lg text-sm">
                    <option value="MB">Methyl Bromide (kg)</option>
                    <option value="ALP">Alum. Phosphide (kg)</option>
                    <option value="Certificates">Certificates (Pcs)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Quantity</label>
                  <input type="number" name="quantity" required className="w-full p-2.5 border border-slate-300 rounded-lg text-sm" placeholder="e.g. 50" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Batch / Invoice No</label>
                <input type="text" name="batchNo" className="w-full p-2.5 border border-slate-300 rounded-lg text-sm" placeholder="e.g. PO-2025-001" />
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 border border-slate-300 rounded-lg text-slate-600 font-medium hover:bg-slate-50">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">Add Stock</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

// --- Sub-Component: Branch Card ---
const BranchStockCard = ({ branch, stock, onAddClick }) => {
  // Helper to check low stock
  const checkLow = (type, val) => val < THRESHOLDS[type];
  
  const hasAlerts = checkLow('MB', stock.MB) || checkLow('ALP', stock.ALP) || checkLow('Certificates', stock.Certificates);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 font-bold">
            {branch.substring(0, 2).toUpperCase()}
          </div>
          <h3 className="font-bold text-lg text-slate-800">{branch} Branch</h3>
        </div>
        <button onClick={onAddClick} className="text-blue-600 text-sm font-medium hover:bg-blue-50 px-3 py-1.5 rounded transition-colors">
          + Quick Add
        </button>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
        <StockItem 
          label="Methyl Bromide" 
          value={stock.MB} 
          unit="kg" 
          max={MAX_CAPACITY.MB} 
          color="blue" 
          isLow={checkLow('MB', stock.MB)} 
        />
        <StockItem 
          label="Alum. Phosphide" 
          value={stock.ALP} 
          unit="kg" 
          max={MAX_CAPACITY.ALP} 
          color="purple" 
          isLow={checkLow('ALP', stock.ALP)} 
        />
        <StockItem 
          label="Certificates" 
          value={stock.Certificates} 
          unit="Pcs" 
          max={MAX_CAPACITY.Certificates} 
          color="amber" 
          isLow={checkLow('Certificates', stock.Certificates)} 
        />
      </div>

      {hasAlerts && (
        <div className="px-6 pb-6 animate-pulse">
           <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm border border-red-100">
              <AlertTriangle size={16} />
              <span className="font-medium">Action Required: Low stock levels detected.</span>
           </div>
        </div>
      )}
    </div>
  );
};

// --- Sub-Component: Individual Stock Item Display ---
const StockItem = ({ label, value, unit, max, color, isLow }) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  // Dynamic color classes
  const colorMap = {
    blue: { text: 'text-blue-700', bg: 'bg-blue-50', bar: 'bg-blue-500' },
    purple: { text: 'text-purple-700', bg: 'bg-purple-50', bar: 'bg-purple-500' },
    amber: { text: 'text-amber-700', bg: 'bg-amber-50', bar: 'bg-amber-500' },
  };
  
  const activeColor = isLow ? { text: 'text-red-700', bg: 'bg-red-50', bar: 'bg-red-500' } : colorMap[color];

  return (
    <div className={`p-4 rounded-xl border ${activeColor.bg} border-transparent transition-all hover:border-slate-200`}>
      <div className="flex justify-between items-start mb-2">
        <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">{label}</p>
        {isLow && <AlertTriangle size={14} className="text-red-500" />}
      </div>
      
      <div className="flex items-end gap-1 mb-3">
        <span className={`text-3xl font-bold ${activeColor.text}`}>{value}</span>
        <span className="text-sm text-slate-400 font-medium mb-1">{unit}</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-white/60 rounded-full h-1.5 overflow-hidden">
        <div 
          className={`h-full rounded-full ${activeColor.bar} transition-all duration-500 ease-out`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <p className="text-[10px] text-slate-400 mt-2 text-right">Capacity: {percentage.toFixed(0)}%</p>
    </div>
  );
};

export default StockView;