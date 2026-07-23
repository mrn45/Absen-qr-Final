import React, { useState, useMemo } from 'react';
import { useAppContext } from '../store';
import { AttendanceType } from '../types';
import { format, parseISO, subDays, subMonths } from 'date-fns';
import { Download } from 'lucide-react';
import Papa from 'papaparse';

export default function RekapAbsen() {
  const { students, attendance, levels, classes } = useAppContext();
  
  const [filterTime, setFilterTime] = useState('1_bulan');
  const [filterType, setFilterType] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [filterClass, setFilterClass] = useState('');

  const filteredAttendance = useMemo(() => {
    const now = new Date();
    let startTime = 0;
    
    if (filterTime === '1_minggu') {
      startTime = subDays(now, 7).getTime();
    } else if (filterTime === '1_bulan') {
      startTime = subMonths(now, 1).getTime();
    } else if (filterTime === '3_bulan') {
      startTime = subMonths(now, 3).getTime();
    }

    return attendance.filter(record => {
      if (startTime > 0 && record.timestamp < startTime) return false;
      
      if (filterType) {
        if (filterType === 'KBM') {
          if (record.type !== 'KBM_MASUK' && record.type !== 'KBM_PULANG') return false;
        } else {
          if (record.type !== filterType) return false;
        }
      }
      
      const student = students.find(s => s.id === record.studentId);
      if (!student) return false;
      
      const matchLevel = filterLevel ? student.levelId === filterLevel : true;
      const matchClass = filterClass ? student.className === filterClass : true;
      
      return matchLevel && matchClass;
    }).sort((a, b) => b.timestamp - a.timestamp);
  }, [attendance, students, filterTime, filterLevel, filterClass, filterType]);

  const filteredClasses = useMemo(() => {
    if (filterLevel) {
      return classes.filter(c => c.levelId === filterLevel);
    }
    return classes;
  }, [classes, filterLevel]);

  const handleExport = () => {
    const dataToExport = filteredAttendance.map(record => {
      const student = students.find(s => s.id === record.studentId);
      const level = student ? levels.find(l => l.id === student.levelId) : null;
      return {
        'Tanggal': format(parseISO(record.date), 'dd MMM yyyy'),
        'Waktu': format(new Date(record.timestamp), 'HH:mm:ss'),
        'Nama Siswa': student?.name || '-',
        'NIS': student?.nis || '-',
        'Jenjang': level?.name || '-',
        'Kelas': student?.className || '-',
        'Jenis Absen': record.type.replace('_', ' '),
        'Status': record.status
      };
    });

    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Rekap_Absen.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Rekap Absensi</h2>
        <button 
          onClick={handleExport}
          disabled={filteredAttendance.length === 0}
          className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-md font-medium flex items-center justify-center"
        >
          <Download size={18} className="mr-2" /> Export Excel / CSV
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-wrap gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Rentang Waktu</label>
          <select value={filterTime} onChange={e => setFilterTime(e.target.value)} className="border border-gray-300 rounded-md p-2 text-sm min-w-[150px]">
            <option value="1_minggu">1 Minggu Terakhir</option>
            <option value="1_bulan">1 Bulan Terakhir</option>
            <option value="3_bulan">3 Bulan Terakhir</option>
            <option value="semua">Semua Waktu</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Jenis Absen</label>
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="border border-gray-300 rounded-md p-2 text-sm min-w-[150px]">
            <option value="">Semua Jenis</option>
            <option value="KBM">KBM (Masuk & Pulang)</option>
            <option value="SHOLAT_DHUHA">Sholat Dhuha</option>
            <option value="SHOLAT_DZUHUR">Sholat Dzuhur</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Jenjang</label>
          <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)} className="border border-gray-300 rounded-md p-2 text-sm min-w-[150px]">
            <option value="">Semua Jenjang</option>
            {levels.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Kelas</label>
          <select value={filterClass} onChange={e => setFilterClass(e.target.value)} className="border border-gray-300 rounded-md p-2 text-sm min-w-[150px]">
            <option value="">Semua Kelas</option>
            {filteredClasses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal & Waktu</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Siswa</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kelas</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jenis Absen</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAttendance.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">Data absen tidak ditemukan untuk filter ini</td></tr>
            ) : filteredAttendance.map(record => {
              const student = students.find(s => s.id === record.studentId);
              return (
                <tr key={record.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(parseISO(record.date), 'dd MMM yyyy')} <br/>
                    <span className="text-xs text-gray-500">{format(new Date(record.timestamp), 'HH:mm:ss')}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student?.name || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student?.className || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.type.replace('_', ' ')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      record.status === 'HADIR' ? 'bg-green-100 text-green-800' 
                        : record.status === 'TERLAMBAT' ? 'bg-orange-100 text-orange-800'
                        : record.status === 'SAKIT' ? 'bg-yellow-100 text-yellow-800'
                        : record.status === 'IZIN' ? 'bg-blue-100 text-blue-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
