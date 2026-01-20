import React, { useState } from 'react';
import { 
  FileSpreadsheet, Printer, Filter, Search, Calendar, 
  BarChart2, Table, ArrowUpRight, Download, ChevronDown
} from 'lucide-react';

// --- MOCK DATA (Matching the Image Structure) ---
const REGISTER_DATA = [
  { 
    id: '043 A', 
    fumDate: '27-08-2025', 
    issueDate: '29-08-2025', 
    dosage: '32/m³', 
    temp: '26°C', 
    party: 'KRBL Limited', 
    billingParty: 'KRBL Limited', 
    container: "MRKU-9440920(20')", 
    invoiceNo: '2717200146', 
    billNo: 'Monthly', 
    amount: null, 
    country: 'Kuwait', 
    disDate: '28-08-2025', 
    place: 'DPCS', 
    makeBy: 'Rajeev',
    branch: 'Gujarat'
  },
  { 
    id: '044 B', 
    fumDate: '28-08-2025', 
    issueDate: '30-08-2025', 
    dosage: '48/m³', 
    temp: '30°C', 
    party: 'Ralington Exports', 
    billingParty: 'Ralington Exports', 
    container: "MSCU-1234567(40')", 
    invoiceNo: '2717200147', 
    billNo: 'Paid', 
    amount: 12000, 
    country: 'USA', 
    disDate: '29-08-2025', 
    place: 'Mundra', 
    makeBy: 'Amit',
    branch: 'Punjab'
  },
  { 
    id: '045 A', 
    fumDate: '28-08-2025', 
    issueDate: '29-08-2025', 
    dosage: '32/m³', 
    temp: '25°C', 
    party: 'Designers Desire', 
    billingParty: 'Designers Desire', 
    container: "GLDU-9876543(20')", 
    invoiceNo: 'Pending', 
    billNo: '-', 
    amount: 4500, 
    country: 'Russia', 
    disDate: '29-08-2025', 
    place: 'DPCS', 
    makeBy: 'Rajeev',
    branch: 'Gujarat'
  },
];

