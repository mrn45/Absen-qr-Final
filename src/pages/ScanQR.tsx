import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../store';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { AttendanceType, AttendanceRecord } from '../types';
import { format } from 'date-fns';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function ScanQR() {
  const { students, attendance, setAttendance, settings } = useAppContext();
  const [scanType, setScanType] = useState<AttendanceType>('KBM_MASUK');
  const [lastScan, setLastScan] = useState<{ success: boolean; message: string; name?: string } | null>(null);
  
  const attendanceRef = useRef(attendance);
  const isScanningRef = useRef(false);
  const scanTypeRef = useRef(scanType);
  const studentsRef = useRef(students);
  const settingsRef = useRef(settings);

  useEffect(() => {
    attendanceRef.current = attendance;
    scanTypeRef.current = scanType;
    studentsRef.current = students;
    settingsRef.current = settings;
  }, [attendance, scanType, students, settings]);

  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;
    
    // Slight delay to allow DOM to render before mounting scanner
    const timer = setTimeout(() => {
      scanner = new Html5QrcodeScanner("reader", { 
        fps: 10,
        qrbox: (viewfinderWidth, viewfinderHeight) => {
          const size = Math.floor(Math.min(viewfinderWidth, viewfinderHeight) * 0.8);
          return { width: size, height: size };
        }
      }, false);
      
      scanner.render((decodedText) => {
        handleScan(decodedText);
      }, (error) => {
        // ignore errors silently as it triggers constantly when no QR is found
      });
    }, 500);

    return () => {
      clearTimeout(timer);
      if (scanner) {
        scanner.clear().catch(console.error);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  const handleScan = (studentId: string) => {
    if (isScanningRef.current) return;
    isScanningRef.current = true;

    const currentStudents = studentsRef.current;
    const currentScanType = scanTypeRef.current;
    const currentSettings = settingsRef.current;

    const student = currentStudents.find(s => s.id === studentId);
    if (!student) {
      setLastScan({ success: false, message: 'QR tidak dikenali!' });
      setTimeout(() => {
        setLastScan(null);
        isScanningRef.current = false;
      }, 3000);
      return;
    }

    const today = format(new Date(), 'yyyy-MM-dd');
    const currentTime = format(new Date(), 'HH:mm');

    const existing = attendanceRef.current.find(a => a.studentId === student.id && a.date === today && a.type === currentScanType);
    if (existing) {
      setLastScan({ success: false, message: 'Absen Ditolak!', name: student.name });
      setTimeout(() => {
        setLastScan(null);
        isScanningRef.current = false;
      }, 3000);
      return;
    }

    let status: 'HADIR' | 'TERLAMBAT' = 'HADIR';
    let message = 'Absen Berhasil';

    if (currentScanType === 'KBM_MASUK') {
      if (currentTime > currentSettings.entryTime) {
        status = 'TERLAMBAT';
        message = 'Absen Berhasil (Terlambat)';
      }
    } else if (currentScanType === 'KBM_PULANG') {
      if (currentTime < currentSettings.exitTime) {
        setLastScan({ success: false, message: 'Belum waktunya pulang!', name: student.name });
        setTimeout(() => {
          setLastScan(null);
          isScanningRef.current = false;
        }, 3000);
        return;
      }
    }

    const newRecord: AttendanceRecord = {
      id: Math.random().toString(36).substr(2, 9),
      studentId: student.id,
      date: today,
      type: currentScanType,
      status: status,
      timestamp: Date.now()
    };

    setAttendance(prev => [...prev, newRecord]);
    setLastScan({ success: true, message, name: student.name });
    
    setTimeout(() => {
      setLastScan(null);
      isScanningRef.current = false;
    }, 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Scan QR Absensi</h2>
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {(['KBM_MASUK', 'KBM_PULANG', 'SHOLAT_DHUHA', 'SHOLAT_DZUHUR'] as AttendanceType[]).map(type => (
            <button
              key={type}
              onClick={() => setScanType(type)}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                scanType === type 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {type.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div id="reader" className="w-full overflow-hidden rounded-lg"></div>
      </div>

      {lastScan && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className={`bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 transform transition-all animate-in zoom-in-95 duration-200 flex flex-col items-center text-center ${lastScan.success ? 'border-t-4 border-green-500' : 'border-t-4 border-red-500'}`}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${lastScan.success ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              {lastScan.success ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
            </div>
            
            <h3 className={`text-xl font-bold mb-1 ${lastScan.success ? 'text-gray-900' : 'text-red-600'}`}>
              {lastScan.message}
            </h3>
            
            {lastScan.name && (
              <p className="text-gray-600 font-medium text-lg mt-2">
                {lastScan.name}
              </p>
            )}
            
            {lastScan.success ? (
              lastScan.name && (
                <p className="text-sm text-gray-500 mt-1">
                  Telah berhasil melakukan absensi {scanType.replace('_', ' ')}.
                </p>
              )
            ) : (
              lastScan.name && (
                <p className="text-sm text-red-500 mt-1">
                  Siswa sudah melakukan absensi {scanType.replace('_', ' ')} hari ini.
                </p>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
