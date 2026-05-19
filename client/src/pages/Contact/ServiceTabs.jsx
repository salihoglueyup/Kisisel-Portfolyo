import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaUserTie, FaSlack, FaVideo, FaShieldAlt, FaQuestionCircle, FaBolt } from 'react-icons/fa';
import { SiJira, SiNotion } from 'react-icons/si';
import MeetingModal from './MeetingModal';
import CostEstimator from './CostEstimator';

// Alt bölüm sekmeleri (a11y: roving tabindex + ok tuşu navigasyonu)
const TABS = [
  { key: 'collab',    i18n: 'contact.tab_collab' },
  { key: 'freelance', i18n: 'contact.tab_freelance' },
];

// Karma kitle (İş Birliği / Freelance) sekmeli bölümü. Toplantı modalı
// yalnız buradan tetiklendiği için modal sahipliği de bu bileşendedir.
const ServiceTabs = () => {
    const { t } = useTranslation();
    const [contactTab, setContactTab] = useState('collab'); // 'collab' | 'freelance'
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Sekme bar: Sol/Sağ ok ile sekme değiştir ve odağı taşı
    const onTabKey = (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        const idx = TABS.findIndex((tb) => tb.key === contactTab);
        const dir = e.key === 'ArrowRight' ? 1 : -1;
        const next = TABS[(idx + dir + TABS.length) % TABS.length];
        setContactTab(next.key);
        document.getElementById(`tab-${next.key}`)?.focus();
    };

    return (
        <>
            <AnimatePresence>
                <MeetingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            </AnimatePresence>

            <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="border-t border-slate-800 pt-16">
                <h2 className="text-3xl font-bold text-white mb-8 text-center">{t('contact.standards_title')}</h2>

                {/* Sekme bar */}
                <div role="tablist" aria-label={t('contact.standards_title')} className="flex justify-center gap-2 mb-10">
                    {TABS.map((tb) => (
                        <button
                            key={tb.key}
                            id={`tab-${tb.key}`}
                            role="tab"
                            aria-selected={contactTab === tb.key}
                            aria-controls={`panel-${tb.key}`}
                            tabIndex={contactTab === tb.key ? 0 : -1}
                            onKeyDown={onTabKey}
                            onClick={() => setContactTab(tb.key)}
                            className={`px-5 py-2 rounded-lg text-sm font-bold border transition-all ${contactTab === tb.key ? 'bg-blue-600 border-blue-500 text-white' : 'bg-surface-raised border-slate-700 text-gray-400 hover:border-gray-500'}`}
                        >
                            {t(tb.i18n)}
                        </button>
                    ))}
                </div>

                {/* İŞ BİRLİĞİ sekmesi — her iki kitle için nötr varsayılan */}
                {contactTab === 'collab' && (
                    <div id="panel-collab" role="tabpanel" aria-labelledby="tab-collab" tabIndex={0} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
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
                <div id="panel-freelance" role="tabpanel" aria-labelledby="tab-freelance" tabIndex={0} className="space-y-10">
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
                                <summary className="flex cursor-pointer items-center justify-between font-bold text-gray-300 group-hover:text-white list-none [&::-webkit-details-marker]:hidden">
                                    {t('contact.faq_q1')}
                                    <span className="transition group-open:rotate-180 text-blue-500"><FaBolt /></span>
                                </summary>
                                <div className="mt-3 text-sm text-gray-400 pl-4 border-l-2 border-blue-500">
                                    {t('contact.faq_a1')}
                                </div>
                            </details>
                            <details className="group p-4 border border-slate-800 rounded-xl bg-slate-900/30 open:bg-slate-900/80 transition-all">
                                <summary className="flex cursor-pointer items-center justify-between font-bold text-gray-300 group-hover:text-white list-none [&::-webkit-details-marker]:hidden">
                                    {t('contact.faq_q2')}
                                    <span className="transition group-open:rotate-180 text-blue-500"><FaBolt /></span>
                                </summary>
                                <div className="mt-3 text-sm text-gray-400 pl-4 border-l-2 border-blue-500">
                                    {t('contact.faq_a2')}
                                </div>
                            </details>
                            <details className="group p-4 border border-slate-800 rounded-xl bg-slate-900/30 open:bg-slate-900/80 transition-all">
                                <summary className="flex cursor-pointer items-center justify-between font-bold text-gray-300 group-hover:text-white list-none [&::-webkit-details-marker]:hidden">
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
        </>
    );
};

export default ServiceTabs;
