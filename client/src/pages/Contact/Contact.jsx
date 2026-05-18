import { useState, useEffect, useMemo } from 'react';
import api from '../../api';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import {
    FaPaperPlane, FaEnvelope, FaMapMarkerAlt, FaGithub, FaLinkedin, FaPhone, FaWhatsapp,
    FaClock, FaCheckCircle, FaCalendarAlt, FaUserTie, FaTimes,
    FaBolt, FaCalculator, FaGlobeAmericas, FaQuoteRight,
    FaSlack, FaTrello, FaVideo, FaFileInvoice, FaShieldAlt, FaQuestionCircle
} from 'react-icons/fa';
import { SiJira, SiNotion, SiZoom } from 'react-icons/si';
import SEO from '../../components/common/SEO';
import { useTranslation } from 'react-i18next';

// Şema t() ile kurulur — hata mesajları aktif dile göre
const buildContactSchema = (t) => z.object({
  name: z.string().min(2, t('contact.val_name_min')),
  email: z.string().email(t('contact.val_email')),
  subject: z.string().min(1, t('contact.val_subject')),
  message: z.string().min(10, t('contact.val_message_min')),
});

// --- MODAL (TOPLANTI TALEBİ) — gerçek talep gönderir (mesaj API + admin e-posta) ---
const MeetingModal = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const [form, setForm] = useState({ name: '', email: '', date: '', time: '10:00', note: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

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
            <motion.div role="dialog" aria-modal="true" aria-label={t('contact.modal_title')} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-surface-raised border border-slate-700 w-full max-w-lg rounded-2xl p-8 relative z-50 shadow-2xl">
                <button onClick={onClose} aria-label={t('common.close')} className="absolute top-4 right-4 text-gray-400 hover:text-white"><FaTimes size={20} /></button>
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-600/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl"><FaCalendarAlt /></div>
                    <h3 className="text-2xl font-bold text-white">{t('contact.modal_title')}</h3>
                    <p className="text-gray-400 text-sm mt-2">{t('contact.modal_subtitle')}</p>
                </div>
                <form className="space-y-4" onSubmit={submit}>
                    <div className="grid grid-cols-2 gap-4">
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
                            <input id="mt-date" type="date" value={form.date} onChange={update('date')} required className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-blue-500" />
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

// --- MALİYET HESAPLAYICI ---
const CostEstimator = () => {
    const { t } = useTranslation();
    const [type, setType] = useState(1);
    const [pages, setPages] = useState(5);
    const [features, setFeatures] = useState({ admin: false, seo: false, design: false });

    const calculateCost = () => {
        let base = type === 1 ? 500 : type === 2 ? 1200 : 2500;
        let pageCost = pages * 50;
        let featureCost = (features.admin ? 400 : 0) + (features.seo ? 200 : 0) + (features.design ? 300 : 0);
        return base + pageCost + featureCost;
    };

    return (
        <div className="bg-surface-raised border border-slate-700 rounded-2xl p-6 mt-6">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-700 pb-2">
                <FaCalculator className="text-green-400" />
                <h3 className="text-white font-bold">{t('contact.cost_title')}</h3>
            </div>
            <div className="space-y-4">
                <div>
                    <label className="text-xs text-gray-400 uppercase font-bold">{t('contact.est_type')}</label>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                        {[t('contact.est_landing'), t('contact.est_corporate'), t('contact.est_ecommerce')].map((label, i) => (
                            <button key={label} onClick={() => setType(i + 1)} className={`text-xs py-2 rounded border ${type === i + 1 ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-gray-400'}`}>{label}</button>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="text-xs text-gray-400 uppercase font-bold flex justify-between">{t('contact.est_pages')}: <span className="text-white">{pages}</span></label>
                    <input type="range" min="1" max="20" value={pages} onChange={(e) => setPages(e.target.value)} className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer mt-1 accent-blue-500" />
                </div>
                <div className="flex flex-wrap gap-2">
                    {Object.keys(features).map(f => (
                        <button key={f} onClick={() => setFeatures({ ...features, [f]: !features[f] })} className={`text-xs px-3 py-1 rounded-full border ${features[f] ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-slate-800 border-slate-700 text-gray-500'}`}>
                            {f === 'admin' ? t('contact.est_admin') : f === 'seo' ? t('contact.est_seo') : t('contact.est_design')}
                        </button>
                    ))}
                </div>
                <div className="bg-black/30 p-4 rounded-xl text-center mt-2 border border-slate-700 border-dashed">
                    <p className="text-gray-500 text-xs mb-1">{t('contact.cost_range')}</p>
                    <p className="text-2xl font-bold text-white">${calculateCost()} - ${calculateCost() + 500}</p>
                </div>
            </div>
        </div>
    );
};

const Contact = () => {
    const { t } = useTranslation();
    const [status, setStatus] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [contactTab, setContactTab] = useState('collab'); // 'collab' | 'freelance'
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }));

    const contactSchema = useMemo(() => buildContactSchema(t), [t]);

    const {
        register,
        handleSubmit,
        setValue,
        control,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            name: '',
            email: '',
            subject: 'Proje Teklifi',
            message: ''
        }
    });

    const watchSubject = useWatch({ control, name: 'subject' });

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })), 60000);
        return () => clearInterval(timer);
    }, []);

    const onSubmit = async (data) => {
        setStatus('loading');
        try {
            await api.post('/messages', data);
            setStatus('success');
            reset();
            setTimeout(() => setStatus(null), 5000);
        } catch { setStatus('error'); }
    };

    return (
        <div className="min-h-screen bg-base pt-28 pb-20 px-6 font-sans overflow-x-hidden">
            <SEO
                title={t('contact.title')}
                description="Eyüp Zeki Salihoğlu ile iletişime geçin. Proje teklifleri, freelance çalışma ve iş birlikleri için."
                schema={{
                    '@context': 'https://schema.org',
                    '@type': 'ContactPage',
                    name: 'İletişim — Eyüp Zeki Salihoğlu',
                    description: 'Proje teklifleri, freelance çalışma ve iş birlikleri için iletişim.',
                    mainEntity: {
                        '@type': 'Person',
                        name: 'Eyüp Zeki Salihoğlu',
                        email: 'mailto:eyupzekisalihoglu@gmail.com',
                        sameAs: [
                            'https://github.com/salihoglueyup',
                            'https://www.linkedin.com/in/eyupzekisalihoglu/'
                        ]
                    }
                }}
            />
            <AnimatePresence>
                <MeetingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            </AnimatePresence>

            <div className="max-w-7xl mx-auto">

                {/* HEADER */}
                <div className="text-center mb-16">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="inline-block px-3 py-1 mb-4 border border-green-500/30 rounded-full bg-green-500/10 text-green-400 text-xs font-mono">
                        <span className="w-2 h-2 inline-block bg-green-500 rounded-full mr-2 animate-pulse"></span>
                        {t('contact.status_available')}
                    </motion.div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                        {t('contact.hero_title_1')} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">{t('contact.hero_title_2')}</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        {t('contact.hero_desc')}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">

                    {/* --- SOL KOLON --- */}
                    <motion.div className="lg:col-span-5 flex flex-col gap-6" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>

                        {/* 1. İletişim Kartı */}
                        <div className="bg-surface border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl -z-10"></div>
                            <h3 className="text-xl font-bold text-white mb-6">{t('contact.channels')}</h3>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 group/item">
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 text-xl"><FaEnvelope /></div>
                                    <div><span className="block text-xs text-gray-500 font-bold uppercase tracking-wider">Email</span><a href="mailto:eyupzekisalihoglu@gmail.com" className="text-white hover:text-blue-400 transition-colors font-medium">eyupzekisalihoglu@gmail.com</a></div>
                                </div>
                                <div className="flex items-center gap-4 group/item">
                                    <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400 text-xl"><FaPhone /></div>
                                    <div>
                                        <span className="block text-xs text-gray-500 font-bold uppercase tracking-wider">{t('contact.phone')}</span>
                                        <a href="tel:+905537102461" className="text-white hover:text-green-400 transition-colors font-medium">+90 553 710 24 61</a>
                                        <a href="https://wa.me/905537102461" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="ml-3 inline-flex items-center gap-1 text-green-500 hover:text-green-400 text-sm"><FaWhatsapp /> WhatsApp</a>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 group/item">
                                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 text-xl"><FaMapMarkerAlt /></div>
                                    <div><span className="block text-xs text-gray-500 font-bold uppercase tracking-wider">{t('contact.location')}</span><span className="text-white font-medium">{t('contact.location_value')}</span></div>
                                </div>
                            </div>
                            <div className="mt-8 pt-8 border-t border-slate-800 flex gap-4">
                                <a
                                    href="https://github.com/salihoglueyup"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 py-2 rounded-lg bg-slate-800 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black transition-all gap-2 text-sm font-bold border border-slate-700"
                                >
                                    <FaGithub /> Github
                                </a>
                                <a
                                    href="https://www.linkedin.com/in/eyupzekisalihoglu/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 py-2 rounded-lg bg-slate-800 flex items-center justify-center text-gray-400 hover:bg-[#0077b5] hover:text-white transition-all gap-2 text-sm font-bold border border-slate-700"
                                >
                                    <FaLinkedin /> LinkedIn
                                </a>
                            </div>
                        </div>

                        {/* 2. CANLI OPERASYON PANELİ */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-surface-raised border border-slate-700 p-4 rounded-xl flex flex-col items-center justify-center text-center">
                                <FaBolt className="text-yellow-400 text-xl mb-2" />
                                <span className="text-2xl font-bold text-white">{t('contact.response_value')}</span>
                                <span className="text-[10px] text-gray-400 uppercase font-bold">{t('contact.response_time')}</span>
                            </div>
                            <div className="bg-surface-raised border border-slate-700 p-4 rounded-xl flex flex-col items-center justify-center text-center">
                                <FaClock className="text-blue-400 text-xl mb-2" />
                                <span className="text-2xl font-bold text-white">{currentTime}</span>
                                <span className="text-[10px] text-gray-400 uppercase font-bold">{t('contact.local_time')}</span>
                            </div>
                        </div>

                    </motion.div>

                    {/* --- SAĞ KOLON --- */}
                    <motion.div className="lg:col-span-7" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="bg-surface border border-slate-800 rounded-2xl p-8 lg:p-10 relative shadow-2xl">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-2xl font-bold text-white">{t('contact.form_title')}</h3>
                                <FaPaperPlane className="text-slate-700 text-2xl rotate-12" />
                            </div>

                            {status === 'success' ? (
                                <div className="flex flex-col items-center justify-center py-24 text-center bg-slate-900/50 rounded-xl border border-slate-700 border-dashed">
                                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6"><FaCheckCircle className="text-4xl text-green-500 animate-bounce" /></div>
                                    <h4 className="text-2xl font-bold text-white">{t('contact.success_title')}</h4>
                                    <p className="text-gray-400 mt-2 max-w-xs mx-auto">{t('contact.success_desc')}</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label htmlFor="contact-name" className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">{t('contact.name')}</label>
                                            <input id="contact-name" type="text" {...register('name')} aria-invalid={!!errors.name} className="w-full bg-surface-raised border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-slate-900 outline-none transition-all" placeholder={t('contact.name')} />
                                            {errors.name && <p className="text-red-400 text-xs mt-1 ml-1">{errors.name.message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="contact-email" className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">{t('contact.email')}</label>
                                            <input id="contact-email" type="email" {...register('email')} aria-invalid={!!errors.email} className="w-full bg-surface-raised border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-slate-900 outline-none transition-all" placeholder="ornek@email.com" />
                                            {errors.email && <p className="text-red-400 text-xs mt-1 ml-1">{errors.email.message}</p>}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <span id="contact-subject-label" className="block text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">{t('contact.subject')}</span>
                                        <div role="group" aria-labelledby="contact-subject-label" className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                            {[t('contact.subject_offer'), t('contact.subject_freelance'), t('contact.subject_job'), t('contact.subject_other')].map(opt => (
                                                <button type="button" key={opt} aria-pressed={watchSubject === opt} onClick={() => setValue('subject', opt)} className={`py-2 text-xs font-bold rounded-lg border transition-all ${watchSubject === opt ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-surface-raised border-slate-700 text-gray-400 hover:border-gray-500'}`}>{opt}</button>
                                            ))}
                                        </div>
                                        {errors.subject && <p className="text-red-400 text-xs mt-1 ml-1">{errors.subject.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="contact-message" className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">{t('contact.message')}</label>
                                        <textarea id="contact-message" rows="6" {...register('message')} aria-invalid={!!errors.message} className="w-full bg-surface-raised border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-slate-900 outline-none transition-all resize-none" placeholder={t('contact.form_placeholder')}></textarea>
                                        {errors.message && <p className="text-red-400 text-xs mt-1 ml-1">{errors.message.message}</p>}
                                    </div>
                                    <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-1">{isSubmitting ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div> : <><FaPaperPlane /> {t('contact.send')}</>}</button>
                                </form>
                            )}
                        </div>

                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-surface border border-slate-800 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-center items-center min-h-[200px]">
                                <div className="absolute inset-0 opacity-20"><div className="w-full h-full bg-[radial-gradient(circle,_#3b82f6_1px,_transparent_1px)] bg-[size:20px_20px]"></div></div>
                                <div className="relative z-10 text-center">
                                    <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse"><FaGlobeAmericas size={24} /></div>
                                    <h4 className="text-white font-bold">{t('contact.global_service')}</h4>
                                    <p className="text-xs text-gray-500">{t('contact.global_desc')}</p>
                                </div>
                            </div>
                            <div className="bg-surface border border-slate-800 rounded-2xl p-6 flex flex-col justify-center relative">
                                <FaQuoteRight className="absolute top-4 right-4 text-slate-700 text-4xl" />
                                <p className="text-gray-300 text-sm italic mb-4 z-10">"{t('contact.quote_text')}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs">EZ</div>
                                    <div><h5 className="text-white text-xs font-bold">Eyüp Zeki Salihoğlu</h5><p className="text-[10px] text-gray-500">{t('contact.quote_role')}</p></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* --- ALT BÖLÜM: SEKMELİ (karma kitle: İş Birliği / Freelance) --- */}
                <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="border-t border-slate-800 pt-16">
                    <h2 className="text-3xl font-bold text-white mb-8 text-center">{t('contact.standards_title')}</h2>

                    {/* Sekme bar */}
                    <div role="tablist" aria-label={t('contact.standards_title')} className="flex justify-center gap-2 mb-10">
                        <button
                            role="tab"
                            aria-selected={contactTab === 'collab'}
                            onClick={() => setContactTab('collab')}
                            className={`px-5 py-2 rounded-lg text-sm font-bold border transition-all ${contactTab === 'collab' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-surface-raised border-slate-700 text-gray-400 hover:border-gray-500'}`}
                        >
                            {t('contact.tab_collab')}
                        </button>
                        <button
                            role="tab"
                            aria-selected={contactTab === 'freelance'}
                            onClick={() => setContactTab('freelance')}
                            className={`px-5 py-2 rounded-lg text-sm font-bold border transition-all ${contactTab === 'freelance' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-surface-raised border-slate-700 text-gray-400 hover:border-gray-500'}`}
                        >
                            {t('contact.tab_freelance')}
                        </button>
                    </div>

                    {/* İŞ BİRLİĞİ sekmesi — her iki kitle için nötr varsayılan */}
                    {contactTab === 'collab' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                            <div className="bg-gradient-to-r from-blue-900/40 to-slate-900 border border-blue-500/30 rounded-2xl p-8 text-center flex flex-col justify-center">
                                <FaUserTie className="text-3xl text-blue-400 mx-auto mb-3" />
                                <h3 className="text-white font-bold mb-2">{t('contact.meeting_title')}</h3>
                                <p className="text-sm text-gray-400 mb-4">{t('contact.meeting_desc')}</p>
                                <button onClick={() => setIsModalOpen(true)} className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20">{t('contact.meeting_request_btn')}</button>
                            </div>
                            <div className="bg-surface border border-slate-800 rounded-2xl p-8 flex flex-col justify-center">
                                <h4 className="text-xs font-bold text-gray-500 uppercase mb-6 text-center">{t('contact.collab_tools')}</h4>
                                <div className="flex justify-between items-center px-2">
                                    <div className="text-center group"><FaSlack className="text-2xl text-gray-400 group-hover:text-white transition-colors mb-1 mx-auto" /><span className="text-[10px] text-gray-500">Slack</span></div>
                                    <div className="text-center group"><SiJira className="text-2xl text-gray-400 group-hover:text-blue-400 transition-colors mb-1 mx-auto" /><span className="text-[10px] text-gray-500">Jira</span></div>
                                    <div className="text-center group"><SiNotion className="text-2xl text-gray-400 group-hover:text-white transition-colors mb-1 mx-auto" /><span className="text-[10px] text-gray-500">Notion</span></div>
                                    <div className="text-center group"><FaVideo className="text-2xl text-gray-400 group-hover:text-blue-500 transition-colors mb-1 mx-auto" /><span className="text-[10px] text-gray-500">Zoom</span></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* FREELANCE sekmesi — maliyet + SLA + FAQ */}
                    {contactTab === 'freelance' && (
                    <div className="space-y-10">
                    <div className="max-w-md mx-auto"><CostEstimator /></div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                        {/* SOL: SLA TABLOSU (Veri Odaklı) */}
                        <div className="bg-surface border border-slate-800 rounded-2xl overflow-hidden">
                            <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex items-center gap-3">
                                <FaShieldAlt className="text-green-500" />
                                <h3 className="font-bold text-white">{t('contact.sla_title')}</h3>
                            </div>
                            <div className="p-6">
                                <p className="text-sm text-gray-400 mb-6">{t('contact.sla_desc')}</p>
                                <table className="w-full text-sm text-left text-gray-400">
                                    <thead className="text-xs text-gray-500 uppercase bg-slate-800/50">
                                        <tr>
                                            <th className="px-6 py-3 rounded-l-lg">{t('contact.sla_col_priority')}</th>
                                            <th className="px-6 py-3">{t('contact.sla_col_first')}</th>
                                            <th className="px-6 py-3 rounded-r-lg">{t('contact.sla_col_resolution')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b border-slate-800 hover:bg-slate-800/30">
                                            <td className="px-6 py-4 font-bold text-red-400 flex items-center gap-2"><div className="w-2 h-2 bg-red-500 rounded-full"></div> {t('contact.sla_critical')}</td>
                                            <td className="px-6 py-4">{t('contact.sla_critical_first')}</td>
                                            <td className="px-6 py-4">{t('contact.sla_critical_res')}</td>
                                        </tr>
                                        <tr className="border-b border-slate-800 hover:bg-slate-800/30">
                                            <td className="px-6 py-4 font-bold text-yellow-400 flex items-center gap-2"><div className="w-2 h-2 bg-yellow-500 rounded-full"></div> {t('contact.sla_high')}</td>
                                            <td className="px-6 py-4">{t('contact.sla_high_first')}</td>
                                            <td className="px-6 py-4">{t('contact.sla_high_res')}</td>
                                        </tr>
                                        <tr className="hover:bg-slate-800/30">
                                            <td className="px-6 py-4 font-bold text-blue-400 flex items-center gap-2"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> {t('contact.sla_normal')}</td>
                                            <td className="px-6 py-4">{t('contact.sla_normal_first')}</td>
                                            <td className="px-6 py-4">{t('contact.sla_normal_res')}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* SAĞ: SIKÇA SORULANLAR (Accordion) */}
                        <div className="bg-surface border border-slate-800 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <FaQuestionCircle className="text-blue-500" />
                                <h3 className="font-bold text-white text-lg">{t('contact.faq_title')}</h3>
                            </div>
                            <div className="space-y-4">
                                <details className="group p-4 border border-slate-800 rounded-xl bg-slate-900/30 open:bg-slate-900/80 transition-all">
                                    <summary className="flex cursor-pointer items-center justify-between font-bold text-gray-300 group-hover:text-white">
                                        {t('contact.faq_q1')}
                                        <span className="transition group-open:rotate-180 text-blue-500"><FaBolt /></span>
                                    </summary>
                                    <div className="mt-3 text-sm text-gray-400 pl-4 border-l-2 border-blue-500">
                                        {t('contact.faq_a1')}
                                    </div>
                                </details>
                                <details className="group p-4 border border-slate-800 rounded-xl bg-slate-900/30 open:bg-slate-900/80 transition-all">
                                    <summary className="flex cursor-pointer items-center justify-between font-bold text-gray-300 group-hover:text-white">
                                        {t('contact.faq_q2')}
                                        <span className="transition group-open:rotate-180 text-blue-500"><FaBolt /></span>
                                    </summary>
                                    <div className="mt-3 text-sm text-gray-400 pl-4 border-l-2 border-blue-500">
                                        {t('contact.faq_a2')}
                                    </div>
                                </details>
                                <details className="group p-4 border border-slate-800 rounded-xl bg-slate-900/30 open:bg-slate-900/80 transition-all">
                                    <summary className="flex cursor-pointer items-center justify-between font-bold text-gray-300 group-hover:text-white">
                                        {t('contact.faq_q3')}
                                        <span className="transition group-open:rotate-180 text-blue-500"><FaBolt /></span>
                                    </summary>
                                    <div className="mt-3 text-sm text-gray-400 pl-4 border-l-2 border-blue-500">
                                        {t('contact.faq_a3')}
                                    </div>
                                </details>
                            </div>
                        </div>

                    </div>
                    </div>
                    )}
                </motion.div>

            </div>
        </div>
    );
};

export default Contact;