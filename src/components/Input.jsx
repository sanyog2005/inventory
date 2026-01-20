import React from 'react';

const Input = ({ label, type = "text", placeholder, value, onChange }) => (
  <div>
    <label className="block text-xs font-medium text-slate-500 mb-1 uppercase">{label}</label>
    <input 
      type={type} 
      value={value}
      onChange={onChange}
      className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:border-blue-500 text-sm"
      placeholder={placeholder}
    />
  </div>
);

export default Input;