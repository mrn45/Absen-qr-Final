import React, { useState } from 'react';
import { useAppContext } from '../store';
import { AttendanceType, AttendanceStatus, AttendanceRecord } from '../types';
import { format } from 'date-fns';
import { Save, Filter } from 'lucide-react';

export default function AbsenManual() {
  const { students, attendance, setAttendance, levels, classes } = useAppContext();
  const [scanType, setScanType] = useState<AttendanceType>('KBM_MASUK');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('');

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    const existingIndex = attendance.findIndex(a => a.studentId === studentId && a.date === date && a.type === scanType);
    
    if (existingIndex >= 0) {
      const newAttendance = [...attendance];
      newAttendance[existingIndex].status = status;
      setAttendance(newAttendance);
    } else {
      const newRecord: AttendanceRecord = {
        id: Math.random().toString(36).substr(2, 9),
        studentId,
        date,
        type: scanType,
        status,
        timestamp: Date.now()
      };
      setAttendance([...attendance, newRecord]);
    }
  };

  const filteredStudents = students.filter(student => {
    const hasRecord = attendance.some(a => a.studentId === student.id && a.date === date && a.type === scanType);
    if (hasRecord) return false;

    if (selectedLevel && student.levelId !== selectedLevel) return false;
    if (selectedClass && student.className !== selectedClass) return false;

    return true;
  });

  const availableClasses = selectedLevel 
    ? classes.filter(c => c.levelId === selectedLevel)
    : classes;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Absensi Manual</h2>
        <div className="flex flex-wrap gap-3">
          <input 
            type="date" 
            value={date} 
            onChange={e => setDate(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
          />
          <select 
            value={scanType} 
            onChange={e => setScanType(e.target.value as AttendanceType)}
            className="border border-gray-300 rounded-md p-2"
          >
            <option value="KBM_MASUK">KBM Masuk</option>
            <option value="KBM_PULANG">KBM Pulang</option>
            <option value="SHOLAT_DHUHA">Sholat Dhuha</option>
            <option value="SHOLAT_DZUHUR">Sholat Dzuhur</option>
          </select>
          <select 
            value={selectedLevel} 
            onChange={e => {
              setSelectedLevel(e.target.value);
              setSelectedClass('');
            }}
            className="border border-gray-300 rounded-md p-2"
          >
            <option value="">Semua Jenjang</option>
            {levels.map(level => (
              <option key={level.id} value={level.id}>{level.name}</option>
            ))}
          </select>
          <select 
            value={selectedClass} 
            onChange={e => setSelectedClass(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
          >
            <option value="">Semua Kelas</option>
            {availableClasses.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">NIS</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Siswa</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kelas</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">Semua siswa sudah diabsen atau tidak ada data</td></tr>
            ) : filteredStudents.map(student => {
              return (
                <tr key={student.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.nis}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.className}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      {(['HADIR', 'TERLAMBAT', 'SAKIT', 'IZIN', 'ALPA'] as AttendanceStatus[]).map(s => (
                        <button
                          key={s}
                          onClick={() => handleStatusChange(student.id, s)}
                          className="px-3 py-1 text-xs rounded-full font-medium transition-colors bg-gray-100 text-gray-500 hover:bg-gray-200"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
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
