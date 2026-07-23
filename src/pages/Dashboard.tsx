import React from 'react';
import { useAppContext } from '../store';
import { Users, FileSpreadsheet, Layers, CalendarDays, LayoutList } from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard() {
  const { students, levels, classes, attendance, holidays } = useAppContext();
  
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayAttendance = attendance.filter(a => a.date === today);
  
  const levelStats = levels.map(level => {
    const levelStudents = students.filter(s => s.levelId === level.id);
    const totalStudents = levelStudents.length;
    const attendedStudents = levelStudents.filter(student => 
      todayAttendance.some(a => a.studentId === student.id)
    ).length;
    const notAttendedStudents = totalStudents - attendedStudents;
    
    return {
      id: level.id,
      name: level.name,
      total: totalStudents,
      attended: attendedStudents,
      notAttended: notAttendedStudents
    };
  });
  
  const cards = [
    { title: 'Total Siswa', value: students.length, icon: <Users className="text-blue-500" size={24} /> },
    { title: 'Total Jenjang', value: levels.length, icon: <Layers className="text-purple-500" size={24} /> },
    { title: 'Total Kelas', value: classes.length, icon: <LayoutList className="text-orange-500" size={24} /> },
    { title: 'Absen Hari Ini', value: new Set(todayAttendance.map(a => a.studentId)).size, icon: <FileSpreadsheet className="text-green-500" size={24} /> },
    { title: 'Hari Libur', value: holidays.length, icon: <CalendarDays className="text-red-500" size={24} /> },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-gray-50 rounded-full">
              {card.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{card.title}</p>
              <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {levels.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Statistik Kehadiran per Jenjang Hari Ini</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {levelStats.map(stat => (
              <div key={stat.id} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                  <h4 className="font-bold text-gray-800 flex items-center">
                    <Layers className="text-blue-500 mr-2" size={18} />
                    Jenjang {stat.name}
                  </h4>
                  <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full">{stat.total} Siswa</span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Sudah Absen</span>
                    <span className="font-semibold text-green-600">{stat.attended}</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${stat.total > 0 ? (stat.attended / stat.total) * 100 : 0}%` }}></div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm text-gray-600">Belum Absen</span>
                    <span className="font-semibold text-red-500">{stat.notAttended}</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: `${stat.total > 0 ? (stat.notAttended / stat.total) * 100 : 0}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
