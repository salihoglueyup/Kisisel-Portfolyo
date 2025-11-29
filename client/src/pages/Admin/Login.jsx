// client/src/pages/Admin/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaFingerprint } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Login = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // ŞİFREYİ BURADAN BELİRLE (Örn: 'ybs2025')
        // Gerçek projede bu backend'den kontrol edilir ama bu seviye için yeterli.
        if (password === 'ybs2025') {
            localStorage.setItem('isAdmin', 'true'); // Giriş yapıldı diye işaretle
            navigate('/admin/dashboard'); // Panele yönlendir
        } else {
            setError('Erişim Reddedildi: Hatalı Şifre');
            setPassword('');
        }
    };

    return (
        <div className="min-h-screen bg-[#0B1120] flex items-center justify-center px-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#111827] border border-slate-800 p-8 rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden"
            >
                {/* Arka Plan Efekti */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-purple-600"></div>

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl text-blue-500">
                        <FaLock />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Admin Girişi</h2>
                    <p className="text-gray-500 text-sm mt-2">Yönetim paneline erişmek için kimlik doğrulama gerekli.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="relative">
                        <FaFingerprint className="absolute left-4 top-3.5 text-gray-500" />
                        <input
                            type="password"
                            placeholder="Güvenlik Anahtarı"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[#0B1120] border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:border-blue-500 outline-none transition-all text-center tracking-widest"
                        />
                    </div>

                    {error && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs text-center font-bold bg-red-500/10 p-2 rounded-lg">
                            {error}
                        </motion.div>
                    )}

                    <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-600/20">
                        Sisteme Giriş Yap
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;