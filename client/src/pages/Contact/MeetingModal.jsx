import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaTimes, FaCalendarAlt } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import api from '../../api';

// --- MODAL (TOPLANTI TALEBİ) — gerçek talep gönderir (mesaj API + admin e-posta) ---
const MeetingModal = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const [form, setForm] = useState({ name: '', email: '', date: '', time: '10:00', note: '' });
    const [loading, setLoading] = useState(false);
    const dialogRef = useRef(null);
    const triggerRef = useRef(null); // modal açılmadan önce odakta olan öğe

    useEffect(() => {
        if (!isOpen) return;
        triggerRef.current = document.activeElement;
        const dialog = dialogRef.current;
        const getFocusables = () => dialog
            ? Array.from(dialog.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'))
            : [];

        const onKey = (e) => {
            if (e.key === 'Escape') { onClose(); return; }
            if (e.key !== 'Tab') return;
            // Odak tuzağı: Tab sırası dialog içinde döner
            const els = getFocusables();
            if (!els.length) return;
            const first = els[0];
            const last = els[els.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        };

        window.addEventListener('keydown', onKey);
        return () => {
            window.removeEventListener('keydown', onKey);
            // Kapanışta odağı tetikleyici öğeye iade et
            if (triggerRef.current && typeof triggerRef.current.focus === 'function') {
                triggerRef.current.focus();
            }
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    // Geçmiş tarih seçilemesin (YYYY-MM-DD)
    const todayStr = new Date().toISOString().slice(0, 10);

    const update = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.email.trim() || !form.date) {
            toast.error(t('contact.modal_validation'));
            return;
        }
        setLoading(true);
        try {
            await api.post('/messages', {
                name: form.name,
                email: form.email,
                subject: t('contact.modal_title'),
                message:
                    `${t('contact.modal_title')}\n${t('contact.modal_date')}: ${form.date} ${form.time}` +
                    (form.note ? `\n\n${t('contact.modal_note')}: ${form.note}` : '')
            });
            toast.success(t('contact.modal_success'));
            onClose();
        } catch (err) {
            toast.error(err.friendlyMessage || t('contact.modal_error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm"></motion.div>
            <motion.div ref={dialogRef} role="dialog" aria-modal="true" aria-label={t('contact.modal_title')} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-surface-raised border border-slate-700 w-full max-w-lg rounded-2xl p-8 relative z-50 shadow-2xl">
                <button onClick={onClose} aria-label={t('common.close')} className="absolute top-4 right-4 text-gray-400 hover:text-white"><FaTimes size={20} /></button>
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-600/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl"><FaCalendarAlt /></div>
                    <h3 className="text-2xl font-bold text-white">{t('contact.modal_title')}</h3>
                    <p className="text-gray-400 text-sm mt-2">{t('contact.modal_subtitle')}</p>
                </div>
                <form className="space-y-4" onSubmit={submit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="mt-name" className="text-xs font-bold text-gray-500 uppercase">{t('contact.modal_name')}</label>
                            <input id="mt-name" type="text" autoFocus value={form.name} onChange={update('name')} required className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="mt-email" className="text-xs font-bold text-gray-500 uppercase">{t('contact.modal_email')}</label>
                            <input id="mt-email" type="email" value={form.email} onChange={update('email')} required className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="mt-date" className="text-xs font-bold text-gray-500 uppercase">{t('contact.modal_date')}</label>
                            <input id="mt-date" type="date" min={todayStr} value={form.date} onChange={update('date')} required className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="mt-time" className="text-xs font-bold text-gray-500 uppercase">{t('contact.modal_time')}</label>
                            <select id="mt-time" value={form.time} onChange={update('time')} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-blue-500">
                                <option>10:00</option><option>11:00</option><option>14:00</option><option>16:00</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="mt-note" className="text-xs font-bold text-gray-500 uppercase">{t('contact.modal_note')}</label>
                        <textarea id="mt-note" rows="2" value={form.note} onChange={update('note')} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-blue-500 resize-none" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors disabled:opacity-50">
                        {loading ? t('contact.modal_sending') : t('contact.modal_submit')}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default MeetingModal;
