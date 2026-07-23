import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppProvider, useAppContext } from './store';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DataSiswa from './pages/DataSiswa';
import DataJenjang from './pages/DataJenjang';
import DataKelas from './pages/DataKelas';
import CetakQR from './pages/CetakQR';
import ScanQR from './pages/ScanQR';
import AbsenManual from './pages/AbsenManual';
import RekapAbsen from './pages/RekapAbsen';
import GuruPiket from './pages/GuruPiket';
import KalenderLibur from './pages/KalenderLibur';
import Pengaturan from './pages/Pengaturan';
import Login from './pages/Login';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAppContext();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="siswa" element={<DataSiswa />} />
              <Route path="jenjang" element={<DataJenjang />} />
              <Route path="kelas" element={<DataKelas />} />
              <Route path="cetak-qr" element={<CetakQR />} />
              <Route path="scan" element={<ScanQR />} />
              <Route path="absen-manual" element={<AbsenManual />} />
              <Route path="rekap" element={<RekapAbsen />} />
              <Route path="guru" element={<GuruPiket />} />
              <Route path="libur" element={<KalenderLibur />} />
              <Route path="pengaturan" element={<Pengaturan />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
