import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../../api';
import { useQueryClient } from '@tanstack/react-query';
import { FaUserCog, FaKey } from 'react-icons/fa';
import { formatDateTime } from '../../../utils/formatDate';

// Profil formu: state prop'tan başlatılır (effect'te setState yok).
// `key={profile.email}` ile profil kimliği değişince yeniden mount olur.
const ProfileInfoForm = ({ profile }) => {
    const queryClient = useQueryClient();
    const [form, setForm] = useState({
        displayName: profile.displayName,
        email: profile.email
    });

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put('/auth/profile', form);
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            toast.success('Profil güncellendi!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Güncelleme hatası.');
        }
    };

    return (
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-8">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <FaUserCog className="text-blue-400" /> Profil Bilgileri
            </h3>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div>
                    <label className="text-xs text-gray-500 font-bold uppercase">Görüntülenen İsim</label>
                    <input type="text" value={form.displayName} onChange={e => setForm({ ...form, displayName: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-blue-500 mt-1" />
                </div>
                <div>
                    <label className="text-xs text-gray-500 font-bold uppercase">Email</label>
                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-blue-500 mt-1" />
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 pt-2">
                    <span>Rol: <strong className="text-purple-400">{profile.role}</strong></span>
                    <span>•</span>
                    <span>Son Giriş: {profile.lastLogin ? formatDateTime(profile.lastLogin) : 'İlk giriş'}</span>
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-bold transition-colors mt-2">
                    Profili Güncelle
                </button>
            </form>
        </div>
    );
};

const PasswordChangeForm = () => {
    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        try {
            await api.put('/auth/password', passwordForm);
            toast.success('Şifre başarıyla değiştirildi!');
            setPasswordForm({ currentPassword: '', newPassword: '' });
        } catch (err) {
            const msg = err.response?.data?.message
                || err.response?.data?.errors?.map(e => e.message).join(', ')
                || 'Şifre değiştirme hatası.';
            toast.error(msg);
        }
    };

    return (
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-8">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <FaKey className="text-yellow-400" /> Şifre Değiştir
            </h3>
            <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                    <label className="text-xs text-gray-500 font-bold uppercase">Mevcut Şifre</label>
                    <input type="password" value={passwordForm.currentPassword} onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-yellow-500 mt-1" required />
                </div>
                <div>
                    <label className="text-xs text-gray-500 font-bold uppercase">Yeni Şifre</label>
                    <input type="password" value={passwordForm.newPassword} onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-yellow-500 mt-1" required />
                    <p className="text-[10px] text-gray-600 mt-1">En az 8 karakter, büyük/küçük harf ve rakam içermelidir.</p>
                </div>
                <button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-500 text-white py-3 rounded-lg font-bold transition-colors">
                    Şifreyi Değiştir
                </button>
            </form>
        </div>
    );
};

const ProfileTab = ({ profile }) => {
    if (!profile) return null;

    return (
        <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-8 bg-[#111827] p-4 rounded-xl border border-slate-800">
                <FaUserCog className="text-purple-500" />
                <h2 className="text-xl font-bold text-white">Hesap Yönetimi</h2>
            </div>

            <div className="grid gap-8">
                <ProfileInfoForm key={profile.email} profile={profile} />
                <PasswordChangeForm />
            </div>
        </div>
    );
};

export default ProfileTab;
