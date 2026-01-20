import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Search, Filter, Download, Plus, MoreVertical, 
  CheckCircle, Clock, AlertCircle, Trash2, FileText, X,
  ChevronLeft, ChevronRight, Printer, Eye, Share2
} from 'lucide-react';

// --- Extended Mock Data ---
const INITIAL_INVOICES = [
  { id: 'INV-2025-001', date: '2025-09-01', client: 'KRBL Limited', address: 'Delhi, India', amount: 45000, status: 'Paid', items: 3, tax: 8100 },
  { id: 'INV-2025-002', date: '2025-09-02', client: 'Ralington Exports', address: 'Karnal, Haryana', amount: 12500, status: 'Pending', items: 1, tax: 2250 },
  { id: 'INV-2025-003', date: '2025-08-28', client: 'Casewell Drilling', address: 'Mumbai, MH', amount: 8200, status: 'Overdue', items: 1, tax: 1476 },
  { id: 'INV-2025-004', date: '2025-09-05', client: 'Fortune Rice Ltd', address: 'Punjab, India', amount: 33000, status: 'Pending', items: 2, tax: 5940 },
  { id: 'INV-2025-005', date: '2025-09-06', client: 'Designers Desire', address: 'Jaipur, RJ', amount: 5400, status: 'Paid', items: 1, tax: 972 },
];

