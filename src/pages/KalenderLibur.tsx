import React, { useState } from 'react';
import { useAppContext } from '../store';
import { Holiday } from '../types';
import { format, parseISO } from 'date-fns';
import { Plus, Trash2 } from 'lucide-react';

export default function KalenderLibur() {
  const { holidays, setHolidays } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ date: '', description: '' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date || !formData.description) return;
    
    const newHoliday: Holiday = {
      id: Math.random().toString(36).substr(2, 9),
      date: formData.date,
      description: formData.description
    };
    
    setHolidays([...holidays, newHoliday].sort((a, b) => a.date.localeCompare(b.date)));
    setIsModalOpen(false);
    setFormData({ date: '', description: '' });
  };

  const handleDelete = (id: string) => {
    setHolidays(holidays.filter(h => h.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Kalender Libur</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center justify-center"
        >
          <Plus size={18} className="mr-2" /> Tambah Hari Libur
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal Libur</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Keterangan</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {holidays.length === 0 ? (
              <tr><td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">Belum ada data hari libur</td></tr>
            ) : holidays.map(holiday => (
              <tr key={holiday.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{format(parseISO(holiday.date), 'dd MMMM yyyy')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{holiday.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleDelete(holiday.id)} className="text-red-600 hover:text-red-900">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-bold mb-4">Tambah Hari Libur</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Libur</label>
                <input required type="date" className="w-full border border-gray-300 rounded-md p-2" 
                  value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan / Nama Libur</label>
                <input required type="text" className="w-full border border-gray-300 rounded-md p-2" 
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">Batal</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
