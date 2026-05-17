// client/src/pages/Projects/ProjectDetails.jsx
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaArrowLeft, FaCode, FaDatabase, FaServer, FaLayerGroup, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';
import SEO from '../../components/common/SEO';
import { useProject } from '../../hooks/queries/useProjects';
import { useTranslation } from 'react-i18next';

const ProjectDetails = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const { data: project, isLoading: loading } = useProject(id);
    const [activeTab, setActiveTab] = useState('overview');

    if (loading) return <div className="min-h-screen bg-[#0B1120] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>;
    if (!project) return <div className="min-h-screen bg-[#0B1120] flex items-center justify-center text-white">{t('projectDetails.not_found')}</div>;

    // Teknik mimari verisi (DB'den veya fallback)
    const techArch = project.technicalArchitecture || {};
    const techCards = [
        { key: 'frontend', icon: <FaCode size={24} />, label: 'Frontend', color: 'text-blue-400', value: techArch.frontend },
        { key: 'backend', icon: <FaServer size={24} />, label: 'Backend', color: 'text-green-400', value: techArch.backend },
        { key: 'database', icon: <FaDatabase size={24} />, label: 'Database', color: 'text-yellow-400', value: techArch.database },
        { key: 'devops', icon: <FaLayerGroup size={24} />, label: 'DevOps', color: 'text-purple-400', value: techArch.devops },
    ].filter(card => card.value); // Sadece dolu olanları göster

    // Proje yılı (DB'den date veya createdAt)
    const projectYear = project.date
        ? new Date(project.date).getFullYear()
        : new Date(project.createdAt).getFullYear();

    // Durum badge rengi
    const statusColors = {
        'Tamamlandı': 'text-green-400 bg-green-400',
        'Devam Ediyor': 'text-yellow-400 bg-yellow-400',
        'Bakım Modunda': 'text-blue-400 bg-blue-400',
        'Prototip': 'text-purple-400 bg-purple-400',
    };
    const statusColor = statusColors[project.status] || statusColors['Tamamlandı'];

    return (
        <div className="min-h-screen bg-[#0B1120] pt-24 pb-20 px-6 font-sans text-gray-300">
            <SEO title={`${project.title} — Proje Detay`} description={project.description} />

            {/* 1. ÜST NAVİGASYON */}
            <div className="max-w-6xl mx-auto mb-8">
                <Link to="/projects" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors mb-6">
                    <FaArrowLeft /> {t('projectDetails.back')}
                </Link>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto"
            >
                {/* 2. HERO BÖLÜMÜ */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    <div className="flex flex-col justify-center">
                        <div className="flex flex-wrap gap-2 mb-4">
                            {project.tags?.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-bold border border-blue-500/20">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">{project.title}</h1>
                        <p className="text-lg text-gray-400 mb-8">{project.description}</p>

                        <div className="flex gap-4">
                            {project.links?.github && (
                                <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-[#1f2937] text-white rounded-lg flex items-center gap-2 hover:bg-[#374151] transition-all border border-slate-700">
                                    <FaGithub /> {t('projectDetails.source_code')}
                                </a>
                            )}
                            {project.links?.live && (
                                <a href={project.links.live} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20">
                                    <FaExternalLinkAlt /> {t('projectDetails.live_demo')}
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="relative group rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 aspect-video">
                        {project.image ? (
                            <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                                <FaCode className="text-6xl text-slate-700" />
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. İSTATİSTİK ŞERİDİ */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 border-y border-slate-800 py-8">
                    <div className="text-center border-r border-slate-800 last:border-0">
                        <span className="block text-3xl font-bold text-white mb-1">{project.metrics?.complexity || 0}/10</span>
                        <span className="text-xs text-gray-500 uppercase tracking-wider">{t('projectDetails.stat_complexity')}</span>
                    </div>
                    <div className="text-center border-r border-slate-800 last:border-0">
                        <span className="block text-3xl font-bold text-white mb-1">{project.metrics?.hoursSpent || 0}h</span>
                        <span className="text-xs text-gray-500 uppercase tracking-wider">{t('projectDetails.stat_hours')}</span>
                    </div>
                    <div className="text-center border-r border-slate-800 last:border-0">
                        <span className="block text-3xl font-bold text-white mb-1">{project.metrics?.linesOfCode || 0}</span>
                        <span className="text-xs text-gray-500 uppercase tracking-wider">{t('projectDetails.stat_lines')}</span>
                    </div>
                    <div className="text-center">
                        <span className="block text-3xl font-bold text-white mb-1 flex justify-center items-center gap-2"><FaCalendarAlt className="text-sm text-blue-500" /> {projectYear}</span>
                        <span className="text-xs text-gray-500 uppercase tracking-wider">{t('projectDetails.stat_year')}</span>
                    </div>
                </div>

                {/* 4. TAB MENÜ VE İÇERİK */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* SOL: İÇERİK (2/3) */}
                    <div className="lg:col-span-2">
                        {/* Tab Butonları */}
                        <div className="flex border-b border-slate-800 mb-8">
                            {['overview', 'technical', 'challenges'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-4 px-4 text-sm font-bold uppercase tracking-wider transition-all relative ${activeTab === tab ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'
                                        }`}
                                >
                                    {tab === 'overview' && t('projectDetails.tab_overview')}
                                    {tab === 'technical' && t('projectDetails.tab_technical')}
                                    {tab === 'challenges' && t('projectDetails.tab_challenges')}
                                    {activeTab === tab && (
                                        <motion.div layoutId="underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Tab İçerikleri */}
                        <div className="min-h-[300px]">
                            {activeTab === 'overview' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                    <h3 className="text-xl font-bold text-white">{t('projectDetails.about_title')}</h3>
                                    <p className="leading-relaxed">{project.description}</p>

                                    {/* Ana Özellikler — DB'den */}
                                    {project.features && project.features.length > 0 && (
                                        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                                            <h4 className="font-bold text-white mb-3">🚀 {t('projectDetails.features_title')}</h4>
                                            <ul className="space-y-2 text-gray-400">
                                                {project.features.map((feature, idx) => (
                                                    <li key={idx} className="flex items-start gap-2">
                                                        <FaCheckCircle className="text-green-500 mt-1 shrink-0" />
                                                        <span>{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Fallback: DB'de features yoksa varsayılan */}
                                    {(!project.features || project.features.length === 0) && (
                                        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                                            <h4 className="font-bold text-white mb-2">🚀 {t('projectDetails.features_title')}</h4>
                                            <ul className="list-disc list-inside space-y-2 text-gray-400">
                                                <li>Responsive (Mobil Uyumlu) Tasarım</li>
                                                <li>RESTful API Entegrasyonu</li>
                                                <li>Admin Yönetim Paneli</li>
                                                <li>Gerçek Zamanlı Veri Akışı</li>
                                            </ul>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'technical' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                    <h3 className="text-xl font-bold text-white">{t('projectDetails.tech_title')}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {techCards.length > 0 ? techCards.map(card => (
                                            <div key={card.key} className="p-4 border border-slate-800 rounded-xl">
                                                <div className={`flex items-center gap-3 mb-3 ${card.color}`}>{card.icon} <span className="font-bold">{card.label}</span></div>
                                                <p className="text-sm">{card.value}</p>
                                            </div>
                                        )) : (
                                            /* Fallback: DB'de technicalArchitecture yoksa */
                                            <>
                                                <div className="p-4 border border-slate-800 rounded-xl">
                                                    <div className="flex items-center gap-3 mb-3 text-blue-400"><FaCode size={24} /> <span className="font-bold">Frontend</span></div>
                                                    <p className="text-sm">React.js, Tailwind CSS, Framer Motion</p>
                                                </div>
                                                <div className="p-4 border border-slate-800 rounded-xl">
                                                    <div className="flex items-center gap-3 mb-3 text-green-400"><FaServer size={24} /> <span className="font-bold">Backend</span></div>
                                                    <p className="text-sm">Node.js, Express.js, JWT</p>
                                                </div>
                                                <div className="p-4 border border-slate-800 rounded-xl">
                                                    <div className="flex items-center gap-3 mb-3 text-yellow-400"><FaDatabase size={24} /> <span className="font-bold">Database</span></div>
                                                    <p className="text-sm">MongoDB, NoSQL</p>
                                                </div>
                                                <div className="p-4 border border-slate-800 rounded-xl">
                                                    <div className="flex items-center gap-3 mb-3 text-purple-400"><FaLayerGroup size={24} /> <span className="font-bold">DevOps</span></div>
                                                    <p className="text-sm">Git, Vercel/Render</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'challenges' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                    <h3 className="text-xl font-bold text-white">{t('projectDetails.challenges_title')}</h3>
                                    <div className="space-y-4">
                                        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
                                            <h4 className="text-red-400 font-bold mb-1">Sorun: Veri Tutarlılığı</h4>
                                            <p className="text-sm">Karmaşık form yapılarında state yönetimi zorlaştı ve gereksiz render'lar oluştu.</p>
                                        </div>
                                        <div className="flex justify-center text-gray-500">⬇</div>
                                        <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl">
                                            <h4 className="text-green-400 font-bold mb-1">Çözüm: React Context & Memo</h4>
                                            <p className="text-sm">Global state için Context API kullanıldı ve `useMemo`, `useCallback` ile performans optimizasyonu yapıldı.</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* SAĞ: SİDEBAR BİLGİ (1/3) */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 sticky top-28">
                            <h3 className="text-lg font-bold text-white mb-4">{t('projectDetails.spec_title')}</h3>
                            <div className="space-y-4 text-sm">
                                <div className="flex justify-between border-b border-slate-800 pb-2">
                                    <span className="text-gray-500">{t('projectDetails.spec_category')}</span>
                                    <span className="text-white font-medium">{project.category || project.tags?.[0]}</span>
                                </div>
                                {project.role && (
                                    <div className="flex justify-between border-b border-slate-800 pb-2">
                                        <span className="text-gray-500">{t('projectDetails.spec_role')}</span>
                                        <span className="text-white font-medium">{project.role}</span>
                                    </div>
                                )}
                                <div className="flex justify-between border-b border-slate-800 pb-2">
                                    <span className="text-gray-500">{t('projectDetails.spec_status')}</span>
                                    <span className={`font-medium flex items-center gap-1 ${statusColor.split(' ')[0]}`}>
                                        <span className={`w-2 h-2 rounded-full animate-pulse ${statusColor.split(' ')[1]}`}></span>
                                        {project.status || 'Tamamlandı'}
                                    </span>
                                </div>

                                <div className="pt-4">
                                    <h4 className="text-gray-500 mb-2">{t('projectDetails.spec_tech')}</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tags?.map(t => (
                                            <span key={t} className="px-2 py-1 bg-slate-800 rounded text-xs text-gray-300 border border-slate-700">{t}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </motion.div>
        </div>
    );
};

export default ProjectDetails;