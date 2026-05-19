import { motion } from 'framer-motion';
import {
    FaEnvelope, FaMapMarkerAlt, FaGithub, FaLinkedin, FaPhone, FaWhatsapp,
    FaBolt, FaGlobeAmericas, FaQuoteRight
} from 'react-icons/fa';
import SEO from '../../components/common/SEO';
import { useTranslation } from 'react-i18next';
import LocalClock from './LocalClock';
import MessageForm from './MessageForm';
import ServiceTabs from './ServiceTabs';

const Contact = () => {
    const { t } = useTranslation();

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

            <div className="max-w-7xl mx-auto">

                {/* HEADER */}
                <div className="text-center mb-16">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="inline-block px-3 py-1 mb-4 border border-green-500/30 rounded-full bg-green-500/10 text-green-400 text-xs font-mono">
                        <span className="w-2 h-2 inline-block bg-green-500 rounded-full mr-2 animate-pulse"></span>
                        {t('contact.status_available')}
                    </motion.div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
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
                            <LocalClock />
                        </div>

                    </motion.div>

                    {/* --- SAĞ KOLON --- */}
                    <motion.div className="lg:col-span-7" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}>
                        <MessageForm />

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
                <ServiceTabs />

            </div>
        </div>
    );
};

export default Contact;
