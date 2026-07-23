import React, { useState } from 'react';
import { useAppContext } from '../store';
import { ClassRoom } from '../types';
import { Plus, Trash2 } from 'lucide-react';

export default function DataKelas() {
  const { classes, setClasses, levels } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', levelId: '' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.levelId) return;
    
    const newClass: ClassRoom = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      levelId: formData.levelId
    };
    
    setClasses([...classes, newClass]);
    setIsModalOpen(false);
    setFormData({ name: '', levelId: '' });
  };

  const handleDelete = (id: string) => {
    setClasses(classes.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Data Kelas</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center justify-center"
        >
          <Plus size={18} className="mr-2" /> Tambah Kelas
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jenjang</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Kelas</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {classes.length === 0 ? (
              <tr><td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">Belum ada data kelas</td></tr>
            ) : classes.map(cls => (
              <tr key={cls.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {levels.find(l => l.id === cls.levelId)?.name || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cls.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleDelete(cls.id)} className="text-red-600 hover:text-red-900">
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
            <h3 className="text-lg font-bold mb-4">Tambah Kelas</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jenjang</label>
                <select 
                  required 
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={formData.levelId} 
                  onChange={e => setFormData({...formData, levelId: e.target.value})}
                >
                  <option value="">Pilih Jenjang...</option>
                  {levels.map(l => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kelas (contoh: 7A, 10 IPA 1)</label>
                <input required type="text" className="w-full border border-gray-300 rounded-md p-2" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
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
