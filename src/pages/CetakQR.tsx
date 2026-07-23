import React, { useRef, useState } from 'react';
import { useAppContext } from '../store';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, AlertCircle } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';

export default function CetakQR() {
  const { students } = useAppContext();
  const [showIframeWarning, setShowIframeWarning] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
    documentTitle: 'Cetak_QR_Siswa',
    onPrintError: () => {
      setShowIframeWarning(true);
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 print:hidden">
        <h2 className="text-2xl font-bold text-gray-800">Cetak QR Code</h2>
        <button 
          onClick={() => handlePrint()}
          className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-md font-medium flex items-center justify-center"
        >
          <Printer size={18} className="mr-2" /> Cetak Semua
        </button>
      </div>

      {showIframeWarning && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg flex items-start print:hidden">
          <AlertCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
          <p className="text-sm">
            <strong>Catatan:</strong> Pencetakan gagal. Jika Anda berada di mode pratinjau, fitur ini mungkin diblokir oleh browser. 
            Silakan buka aplikasi di <strong>tab baru (Open in new tab)</strong> menggunakan ikon di pojok kanan atas layar Anda untuk menggunakan fitur cetak.
          </p>
        </div>
      )}

      {students.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200 print:hidden">
          <p className="text-gray-500">Belum ada data siswa. Tambahkan siswa terlebih dahulu.</p>
        </div>
      ) : (
        <div ref={contentRef} className="p-4 bg-white print:p-8 print:m-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 print:grid-cols-4 print:gap-4 print:w-full">
            {students.map(student => (
              <div key={student.id} className="border border-gray-200 p-4 rounded-lg shadow-sm flex flex-col items-center text-center">
                <QRCodeSVG value={student.id} size={120} level="H" includeMargin />
                <div className="mt-3">
                  <p className="font-bold text-gray-900 text-sm">{student.name}</p>
                  <p className="text-xs text-gray-500">{student.nis} - Kelas {student.className}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
