import React, { useState } from 'react';
import { 
  Save, 
  RotateCcw, 
  Eye, 
  CheckSquare, 
  Square, 
  AlertCircle,
  FileBadge,
  Thermometer,
  Box,
  Truck
} from 'lucide-react';
import Input from '../../components/Input';
import { BRANCHES, TREATMENTS } from '../../data/mockData';

const INITIAL_FORM = {
  certNo: '',
  branch: 'Gujarat',
  treatment: 'Methyl Bromide (MB)',
  exporter: '',
  billingParty: '',
  consignee: '',
  fumiDate: '',
  issueDate: '',
  containerNo: '',
  packages: '',
  volume: '',
  // Technical
  dosage: '',
  temp: '',
  exposure: '',
  humidity: '',
  // Financial
  invoiceNo: '',
  amount: ''
};

const CertificateForm = () => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [sameAsExporter, setSameAsExporter] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState({});

  // --- Handlers ---
  const handleChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Auto-copy if toggle is active
      if (field === 'exporter' && sameAsExporter) {
        newData.billingParty = value;
      }
      return newData;
    });
    
    // Clear error when user types
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const toggleBilling = () => {
    setSameAsExporter(!sameAsExporter);
    if (!sameAsExporter) {
      setFormData(prev => ({ ...prev, billingParty: prev.exporter }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.certNo) newErrors.certNo = "Certificate No is required";
    if (!formData.exporter) newErrors.exporter = "Exporter Name is required";
    if (!formData.fumiDate) newErrors.fumiDate = "Fumigation Date is required";
    
    // Date Logic Check
    if (formData.fumiDate && formData.issueDate) {
      if (new Date(formData.issueDate) < new Date(formData.fumiDate)) {
        newErrors.issueDate = "Issue Date cannot be before Fumigation Date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      alert("Certificate Saved Successfully! (Mock Action)");
      // Add save logic here
    } else {
      alert("Please fix the errors before saving.");
    }
  };

  const handleReset = () => {
    if(window.confirm("Are you sure you want to clear the form?")) {
      setFormData(INITIAL_FORM);
      setErrors({});
      setSameAsExporter(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto relative">
      
      {/* --- Top Header --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FileBadge className="text-blue-600" /> New Fumigation Certificate
          </h2>
          <p className="text-slate-500 text-sm mt-1">Create a new treatment record. Fields marked * are mandatory.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleReset} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg flex items-center gap-2 font-medium transition-colors">
            <RotateCcw size={16} /> Reset
          </button>
          <button onClick={() => validate() && setShowPreview(true)} className="px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg flex items-center gap-2 font-medium transition-colors">
            <Eye size={16} /> Preview
          </button>
          <button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-colors">
            <Save size={18} /> Save & Generate
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT COLUMN (Main Data) --- */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card 1: Basic Info */}
          <SectionCard title="1. General Details">
             <div className="grid grid-cols-2 gap-6 mb-4">
                <SelectField 
                  label="Branch Location" 
                  options={BRANCHES} 
                  value={formData.branch}
                  onChange={(val) => handleChange('branch', val)}
                />
                <SelectField 
                  label="Treatment Type" 
                  options={TREATMENTS} 
                  value={formData.treatment}
                  onChange={(val) => handleChange('treatment', val)}
                />
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InputGroup 
                  label="Certificate No *" 
                  placeholder="e.g. 095 A" 
                  value={formData.certNo}
                  onChange={(e) => handleChange('certNo', e.target.value)}
                  error={errors.certNo}
                />
                <InputGroup 
                  label="Fumigation Date *" 
                  type="date"
                  value={formData.fumiDate}
                  onChange={(e) => handleChange('fumiDate', e.target.value)}
                  error={errors.fumiDate}
                />
                <InputGroup 
                  label="Issue Date" 
                  type="date"
                  value={formData.issueDate}
                  onChange={(e) => handleChange('issueDate', e.target.value)}
                  error={errors.issueDate}
                />
             </div>
          </SectionCard>

          {/* Card 2: Client Details */}
          <SectionCard title="2. Client / Parties">
             <div className="mb-4 relative">
                <InputGroup 
                  label="Exporter Name *" 
                  placeholder="Search or Type Exporter Name..." 
                  value={formData.exporter}
                  onChange={(e) => handleChange('exporter', e.target.value)}
                  error={errors.exporter}
                />
             </div>
             
             <div className="relative">
                <div className="flex justify-between items-center mb-1">
                   <label className="text-xs font-medium text-slate-500 uppercase">Billing Party</label>
                   <button 
                    onClick={toggleBilling}
                    className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium"
                   >
                     {sameAsExporter ? <CheckSquare size={14}/> : <Square size={14}/>}
                     Same as Exporter
                   </button>
                </div>
                <input 
                  type="text"
                  value={formData.billingParty}
                  onChange={(e) => handleChange('billingParty', e.target.value)}
                  disabled={sameAsExporter}
                  className={`w-full p-2 border rounded-md text-sm focus:outline-none focus:border-blue-500 ${sameAsExporter ? 'bg-slate-50 text-slate-400' : 'border-slate-300'}`}
                  placeholder="Billing entity name"
                />
             </div>
          </SectionCard>

          {/* Card 3: Cargo Details */}
          <SectionCard title="3. Cargo Details">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InputGroup 
                  label="Container No." 
                  placeholder="e.g. TCKU2766275" 
                  icon={<Truck size={14} className="text-slate-400"/>}
                  value={formData.containerNo}
                  onChange={(e) => handleChange('containerNo', e.target.value)}
                />
                <InputGroup 
                  label="Packages / Pallets" 
                  placeholder="e.g. 500 Bags" 
                  icon={<Box size={14} className="text-slate-400"/>}
                  value={formData.packages}
                  onChange={(e) => handleChange('packages', e.target.value)}
                />
                <InputGroup 
                  label="Volume / Weight" 
                  placeholder="e.g. 40 CBM" 
                  value={formData.volume}
                  onChange={(e) => handleChange('volume', e.target.value)}
                />
             </div>
          </SectionCard>

        </div>

        {/* --- RIGHT COLUMN (Technical & Billing) --- */}
        <div className="space-y-6">
          
          {/* Card 4: Technical Params (Dynamic) */}
          <div className="bg-slate-800 text-white p-6 rounded-xl shadow-md border border-slate-700">
             <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
               <Thermometer size={20} className="text-blue-400"/> Technical Params
             </h3>
             <p className="text-xs text-slate-400 mb-4 uppercase tracking-wider font-semibold">
               {formData.treatment.split('(')[0]}
             </p>
             
             <div className="space-y-4">
                {formData.treatment.includes('MB') && (
                  <>
                    <DarkInput label="Dosage (g/m³)" placeholder="48" suffix="g/m³" value={formData.dosage} onChange={(e) => handleChange('dosage', e.target.value)} />
                    <DarkInput label="Temperature (°C)" placeholder="21" suffix="°C" value={formData.temp} onChange={(e) => handleChange('temp', e.target.value)}/>
                    <DarkInput label="Exposure (Hrs)" placeholder="24" suffix="Hrs" value={formData.exposure} onChange={(e) => handleChange('exposure', e.target.value)}/>
                  </>
                )}
                {formData.treatment.includes('ALP') && (
                  <>
                    <DarkInput label="Dosage (g/MT)" placeholder="9" suffix="g/MT" value={formData.dosage} onChange={(e) => handleChange('dosage', e.target.value)}/>
                    <DarkInput label="Humidity (%)" placeholder="60" suffix="%" value={formData.humidity} onChange={(e) => handleChange('humidity', e.target.value)}/>
                    <DarkInput label="Exposure (Days)" placeholder="7" suffix="Days" value={formData.exposure} onChange={(e) => handleChange('exposure', e.target.value)}/>
                  </>
                )}
             </div>
          </div>

          {/* Card 5: Billing */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <h3 className="font-bold text-slate-800 mb-4">Billing Information</h3>
             <div className="space-y-4">
                <InputGroup 
                  label="Invoice No" 
                  placeholder="Pending..." 
                  value={formData.invoiceNo}
                  onChange={(e) => handleChange('invoiceNo', e.target.value)}
                />
                <InputGroup 
                  label="Total Amount (₹)" 
                  type="number" 
                  placeholder="0.00" 
                  value={formData.amount}
                  onChange={(e) => handleChange('amount', e.target.value)}
                />
                <div className="p-3 bg-blue-50 rounded text-xs text-blue-700 leading-relaxed">
                   <strong>Note:</strong> Invoices are generated automatically after saving.
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* --- PREVIEW MODAL --- */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
              <h3 className="font-bold">Certificate Preview</h3>
              <button onClick={() => setShowPreview(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="p-8 space-y-4 text-sm">
               <div className="flex justify-between border-b pb-4">
                  <div>
                     <p className="text-slate-500 text-xs uppercase">Certificate No</p>
                     <p className="font-mono text-xl font-bold">{formData.certNo || '---'}</p>
                  </div>
                  <div className="text-right">
                     <p className="text-slate-500 text-xs uppercase">Issue Date</p>
                     <p className="font-bold">{formData.issueDate || '---'}</p>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-slate-500 text-xs uppercase mb-1">Exporter</p>
                    <p className="font-medium text-slate-800">{formData.exporter || '---'}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs uppercase mb-1">Consignee/Billing</p>
                    <p className="font-medium text-slate-800">{formData.billingParty || '---'}</p>
                  </div>
               </div>
               <div className="bg-slate-50 p-4 rounded border border-slate-100">
                  <p className="text-slate-500 text-xs uppercase mb-2">Treatment Details</p>
                  <p><strong>Method:</strong> {formData.treatment}</p>
                  <p><strong>Dosage:</strong> {formData.dosage}</p>
                  <p><strong>Duration:</strong> {formData.exposure}</p>
               </div>
            </div>
            <div className="p-4 bg-slate-50 border-t flex justify-end gap-3">
               <button onClick={() => setShowPreview(false)} className="px-4 py-2 border rounded-lg text-slate-600 hover:bg-white">Edit</button>
               <button onClick={() => { setShowPreview(false); handleSubmit(); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Confirm & Save</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// --- Reusable Sub-Components ---

const SectionCard = ({ title, children }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
    <h3 className="font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100">{title}</h3>
    {children}
  </div>
);

const InputGroup = ({ label, type = "text", placeholder, icon, value, onChange, error, disabled }) => (
  <div className="w-full">
    <label className="block text-xs font-medium text-slate-500 mb-1 uppercase flex justify-between">
      {label}
      {error && <span className="text-red-500 normal-case flex items-center gap-1"><AlertCircle size={10}/> {error}</span>}
    </label>
    <div className="relative">
      <input 
        type={type} 
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full p-2.5 ${icon ? 'pl-9' : ''} border ${error ? 'border-red-300 focus:border-red-500' : 'border-slate-300 focus:border-blue-500'} rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-opacity-50 transition-all`}
        placeholder={placeholder}
      />
      {icon && <div className="absolute left-3 top-2.5">{icon}</div>}
    </div>
  </div>
);

const SelectField = ({ label, options, value, onChange }) => (
  <div>
    <label className="block text-xs font-medium text-slate-500 mb-1 uppercase">{label}</label>
    <select 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white"
    >
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

const DarkInput = ({ label, placeholder, suffix, value, onChange }) => (
  <div>
    <label className="block text-xs text-slate-400 mb-1 uppercase">{label}</label>
    <div className="flex bg-slate-900 border border-slate-600 rounded-lg overflow-hidden focus-within:border-blue-400 transition-colors">
      <input 
        type="text" 
        value={value}
        onChange={onChange}
        className="w-full bg-transparent p-2 text-white text-sm focus:outline-none placeholder-slate-600"
        placeholder={placeholder}
      />
      {suffix && <span className="bg-slate-700 text-slate-300 px-3 py-2 text-xs font-medium flex items-center">{suffix}</span>}
    </div>
  </div>
);

export default CertificateForm;