import React, { useState } from 'react';
import { 
  TrendingUp, Users, Building2, AlertTriangle, DollarSign, Activity,
  ArrowUpRight, ArrowDownRight, FileText, Clock, CheckCircle2, XCircle,
  Download, RefreshCw, Server, Shield, Database, MoreHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- MOCK DATA ---
const METRICS = [
  { title: "Total Revenue", value: "₹4,25,000", trend: "+12.5%", isUp: true, icon: DollarSign, color: "emerald" },
  { title: "Active Branches", value: "4 / 5", trend: "1 Inactive", isUp: false, icon: Building2, color: "blue" },
  { title: "Certificates", value: "1,240", trend: "+8.2%", isUp: true, icon: FileText, color: "purple" },
  { title: "System Alerts", value: "3", trend: "Action Req", isUp: false, icon: AlertTriangle, color: "amber" },
];

const REVENUE_DATA = [
  { month: 'Jan', val: 35 }, { month: 'Feb', val: 45 }, { month: 'Mar', val: 40 },
  { month: 'Apr', val: 60 }, { month: 'May', val: 55 }, { month: 'Jun', val: 75 },
  { month: 'Jul', val: 85 }, { month: 'Aug', val: 80 }, { month: 'Sep', val: 95 },
  { month: 'Oct', val: 100 }, // Current
];

const LOGS = [
  { id: 1, action: 'Certificate Created', user: 'Rajeev (Gujarat)', time: '10 mins ago', status: 'success' },
  { id: 2, action: 'Stock Added', user: 'Amit (Punjab)', time: '35 mins ago', status: 'success' },
  { id: 3, action: 'Login Failed', user: 'IP: 192.168.1.1', time: '1 hour ago', status: 'error' },
  { id: 4, action: 'Invoice Generated', user: 'System', time: '2 hours ago', status: 'info' },
  { id: 5, action: 'Config Changed', user: 'Super Admin', time: '5 hours ago', status: 'warning' },
  { id: 6, action: 'DB Backup', user: 'System', time: '6 hours ago', status: 'success' },
];

const AdminDashboard = () => {
  const [logFilter, setLogFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('month');

  // Filter Logic for Logs
  const filteredLogs = logFilter === 'all' 
    ? LOGS 
    : LOGS.filter(l => l.status === logFilter);

  // Animation Variants
  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVars}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-7xl mx-auto pb-10"
    >
      
      {/* --- 1. Header & Actions --- */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Executive Dashboard</h1>
          <p className="text-slate-500 mt-1">Real-time system overview for <span className="font-semibold text-indigo-600">October 2025</span></p>
        </div>
        
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium shadow-sm">
            <Download size={16} /> Export Report
          </button>
          <div className="bg-white p-1 rounded-lg border border-slate-200 shadow-sm flex text-xs font-bold">
            {['week', 'month', 'year'].map((range) => (
              <button 
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-md capitalize transition-all ${timeRange === range ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- 2. Metrics Grid --- */}
      <motion.div 
        variants={containerVars}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {METRICS.map((m, i) => (
          <MetricCard key={i} {...m} variants={itemVars} />
        ))}
      </motion.div>

      {/* --- 3. Main Analytics Area --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Section (2/3) */}
        <motion.div variants={itemVars} className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Revenue Trends</h3>
              <p className="text-xs text-slate-400">Monthly breakdown vs Targets</p>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              <TrendingUp size={16} /> +12.5% Growth
            </div>
          </div>

          {/* Custom CSS Bar Chart */}
          <div className="flex items-end justify-between h-64 gap-2 md:gap-4 px-2">
            {REVENUE_DATA.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
                {/* Tooltip (Hover) */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -mt-8 bg-slate-800 text-white text-[10px] px-2 py-1 rounded mb-2">
                  {d.val}k
                </div>
                {/* Bar */}
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${d.val}%` }}
                  transition={{ duration: 1, delay: i * 0.05, type: 'spring' }}
                  className={`w-full max-w-[40px] rounded-t-lg relative overflow-hidden ${i === REVENUE_DATA.length - 1 ? 'bg-indigo-600 shadow-lg shadow-indigo-200' : 'bg-slate-100 group-hover:bg-indigo-300'}`}
                >
                  <div className="absolute bottom-0 left-0 w-full bg-white/20 h-1/2"></div>
                </motion.div>
                <span className={`text-[10px] font-bold uppercase ${i === REVENUE_DATA.length - 1 ? 'text-indigo-600' : 'text-slate-400'}`}>
                  {d.month}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Command Center (1/3) */}
        <motion.div variants={itemVars} className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col justify-between relative overflow-hidden min-h-[350px]">
           {/* Decorative Elements */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 -mr-16 -mt-16 pointer-events-none"></div>
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 -ml-16 -mb-16 pointer-events-none"></div>

           <div className="relative z-10">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Activity className="text-emerald-400 animate-pulse" size={20} /> System Status
                </h3>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                  ONLINE
                </span>
             </div>

             <div className="space-y-4 mb-8">
               <StatusRow label="Database" value="Connected" icon={<Database size={14}/>} color="text-blue-400" />
               <StatusRow label="API Gateway" value="98ms Latency" icon={<Server size={14}/>} color="text-emerald-400" />
               <StatusRow label="Firewall" value="Active" icon={<Shield size={14}/>} color="text-purple-400" />
             </div>
           </div>

           <div className="relative z-10 space-y-3">
             <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Quick Actions</p>
             <button className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm transition-all group">
               <span className="flex items-center gap-2"><RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-500"/> Clear System Cache</span>
             </button>
             <button className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm transition-all">
               <span className="flex items-center gap-2"><Server size={16}/> Restart Services</span>
             </button>
           </div>
        </motion.div>
      </div>

      {/* --- 4. Live Logs with Tabs --- */}
      <motion.div variants={itemVars} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <div className="flex items-center gap-2">
             <Clock size={18} className="text-slate-400"/>
             <span className="font-bold text-slate-700">Audit Logs</span>
          </div>
          
          <div className="flex bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
            {['all', 'success', 'warning', 'error'].map(filter => (
              <button
                key={filter}
                onClick={() => setLogFilter(filter)}
                className={`px-3 py-1 text-xs font-bold rounded-md capitalize transition-all ${
                  logFilter === filter 
                    ? 'bg-slate-800 text-white shadow' 
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-slate-500 uppercase text-xs font-semibold bg-slate-50/50">
              <tr>
                <th className="p-4">Event Type</th>
                <th className="p-4">User / Source</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence mode='wait'>
                {filteredLogs.map((log) => (
                  <motion.tr 
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="p-4 font-medium text-slate-700">{log.action}</td>
                    <td className="p-4 text-slate-500">{log.user}</td>
                    <td className="p-4 text-slate-400 font-mono text-xs">{log.time}</td>
                    <td className="p-4 text-center">
                      <StatusBadge status={log.status} />
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-slate-400 hover:text-indigo-600"><MoreHorizontal size={16}/></button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filteredLogs.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-sm">No logs found for this filter.</div>
          )}
        </div>
      </motion.div>

    </motion.div>
  );
};

// --- SUB-COMPONENTS ---

const MetricCard = ({ title, value, trend, isUp, icon: Icon, color, variants }) => {
  const colorMap = {
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    amber: "bg-amber-50 text-amber-600"
  };

  return (
    <motion.div 
      variants={variants}
      whileHover={{ y: -4 }}
      className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${colorMap[color]}`}>
          <Icon size={24} />
        </div>
        <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${isUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {isUp ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>} {trend}
        </span>
      </div>
      <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{value}</h3>
      <p className="text-sm font-medium text-slate-500 mt-1">{title}</p>
    </motion.div>
  );
};

const StatusRow = ({ label, value, icon, color }) => (
  <div className="flex justify-between items-center p-2 rounded hover:bg-white/5 transition-colors">
    <div className="flex items-center gap-3 text-sm text-slate-300">
      {icon} {label}
    </div>
    <span className={`text-sm font-mono font-bold ${color}`}>{value}</span>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    success: "bg-emerald-100 text-emerald-700",
    error: "bg-red-100 text-red-700",
    warning: "bg-amber-100 text-amber-700",
    info: "bg-blue-100 text-blue-700"
  };
  
  const icons = {
    success: <CheckCircle2 size={14}/>,
    error: <XCircle size={14}/>,
    warning: <AlertTriangle size={14}/>,
    info: <Activity size={14}/>
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${styles[status]}`}>
      {icons[status]} <span className="capitalize">{status}</span>
    </span>
  );
};

export default AdminDashboard;