import React from 'react';
import { Save, Server, ShieldAlert } from 'lucide-react';

const SystemSettings = () => {
  return (
    <div className="max-w-2xl space-y-6">
       <div>
          <h2 className="text-xl font-bold text-slate-800">System Settings</h2>
          <p className="text-sm text-slate-500">Configure core application parameters.</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-6">
           <div>
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                 <Server size={18} className="text-indigo-500"/> General Config
              </h3>
              <div className="grid gap-4">
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Application Name</label>
                    <input type="text" defaultValue="FumiManager v1.0" className="w-full p-2 border rounded text-sm"/>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Support Email</label>
                    <input type="text" defaultValue="support@dpcs.com" className="w-full p-2 border rounded text-sm"/>
                 </div>
              </div>
           </div>

           <div className="pt-6 border-t">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                 <ShieldAlert size={18} className="text-red-500"/> Danger Zone
              </h3>
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-100">
                 <div>
                    <p className="text-sm font-bold text-red-700">Maintenance Mode</p>
                    <p className="text-xs text-red-500">Disable access for all non-admin users.</p>
                 </div>
                 <button className="bg-white border border-red-300 text-red-600 px-3 py-1 rounded text-sm hover:bg-red-50">Enable</button>
              </div>
           </div>

           <div className="pt-4 flex justify-end">
              <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700">
                 <Save size={18} /> Save Changes
              </button>
           </div>
        </div>
    </div>
  );
};

export default SystemSettings;