const BillingView = () => {
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newInvoice, setNewInvoice] = useState({ client: '', amount: '', status: 'Pending', date: new Date().toISOString().split('T')[0], address: '' });

  // --- Logic: Filter & Search ---
  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inv.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || inv.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const paginatedInvoices = filteredInvoices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => setCurrentPage(1), [searchTerm, filterStatus]);

  // --- Logic: Stats ---
  const totalRevenue = invoices.reduce((sum, inv) => sum + Number(inv.amount), 0);
  const pendingAmount = invoices.filter(i => i.status !== 'Paid').reduce((sum, inv) => sum + Number(inv.amount), 0);
  const paidCount = invoices.filter(i => i.status === 'Paid').length;

  // --- ACTIONS ---

  const handleDelete = (id) => {
    if(window.confirm('Delete this invoice permanently?')) {
      setInvoices(invoices.filter(inv => inv.id !== id));
    }
  };

  const handleMarkPaid = (id) => {
    setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status: 'Paid' } : inv));
  };

  const handleCreateInvoice = (e) => {
    e.preventDefault();
    const baseAmount = Number(newInvoice.amount);
    const tax = baseAmount * 0.18; // 18% GST Mock
    const newItem = {
      id: `INV-2025-0${invoices.length + 1}`,
      ...newInvoice,
      amount: baseAmount,
      items: 1,
      tax: tax
    };
    setInvoices([newItem, ...invoices]);
    setIsModalOpen(false);
    setNewInvoice({ client: '', amount: '', status: 'Pending', date: new Date().toISOString().split('T')[0], address: '' });
  };

  // --- EXPORT TO CSV ENGINE ---
  const handleExportCSV = () => {
    const headers = ["Invoice ID", "Client", "Date", "Base Amount", "Tax (18%)", "Total", "Status"];
    const rows = filteredInvoices.map(inv => [
      inv.id, inv.client, inv.date, inv.amount, inv.tax, (inv.amount + inv.tax), inv.status
    ]);
    
    let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Invoices_Export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- PRINT INVOICE ENGINE (The "Best Design" Generator) ---
  const handlePrintInvoice = (inv) => {
    const total = inv.amount + inv.tax;
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    const htmlContent = `
      <html>
        <head>
          <title>Invoice #${inv.id}</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; }
            .header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
            .logo { font-size: 24px; font-weight: bold; color: #2563EB; }
            .invoice-details { text-align: right; }
            .status-badge { display: inline-block; padding: 5px 10px; border-radius: 4px; font-weight: bold; font-size: 12px; text-transform: uppercase; }
            .status-Paid { background: #d1fae5; color: #047857; border: 1px solid #a7f3d0; }
            .status-Pending { background: #fef3c7; color: #b45309; border: 1px solid #fde68a; }
            .status-Overdue { background: #fee2e2; color: #b91c1c; border: 1px solid #fca5a5; }
            .bill-to { margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { background: #f8fafc; text-align: left; padding: 12px; border-bottom: 2px solid #e2e8f0; font-size: 12px; text-transform: uppercase; color: #64748b; }
            td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
            .totals { width: 300px; margin-left: auto; }
            .row { display: flex; justify-content: space-between; padding: 8px 0; }
            .grand-total { font-size: 18px; font-weight: bold; border-top: 2px solid #333; padding-top: 10px; margin-top: 10px; }
            .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #94a3b8; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">FumiManager Inc.</div>
              <div style="font-size: 14px; color: #666; margin-top: 5px;">
                123 Industrial Estate, Mundra Port<br>Gujarat, India - 370421<br>GSTIN: 24AAACC1234J1Z2
              </div>
            </div>
            <div class="invoice-details">
              <h1 style="margin: 0; font-size: 32px; color: #1e293b;">INVOICE</h1>
              <p style="margin: 5px 0;"><strong>#${inv.id}</strong></p>
              <p style="margin: 5px 0;">Date: ${inv.date}</p>
              <div class="status-badge status-${inv.status}">${inv.status}</div>
            </div>
          </div>

          <div class="bill-to">
            <h3 style="font-size: 14px; text-transform: uppercase; color: #64748b; margin-bottom: 10px;">Bill To:</h3>
            <div style="font-size: 16px; font-weight: bold;">${inv.client}</div>
            <div style="color: #666;">${inv.address || 'Address on file'}</div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 50%">Description</th>
                <th style="text-align: center">Qty</th>
                <th style="text-align: right">Unit Price</th>
                <th style="text-align: right">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Fumigation Services (Methyl Bromide)</strong><br><span style="font-size: 12px; color: #666;">Standard container treatment service</span></td>
                <td style="text-align: center">${inv.items}</td>
                <td style="text-align: right">₹${(inv.amount / inv.items).toFixed(2)}</td>
                <td style="text-align: right"><strong>₹${inv.amount.toLocaleString()}</strong></td>
              </tr>
            </tbody>
          </table>

          <div class="totals">
            <div class="row">
              <span>Subtotal:</span>
              <span>₹${inv.amount.toLocaleString()}</span>
            </div>
            <div class="row">
              <span>IGST (18%):</span>
              <span>₹${inv.tax.toLocaleString()}</span>
            </div>
            <div class="row grand-total">
              <span>Total Due:</span>
              <span>₹${total.toLocaleString()}</span>
            </div>
          </div>

          <div class="footer">
            <p>This is a computer-generated invoice and does not require a signature.</p>
            <p>Thank you for your business!</p>
          </div>

          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Billing & Payments</h2>
          <p className="text-slate-500 text-sm mt-1">Track revenue, manage invoices, and download reports.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all active:scale-95 font-semibold"
        >
          <Plus size={18} /> Generate Invoice
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Revenue" amount={`₹${totalRevenue.toLocaleString()}`} icon={<FileText size={24} className="text-blue-600" />} bg="bg-blue-50" />
        <StatCard title="Pending Payments" amount={`₹${pendingAmount.toLocaleString()}`} icon={<Clock size={24} className="text-amber-600" />} bg="bg-amber-50" />
        <StatCard title="Invoices Cleared" amount={paidCount} icon={<CheckCircle size={24} className="text-emerald-600" />} bg="bg-emerald-50" isCount={true} />
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search clients or invoice ID..." 
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
            <Filter size={16} className="text-slate-500" />
            <select 
              className="bg-transparent text-sm text-slate-700 focus:outline-none cursor-pointer"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium transition-colors"
          >
            <Download size={18} /> Export CSV
          </button>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-xs border-b border-slate-200">
              <tr>
                <th className="p-4 w-40">Invoice #</th>
                <th className="p-4">Client Details</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Total (Inc. Tax)</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedInvoices.length > 0 ? (
                paginatedInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="p-4 font-bold text-blue-600 font-mono">{inv.id}</td>
                    <td className="p-4">
                      <div className="font-bold text-slate-800">{inv.client}</div>
                      <div className="text-xs text-slate-400">{inv.address || 'Address on file'}</div>
                    </td>
                    <td className="p-4 text-slate-600">{inv.date}</td>
                    <td className="p-4 text-right font-bold text-slate-700">₹{(inv.amount + (inv.tax || 0)).toLocaleString()}</td>
                    <td className="p-4 text-center">
                      <StatusBadge status={inv.status} />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ActionButton 
                          onClick={() => handlePrintInvoice(inv)} 
                          icon={Printer} 
                          color="text-blue-600 hover:bg-blue-50" 
                          tooltip="Print Invoice"
                        />
                        {inv.status !== 'Paid' && (
                          <ActionButton 
                            onClick={() => handleMarkPaid(inv.id)} 
                            icon={CheckCircle} 
                            color="text-emerald-600 hover:bg-emerald-50" 
                            tooltip="Mark Paid"
                          />
                        )}
                        <ActionButton 
                          onClick={() => handleDelete(inv.id)} 
                          icon={Trash2} 
                          color="text-red-500 hover:bg-red-50" 
                          tooltip="Delete"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-slate-400">
                    <div className="flex flex-col items-center">
                      <FileText size={48} className="mb-4 opacity-20" />
                      <p>No invoices found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-xs text-slate-500 font-medium">
          <span>
            Page {currentPage} of {totalPages} ({filteredInvoices.length} records)
          </span>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border rounded-lg bg-white hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center"
            >
              <ChevronLeft size={14} className="mr-1"/> Prev
            </button>
            <button 
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1.5 border rounded-lg bg-white hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center"
            >
              Next <ChevronRight size={14} className="ml-1"/>
            </button>
          </div>
        </div>
      </div>

      {/* --- Create Invoice Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-lg text-slate-800">Generate New Invoice</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateInvoice} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Client Name</label>
                <input 
                  type="text" required 
                  className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="e.g. Acme Corp"
                  value={newInvoice.client}
                  onChange={(e) => setNewInvoice({...newInvoice, client: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Client Address</label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="City, State"
                  value={newInvoice.address}
                  onChange={(e) => setNewInvoice({...newInvoice, address: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Base Amount (₹)</label>
                  <input 
                    type="number" required 
                    className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="0.00"
                    value={newInvoice.amount}
                    onChange={(e) => setNewInvoice({...newInvoice, amount: e.target.value})}
                  />
                </div>
                <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Date</label>
                   <input 
                     type="date" required 
                     className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                     value={newInvoice.date}
                     onChange={(e) => setNewInvoice({...newInvoice, date: e.target.value})}
                   />
                </div>
              </div>
              
              <button type="submit" className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95 mt-2">
                Create Invoice
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

// --- Sub-Components ---
const StatCard = ({ title, amount, icon, bg, isCount }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start justify-between">
    <div>
      <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{amount} {isCount && <span className="text-sm font-normal text-slate-400">total</span>}</h3>
    </div>
    <div className={`p-3 rounded-xl ${bg}`}>{icon}</div>
  </div>
);

const ActionButton = ({ onClick, icon: Icon, color, tooltip }) => (
  <button onClick={onClick} title={tooltip} className={`p-2 rounded-lg transition-colors ${color}`}>
    <Icon size={18} />
  </button>
);

const StatusBadge = ({ status }) => {
  const styles = {
    Paid: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Pending: "bg-amber-50 text-amber-700 border-amber-100",
    Overdue: "bg-red-50 text-red-700 border-red-100"
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${styles[status]}`}>
      {status}
    </span>
  );
};

export default BillingView;