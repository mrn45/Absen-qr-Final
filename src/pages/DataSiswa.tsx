import React, { useState } from 'react';
import { useAppContext } from '../store';
import { Student } from '../types';
import Papa from 'papaparse';
import { Plus, Upload, Trash2, Download } from 'lucide-react';

export default function DataSiswa() {
  const { students, setStudents, levels, classes } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Student>>({});

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.nis || !formData.levelId || !formData.className) return;
    
    const newStudent: Student = {
      id: Math.random().toString(36).substr(2, 9),
      nis: formData.nis,
      name: formData.name,
      levelId: formData.levelId,
      className: formData.className,
    };
    
    setStudents([...students, newStudent]);
    setIsModalOpen(false);
    setFormData({});
  };

  const handleDelete = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
  };

  const handleDownloadTemplate = () => {
    const csvContent = "nis,name,jenjang,kelas\n12345,John Doe,SD,1A\n67890,Jane Doe,SMP,7A";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'template_siswa.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          const imported = (results.data as any[])
            .filter(row => row.nis && row.name)
            .map(row => ({
              id: Math.random().toString(36).substr(2, 9),
              nis: row.nis,
              name: row.name,
              levelId: levels.find(l => l.name === row.jenjang)?.id || '',
              className: row.kelas || ''
            }));
          setStudents([...students, ...imported]);
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Data Siswa</h2>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={handleDownloadTemplate}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium flex items-center border border-gray-300 flex-1 justify-center sm:flex-none"
          >
            <Download size={18} className="mr-2" /> <span className="hidden sm:inline">Download</span> Template
          </button>
          <label className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium cursor-pointer flex items-center flex-1 justify-center sm:flex-none">
            <Upload size={18} className="mr-2" /> Import <span className="hidden sm:inline ml-1">CSV</span>
            <input type="file" accept=".csv" className="hidden" onChange={handleImport} />
          </label>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center flex-1 justify-center sm:flex-none"
          >
            <Plus size={18} className="mr-2" /> Tambah <span className="hidden sm:inline ml-1">Siswa</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">NIS</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jenjang</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kelas</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">Belum ada data</td></tr>
            ) : students.map(student => (
              <tr key={student.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.nis}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{levels.find(l => l.id === student.levelId)?.name || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.className}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleDelete(student.id)} className="text-red-600 hover:text-red-900">
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
            <h3 className="text-lg font-bold mb-4">Tambah Siswa Baru</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NIS</label>
                <input required type="text" className="w-full border border-gray-300 rounded-md p-2" 
                  value={formData.nis || ''} onChange={e => setFormData({...formData, nis: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                <input required type="text" className="w-full border border-gray-300 rounded-md p-2" 
                  value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jenjang</label>
                <select required className="w-full border border-gray-300 rounded-md p-2"
                  value={formData.levelId || ''} 
                  onChange={e => setFormData({...formData, levelId: e.target.value, className: ''})}>
                  <option value="">Pilih Jenjang...</option>
                  {levels.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
                <select 
                  required 
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={formData.className || ''} 
                  onChange={e => setFormData({...formData, className: e.target.value})}
                  disabled={!formData.levelId}
                >
                  <option value="">Pilih Kelas...</option>
                  {classes.filter(c => c.levelId === formData.levelId).map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
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
