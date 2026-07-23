import React, { useState } from 'react';
import { useAppContext } from '../store';
import { Save } from 'lucide-react';

export default function Pengaturan() {
  const { settings, setSettings } = useAppContext();
  const [formData, setFormData] = useState(settings);
  const [message, setMessage] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSettings(formData);
    setMessage('Pengaturan berhasil disimpan!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-800">Pengaturan Waktu</h2>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Batas Jam Masuk KBM</label>
              <input 
                type="time" 
                className="w-full border border-gray-300 rounded-md p-2" 
                value={formData.entryTime} 
                onChange={e => setFormData({...formData, entryTime: e.target.value})} 
              />
              <p className="mt-1 text-xs text-gray-500">Siswa yang absen setelah jam ini akan ditandai terlambat.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Batas Jam Pulang KBM</label>
              <input 
                type="time" 
                className="w-full border border-gray-300 rounded-md p-2" 
                value={formData.exitTime} 
                onChange={e => setFormData({...formData, exitTime: e.target.value})} 
              />
              <p className="mt-1 text-xs text-gray-500">Jam minimal siswa diperbolehkan absen pulang.</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium flex items-center transition-colors"
            >
              <Save size={18} className="mr-2" /> Simpan Pengaturan
            </button>
            {message && <span className="text-green-600 font-medium text-sm">{message}</span>}
          </div>
        </form>
      </div>
    </div>
  );
}
