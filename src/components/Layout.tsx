import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Layers, LayoutList, QrCode, ScanLine, FileEdit, FileSpreadsheet, UserCog, CalendarDays, Settings, LogOut, Menu, X } from 'lucide-react';
import { useAppContext } from '../store';
import { logout } from '../lib/firebase';

export default function Layout() {
  const { setIsAuthenticated, setRole, role } = useAppContext();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setIsAuthenticated(false);
    setRole(null);
    navigate('/login');
  };

  const closeSidebar = () => {
    if (isSidebarOpen) setIsSidebarOpen(false);
  };

  const allMenus = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} />, roles: ['admin', 'piket'] },
    { name: 'Data Siswa', path: '/siswa', icon: <Users size={20} />, roles: ['admin'] },
    { name: 'Data Jenjang', path: '/jenjang', icon: <Layers size={20} />, roles: ['admin'] },
    { name: 'Data Kelas', path: '/kelas', icon: <LayoutList size={20} />, roles: ['admin'] },
    { name: 'Cetak QR', path: '/cetak-qr', icon: <QrCode size={20} />, roles: ['admin'] },
    { name: 'Scan QR', path: '/scan', icon: <ScanLine size={20} />, roles: ['admin', 'piket'] },
    { name: 'Absen Manual', path: '/absen-manual', icon: <FileEdit size={20} />, roles: ['admin', 'piket'] },
    { name: 'Rekap Absen', path: '/rekap', icon: <FileSpreadsheet size={20} />, roles: ['admin', 'piket'] },
    { name: 'Guru Piket', path: '/guru', icon: <UserCog size={20} />, roles: ['admin'] },
    { name: 'Kalender Libur', path: '/libur', icon: <CalendarDays size={20} />, roles: ['admin'] },
    { name: 'Pengaturan', path: '/pengaturan', icon: <Settings size={20} />, roles: ['admin'] },
  ];

  const menus = allMenus.filter(m => role && m.roles.includes(role));

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden print:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm z-30 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 print:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <div className="flex items-center">
            <ScanLine className="text-blue-600 mr-2" size={24} />
            <h1 className="text-xl font-bold text-gray-800">AbsenQR</h1>
          </div>
          <button onClick={closeSidebar} className="md:hidden text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {menus.map((menu) => (
              <li key={menu.path}>
                <NavLink
                  to={menu.path}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2.5 rounded-md transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`
                  }
                >
                  <span className="mr-3">{menu.icon}</span>
                  {menu.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2.5 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors"
          >
            <LogOut size={20} className="mr-3" />
            <span className="font-medium">Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 shadow-sm print:hidden md:hidden">
          <div className="flex items-center">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="mr-3 text-gray-600 hover:text-gray-900"
            >
              <Menu size={24} />
            </button>
            <ScanLine className="text-blue-600 mr-2" size={24} />
            <h1 className="text-xl font-bold text-gray-800">AbsenQR</h1>
          </div>
          <button onClick={handleLogout} className="text-red-600 p-2 hover:bg-red-50 rounded-full">
            <LogOut size={20} />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50 print:p-0 print:bg-white w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