const ReportsView = () => {
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // --- Logic: Filter Data ---
  const filteredData = REGISTER_DATA.filter(item => {
    // 1. Branch Filter
    const matchBranch = selectedBranch === 'All' || item.branch === selectedBranch;
    // 2. Search Filter (Party, Container, or Cert No)
    const searchLower = searchTerm.toLowerCase();
    const matchSearch = 
      item.party.toLowerCase().includes(searchLower) || 
      item.container.toLowerCase().includes(searchLower) || 
      item.id.toLowerCase().includes(searchLower);
    
    return matchBranch && matchSearch;
  });

  // --- Logic: Calculations ---
  const totalRecords = filteredData.length;
  const totalRevenue = filteredData.reduce((sum, item) => sum + (item.amount || 0), 0);

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6 min-h-screen bg-slate-50/50">
      
      {/* --- 1. Header --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Fumigation Register</h1>
          <p className="text-slate-500 mt-1 text-sm">Detailed log of all issued certificates and billing details.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-semibold shadow-sm transition-all"
          >
            <Printer size={18} /> Print Register
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-sm transition-all shadow-emerald-500/20">
            <FileSpreadsheet size={18} /> Export Excel
          </button>
        </div>
      </div>

      {/* --- 2. Filter Toolbar --- */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-4 items-end">
        
        {/* Branch Selector */}
        <div className="w-full lg:w-48">
          <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Select Branch</label>
          <div className="relative">
            <select 
              value={selectedBranch} 
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full pl-3 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium appearance-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
            >
              <option value="All">All Branches</option>
              <option value="Gujarat">Gujarat Branch</option>
              <option value="Punjab">Punjab Branch</option>
              <option value="Mumbai">Mumbai Branch</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16}/>
          </div>
        </div>

        {/* Date Range */}
        <div className="flex gap-2 w-full lg:w-auto">
          <div className="flex-1">
             <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">From Date</label>
             <input type="date" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" />
          </div>
          <div className="flex-1">
             <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">To Date</label>
             <input type="date" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" />
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 w-full">
          <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Search Records</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by Cert No, Party Name, or Container..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* --- 3. The Big Data Table (Exact Replica) --- */}
      <div className="bg-white border border-slate-300 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {/* Header Row */}
              <tr className="bg-slate-100 text-slate-900 text-xs font-bold uppercase tracking-tight border-b-2 border-slate-300">
                <th className="p-3 border-r border-slate-200 whitespace-nowrap">Certi. No.</th>
                <th className="p-3 border-r border-slate-200 whitespace-nowrap text-center">
                  <div>Fumigation</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Dis. Date</div>
                </th>
                <th className="p-3 border-r border-slate-200 whitespace-nowrap text-center">
                  <div>Date Of Issue</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Place / Make By</div>
                </th>
                <th className="p-3 border-r border-slate-200 whitespace-nowrap">Dosages</th>
                <th className="p-3 border-r border-slate-200 whitespace-nowrap">Temp.</th>
                <th className="p-3 border-r border-slate-200 whitespace-nowrap min-w-[200px]">Party Name</th>
                <th className="p-3 border-r border-slate-200 whitespace-nowrap min-w-[200px]">Billing Party</th>
                <th className="p-3 border-r border-slate-200 whitespace-nowrap">Container No. / Pallets</th>
                <th className="p-3 border-r border-slate-200 whitespace-nowrap">Invoice No.</th>
                <th className="p-3 border-r border-slate-200 whitespace-nowrap">Bill No.</th>
                <th className="p-3 border-r border-slate-200 whitespace-nowrap text-right">Amount</th>
                <th className="p-3 whitespace-nowrap">Country</th>
              </tr>
            </thead>
            
            <tbody className="text-sm text-slate-800 font-medium">
              {filteredData.map((row, idx) => (
                <tr key={idx} className="hover:bg-blue-50/50 transition-colors border-b border-slate-200 group">
                  
                  {/* Cert No */}
                  <td className="p-3 border-r border-slate-200 font-bold bg-slate-50/50 group-hover:bg-blue-50/50">
                    {row.id}
                  </td>
                  
                  {/* Dates */}
                  <td className="p-3 border-r border-slate-200 text-center">
                    <div>{row.fumDate}</div>
                    <div className="text-xs text-slate-500 mt-1 pt-1 border-t border-slate-100">{row.disDate}</div>
                  </td>
                  
                  {/* Issue Info */}
                  <td className="p-3 border-r border-slate-200 text-center">
                    <div>{row.issueDate}</div>
                    <div className="text-xs text-slate-500 mt-1 pt-1 border-t border-slate-100">
                      {row.place} / <span className="text-blue-600">{row.makeBy}</span>
                    </div>
                  </td>

                  {/* Tech Specs */}
                  <td className="p-3 border-r border-slate-200 font-mono text-xs">{row.dosage}</td>
                  <td className="p-3 border-r border-slate-200 font-mono text-xs">{row.temp}</td>

                  {/* Parties (Highlighted) */}
                  <td className="p-3 border-r border-slate-200 text-emerald-700 font-bold bg-emerald-50/30">
                    {row.party}
                  </td>
                  <td className="p-3 border-r border-slate-200 text-emerald-700 font-bold bg-emerald-50/30">
                    {row.billingParty}
                  </td>

                  {/* Container (Highlighted) */}
                  <td className="p-3 border-r border-slate-200 text-amber-700 font-bold font-mono text-xs bg-amber-50/30">
                    {row.container}
                  </td>

                  {/* Invoice (Highlighted) */}
                  <td className="p-3 border-r border-slate-200 text-amber-700 font-bold bg-amber-50/30">
                    {row.invoiceNo}
                  </td>

                  {/* Bill No (Green Highlight) */}
                  <td className="p-3 border-r border-slate-200 text-green-700 font-bold bg-green-50/30">
                    {row.billNo}
                  </td>

                  {/* Amount */}
                  <td className="p-3 border-r border-slate-200 text-right font-mono">
                    {row.amount ? `₹${row.amount.toLocaleString()}` : '-'}
                  </td>

                  {/* Country */}
                  <td className="p-3 text-slate-600">
                    {row.country}
                  </td>
                </tr>
              ))}
              
              {/* Empty State */}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan="12" className="p-12 text-center text-slate-400">
                    No records found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
            
            {/* Footer Summary */}
            <tfoot className="bg-slate-100 border-t-2 border-slate-300 font-bold text-slate-800">
              <tr>
                <td colSpan="10" className="p-4 text-right uppercase text-xs tracking-wider">
                  Total Revenue ({totalRecords} Certificates):
                </td>
                <td className="p-4 text-right text-indigo-700 bg-indigo-50">
                  ₹{totalRevenue.toLocaleString()}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

    </div>
  );
};

export default ReportsView;