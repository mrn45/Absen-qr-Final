import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../store';
import { ScanLine, LogIn, User, Shield, Lock } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login() {
  const [error, setError] = useState('');
  const [loginType, setLoginType] = useState<'admin' | 'piket'>('admin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const { handleGoogleLogin, handlePiketLogin, isAuthenticated, isSyncing } = useAppContext();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onGoogleLogin = async () => {
    try {
      setError('');
      await handleGoogleLogin();
    } catch (err: any) {
      console.error(err);
      setError(`Gagal login: ${err.message || 'Error tidak diketahui'}`);
    }
  };

  const onPiketLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Masukkan username dan password');
      return;
    }
    const success = await handlePiketLogin(username, password);
    if (!success) {
      setError('Username atau password salah.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-amber-200/40 rounded-full mix-blend-multiply filter blur-[100px] opacity-70"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-200/30 rounded-full mix-blend-multiply filter blur-[100px] opacity-70"></div>
      <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-yellow-100/50 rounded-full mix-blend-multiply filter blur-[80px]"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md bg-white/70 backdrop-blur-2xl border border-white p-10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.05)] relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center mb-6 shadow-lg shadow-amber-500/20"
          >
            <ScanLine className="text-white w-8 h-8" strokeWidth={2} />
          </motion.div>
          
          <h1 className="text-4xl font-light text-slate-800 tracking-[0.2em] mb-3 font-serif">AbsenQR</h1>
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-amber-300 to-transparent mb-4"></div>
          <p className="text-slate-500 text-xs tracking-[0.3em] uppercase text-center font-medium">Sistem Absensi Digital</p>
        </div>

        <div className="flex bg-slate-200/50 p-1 rounded-xl mb-8">
          <button
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all flex justify-center items-center gap-2 ${loginType === 'admin' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => { setLoginType('admin'); setError(''); }}
          >
            <Shield className="w-4 h-4" /> Admin
          </button>
          <button
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all flex justify-center items-center gap-2 ${loginType === 'piket' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => { setLoginType('piket'); setError(''); }}
          >
            <User className="w-4 h-4" /> Guru Piket
          </button>
        </div>

        <div className="space-y-6">
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl text-sm text-center tracking-wide font-light"
            >
              {error}
            </motion.div>
          )}

          {loginType === 'admin' ? (
            <div className="space-y-4">
              <p className="text-sm text-slate-500 text-center mb-4">Login sebagai Admin dengan Google untuk mengelola data master.</p>
              <button 
                onClick={onGoogleLogin}
                disabled={isSyncing}
                className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-4 rounded-xl transition-all shadow-sm flex items-center justify-center space-x-3 text-sm mt-4 disabled:opacity-50"
              >
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  <path fill="none" d="M0 0h48v48H0z"></path>
                </svg>
                <span>Masuk dengan Google</span>
              </button>
            </div>
          ) : (
            <form onSubmit={onPiketLogin} className="space-y-4">
              <p className="text-sm text-slate-500 text-center mb-4">Login sebagai Guru Piket menggunakan Username dan Password.</p>
              <div className="space-y-3">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" strokeWidth={1.5} />
                  </div>
                  <input 
                    type="text" 
                    required
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-light tracking-wide focus:bg-white"
                    placeholder="Username"
                  />
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" strokeWidth={1.5} />
                  </div>
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-light tracking-wide focus:bg-white"
                    placeholder="Password"
                  />
                </div>
              </div>
              <button 
                type="submit"
                disabled={isSyncing}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-white font-semibold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:shadow-amber-500/20 flex items-center justify-center space-x-3 uppercase tracking-widest text-sm disabled:opacity-50"
              >
                <span>Masuk Akun Piket</span>
                <LogIn className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </form>
          )}
        </div>
        
        {isSyncing && (
          <div className="mt-4 text-center">
            <p className="text-xs text-slate-500 animate-pulse">Menghubungkan ke Server...</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
