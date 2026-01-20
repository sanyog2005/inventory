import React, { useState } from 'react';
import { 
  FileText, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Clock, 
  Plus, 
  Search, 
  MoreHorizontal,
  ArrowRight,
  Package,
  DollarSign
} from 'lucide-react';
import { MOCK_CERTIFICATES } from '../../data/mockData';

// --- Mock Data for Analytics ---
const WEEKLY_DATA = [
  { day: 'Mon', val: 12 },
  { day: 'Tue', val: 19 },
  { day: 'Wed', val: 15 },
  { day: 'Thu', val: 22 },
  { day: 'Fri', val: 18 },
  { day: 'Sat', val: 10 },
  { day: 'Sun', val: 5 },
];

const ALERTS = [
  { id: 1, type: 'stock', msg: 'ALP Stock low in Punjab (45kg)', severity: 'high' },
  { id: 2, type: 'billing', msg: 'Inv #2025-003 is Overdue (3 days)', severity: 'medium' },
  { id: 3, type: 'system', msg: 'System maintenance scheduled for Sun', severity: 'low' },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('All');

  // Filter logic for the table
  const filteredCerts = activeTab === 'All' 
    ? MOCK_CERTIFICATES 
    : MOCK_CERTIFICATES.filter(c => c.status.includes(activeTab === 'Issued' ? 'Issued' : 'Pending'));

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 text-sm">Welcome back, Operator. Here is what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <ActionButton icon={<Plus size={18}/>} label="New Certificate" primary />
          <ActionButton icon={<Package size={18}/>} label="Add Stock" />
        </div>
      </div>

      {/* 2. Enhanced Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <EnhancedStatCard 
          title="Certificates Issued" 
          value="12" 
          sub="Today" 
          trend="+2" 
          trendDir="up" 
          icon={<FileText className="text-blue-600" size={24} />} 
          bg="bg-blue-50"
        />
        <EnhancedStatCard 
          title="Revenue Generated" 
          value="₹45k" 
          sub="Today" 
          trend="+12%" 
          trendDir="up" 
          icon={<DollarSign className="text-emerald-600" size={24} />} 
          bg="bg-emerald-50"
        />
        <EnhancedStatCard 
          title="Pending Invoices" 
          value="5" 
          sub="Action Required" 
          trend="-1" 
          trendDir="down" 
          icon={<Clock className="text-amber-600" size={24} />} 
          bg="bg-amber-50"
        />
        <EnhancedStatCard 
          title="Total Gas Used" 
          value="85 kg" 
          sub="This Week" 
          trend="+5%" 
          trendDir="up" 
          icon={<Package className="text-purple-600" size={24} />} 
          bg="bg-purple-50"
        />
      </div>

      {/* 3. Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Recent Activity (Takes 2/3 width) */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Chart Section */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800">Weekly Output</h3>
              <select className="text-sm border-none bg-slate-50 rounded-md px-2 py-1 text-slate-500 cursor-pointer focus:ring-0">
                <option>This Week</option>
                <option>Last Week</option>
              </select>
            </div>
            {/* Custom CSS Bar Chart */}
            <div className="flex items-end justify-between h-40 gap-2">
              {WEEKLY_DATA.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
                  <div 
                    className="w-full bg-blue-100 rounded-t-md relative overflow-hidden group-hover:bg-blue-200 transition-all"
                    style={{ height: `${(d.val / 25) * 100}%` }}
                  >
                     <div className="absolute bottom-0 w-full bg-blue-500 h-0 transition-all duration-500 group-hover:h-full opacity-20"></div>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
              <h3 className="font-bold text-slate-800">Recent Certificates</h3>
              
              {/* Table Filters */}
              <div className="flex bg-slate-100 p-1 rounded-lg">
                {['All', 'Issued', 'Pending'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                      activeTab === tab ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="p-4">Cert No</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Exporter</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCerts.map((cert) => (
                    <tr key={cert.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-bold text-blue-600">{cert.id}</td>
                      <td className="p-4 text-slate-600">{cert.date}</td>
                      <td className="p-4 font-medium text-slate-800">{cert.party}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium border border-slate-200">
                          {cert.type}
                        </span>
                      </td>
                      <td className="p-4">
                        <StatusBadge status={cert.status} />
                      </td>
                      <td className="p-4 text-center">
                        <button className="text-slate-400 hover:text-blue-600">
                          <MoreHorizontal size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-3 border-t border-slate-200 text-center">
              <button className="text-xs font-bold text-blue-600 hover:underline flex items-center justify-center gap-1">
                View All Records <ArrowRight size={12}/>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Widgets (Takes 1/3 width) */}
        <div className="flex flex-col gap-6">
          
          {/* Widget 1: Alerts */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-500" /> 
              Attention Needed
            </h3>
            <div className="space-y-3">
              {ALERTS.map((alert) => (
                <div key={alert.id} className="flex gap-3 items-start p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${
                    alert.severity === 'high' ? 'bg-red-500' : 
                    alert.severity === 'medium' ? 'bg-amber-500' : 'bg-blue-400'
                  }`} />
                  <div>
                    <p className="text-sm text-slate-700 font-medium leading-tight">{alert.msg}</p>
                    <p className="text-xs text-slate-400 mt-1 capitalize">{alert.type} Alert</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Widget 2: Stock Quick View */}
          <div className="bg-slate-900 p-6 rounded-xl text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
               <Package size={120} />
            </div>
            <h3 className="font-bold text-lg mb-1">Gujarat Branch</h3>
            <p className="text-slate-400 text-sm mb-6">Stock Status</p>
            
            <div className="space-y-4 relative z-10">
              <StockProgress label="Methyl Bromide" val={450} max={1000} />
              <StockProgress label="Alum. Phosphide" val={120} max={500} warning />
            </div>

            <button className="mt-6 w-full py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors">
              Manage Inventory
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

// --- Helper Components ---

const ActionButton = ({ icon, label, primary }) => (
  <button className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all active:scale-95 ${
    primary 
      ? 'bg-blue-600 text-white hover:bg-blue-700' 
      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
  }`}>
    {icon} {label}
  </button>
);

const EnhancedStatCard = ({ title, value, sub, trend, trendDir, icon, bg }) => (
  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-lg ${bg}`}>{icon}</div>
      {trend && (
        <span className={`flex items-center text-xs font-bold ${trendDir === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
          {trendDir === 'up' ? <TrendingUp size={14} className="mr-1"/> : <TrendingDown size={14} className="mr-1"/>}
          {trend}
        </span>
      )}
    </div>
    <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
    <p className="text-sm text-slate-500 font-medium mt-1">{title}</p>
    <p className="text-xs text-slate-400 mt-2">{sub}</p>
  </div>
);

const StatusBadge = ({ status }) => {
  const isIssued = status.includes('Issued');
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
      isIssued ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isIssued ? 'bg-emerald-500' : 'bg-amber-500'}`} />
      {status}
    </span>
  );
};

const StockProgress = ({ label, val, max, warning }) => (
  <div>
    <div className="flex justify-between text-xs mb-1">
      <span className="text-slate-300">{label}</span>
      <span className={warning ? 'text-amber-400 font-bold' : 'text-slate-400'}>{val} kg</span>
    </div>
    <div className="w-full bg-slate-700 rounded-full h-1.5">
      <div 
        className={`h-1.5 rounded-full ${warning ? 'bg-amber-500' : 'bg-emerald-500'}`} 
        style={{ width: `${(val/max)*100}%` }}
      />
    </div>
  </div>
);

export default Dashboard;