import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FaLock, FaShieldAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import api from '../../api';

const schema = z.object({
    password: z.string()
        .min(8, 'Şifre en az 8 karakter olmalıdır')
        .regex(/[A-Z]/, 'En az bir büyük harf')
        .regex(/[a-z]/, 'En az bir küçük harf')
        .regex(/[0-9]/, 'En az bir rakam'),
    confirm: z.string()
}).refine((d) => d.password === d.confirm, {
    message: 'Şifreler eşleşmiyor',
    path: ['confirm']
});

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { password: '', confirm: '' }
    });

    const onSubmit = async (data) => {
        setError('');
        setLoading(true);
        try {
            await api.post(`/auth/reset-password/${token}`, { password: data.password });
            toast.success('Şifre sıfırlandı! Giriş yapabilirsiniz.');
            navigate('/admin/login');
        } catch (err) {
            setError(
                err.response?.data?.message
                || err.response?.data?.errors?.map(e => e.message).join(', ')
                || 'Sıfırlama başarısız. Bağlantı geçersiz veya süresi dolmuş olabilir.'
            );
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
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-purple-600"></div>

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl text-blue-500">
                        <FaShieldAlt />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Yeni Şifre Belirle</h2>
                    <p className="text-gray-500 text-sm mt-2">
                        Güçlü bir şifre seç ve onayla.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <div className="relative">
                            <FaLock className="absolute left-4 top-3.5 text-gray-500" />
                            <input
                                type="password"
                                placeholder="Yeni Şifre"
                                {...register('password')}
                                className="w-full bg-[#0B1120] border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                        {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
                    </div>

                    <div>
                        <div className="relative">
                            <FaLock className="absolute left-4 top-3.5 text-gray-500" />
                            <input
                                type="password"
                                placeholder="Yeni Şifre (Tekrar)"
                                {...register('confirm')}
                                className="w-full bg-[#0B1120] border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                        {errors.confirm && <p className="text-red-400 text-xs mt-1">{errors.confirm.message}</p>}
                    </div>

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
                        ) : 'Şifreyi Sıfırla'}
                    </button>

                    <Link to="/admin/login" className="block text-center text-gray-500 hover:text-gray-300 text-xs">
                        ← Girişe dön
                    </Link>
                </form>
            </motion.div>
        </div>
    );
};

export default ResetPassword;
