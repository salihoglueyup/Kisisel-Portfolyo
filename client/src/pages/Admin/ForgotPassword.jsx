import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaKey } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '../../api';

const schema = z.object({
    email: z.string().email('Geçerli bir e-posta adresi giriniz')
});

const ForgotPassword = () => {
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { email: '' }
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email: data.email });
            setSent(true); // Backend her durumda generic yanıt verir
        } catch {
            setSent(true); // Kullanıcı sızıntısını önlemek için yine de aynı ekran
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
                        <FaKey />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Şifremi Unuttum</h2>
                    <p className="text-gray-500 text-sm mt-2">
                        E-posta adresini gir, sıfırlama bağlantısı gönderelim.
                    </p>
                </div>

                {sent ? (
                    <div className="text-center space-y-6">
                        <p className="text-green-400 text-sm bg-green-500/10 p-4 rounded-lg border border-green-500/20">
                            Eğer bu e-posta kayıtlıysa, şifre sıfırlama bağlantısı gönderildi.
                            Gelen kutunu (ve spam klasörünü) kontrol et.
                        </p>
                        <Link to="/admin/login" className="inline-block text-blue-400 hover:text-blue-300 text-sm font-bold">
                            ← Girişe dön
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : 'Sıfırlama Bağlantısı Gönder'}
                        </button>

                        <Link to="/admin/login" className="block text-center text-gray-500 hover:text-gray-300 text-xs">
                            ← Girişe dön
                        </Link>
                    </form>
                )}
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
