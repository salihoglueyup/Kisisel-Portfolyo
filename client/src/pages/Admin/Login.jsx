import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaFingerprint, FaEnvelope, FaUserPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '../../api';

const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır")
});

const registerSchema = z.object({
  displayName: z.string().min(2, "İsim en az 2 karakter olmalı"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  password: z.string().min(8, "Şifre en az 8 karakter, büyük/küçük harf ve sayı içermeli")
});

const Login = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(isRegisterMode ? registerSchema : loginSchema),
        defaultValues: {
            email: '',
            password: '',
            displayName: ''
        }
    });

    const onSubmit = async (data) => {
        setError('');
        setLoading(true);

        try {
            if (isRegisterMode) {
                const res = await api.post('/auth/register', {
                    email: data.email,
                    password: data.password,
                    displayName: data.displayName || 'Admin'
                });
                localStorage.setItem('adminToken', res.data.data.accessToken);
                localStorage.setItem('refreshToken', res.data.data.refreshToken);
                navigate('/admin/dashboard');
            } else {
                const res = await api.post('/auth/login', {
                    email: data.email,
                    password: data.password
                });
                localStorage.setItem('adminToken', res.data.data.accessToken);
                localStorage.setItem('refreshToken', res.data.data.refreshToken);
                navigate('/admin/dashboard');
            }
        } catch (err) {
            const message = err.response?.data?.message
                || err.response?.data?.errors?.map(e => e.message).join(', ')
                || 'İşlem başarısız.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0B1120] flex items-center justify-center px-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#111827] border border-slate-800 p-8 rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden"
            >
                {/* Üst gradient çizgi */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-purple-600"></div>

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl text-blue-500">
                        <FaLock />
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                        {isRegisterMode ? 'Hesap Oluştur' : 'Admin Girişi'}
                    </h2>
                    <p className="text-gray-500 text-sm mt-2">
                        {isRegisterMode
                            ? 'Yönetim paneli için yeni hesap oluşturun.'
                            : 'Yönetim paneline erişmek için giriş yapın.'}
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                    {/* Kayıt modunda isim alanı */}
                    {isRegisterMode && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="relative"
                        >
                            <FaUserPlus className="absolute left-4 top-3.5 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Görüntülenen İsim"
                                {...register('displayName')}
                                className="w-full bg-[#0B1120] border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:border-blue-500 outline-none transition-all"
                            />
                            {errors.displayName && <p className="text-red-400 text-xs mt-1">{errors.displayName.message}</p>}
                        </motion.div>
                    )}

                    {/* Email */}
                    <div>
                        <div className="relative">
                            <FaEnvelope className="absolute left-4 top-3.5 text-gray-500" />
                            <input
                                type="email"
                                placeholder="Email Adresi"
                                {...register('email')}
                                className="w-full bg-[#0B1120] border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    {/* Şifre */}
                    <div>
                        <div className="relative">
                            <FaFingerprint className="absolute left-4 top-3.5 text-gray-500" />
                            <input
                                type="password"
                                placeholder={isRegisterMode ? 'Şifre (min 8 karakter, büyük/küçük harf + rakam)' : 'Şifre'}
                                {...register('password')}
                                className="w-full bg-[#0B1120] border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                        {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
                    </div>

                    {/* Hata mesajı */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-red-500 text-xs text-center font-bold bg-red-500/10 p-3 rounded-lg border border-red-500/20"
                        >
                            {error}
                        </motion.div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : isRegisterMode ? (
                            'Hesap Oluştur'
                        ) : (
                            'Sisteme Giriş Yap'
                        )}
                    </button>
                </form>

                {/* Login/Register geçişi */}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => { setIsRegisterMode(!isRegisterMode); setError(''); }}
                        className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
                    >
                        {isRegisterMode
                            ? 'Zaten hesabın var mı? Giriş Yap'
                            : 'Henüz hesabın yok mu? Kayıt Ol'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;