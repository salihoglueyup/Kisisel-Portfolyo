import { useMemo } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { motion } from 'framer-motion';
import { FaGithub, FaServer, FaNetworkWired, FaCodeBranch, FaBook, FaPaperPlane, FaArrowRight, FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '../../components/common/SEO';
import StatusBadge from '../../components/common/StatusBadge';
import CtaSection from '../../components/common/CtaSection';
import { useProjects } from '../../hooks/queries/useProjects';

// Bileşen Importları
import TechTicker from '../../components/common/TechTicker';
import StatCards from '../../components/charts/StatCards';
import SkillChart from '../../components/charts/SkillChart';
import Terminal from '../../components/features/Terminal';
import SystemMonitor from '../../components/features/SystemMonitor';
import ActivityMap from '../../components/features/ActivityMap';
import TrafficLogs from '../../components/features/TrafficLogs';
import LearningPath from '../../components/features/LearningPath';

// Ortak Kart Tasarımı
const DashboardCard = ({ title, icon, children, className = "" }) => (
    <div className={`bg-surface border border-slate-800 rounded-xl overflow-hidden flex flex-col h-full ${className}`}>
        <div className="px-5 py-3 border-b border-slate-800 bg-slate-900/50 flex items-center gap-3">
            <span className="text-blue-500">{icon}</span>
            <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">{title}</h3>
        </div>
        <div className="p-5 flex-1 flex flex-col justify-center">
            {children}
        </div>
    </div>
);

const Home = () => {
    const { t } = useTranslation();
    const { data: projects = [] } = useProjects();

    // Öne çıkan proje = en yüksek karmaşıklık (Projects sayfasıyla aynı mantık)
    const featured = useMemo(() => {
        if (!projects.length) return null;
        return projects.reduce(
            (prev, cur) => ((prev.metrics?.complexity || 0) > (cur.metrics?.complexity || 0) ? prev : cur)
        );
    }, [projects]);

    const insights = [
        { title: "Production RAG sistemleri & Vector DB", tag: "AI Engineering", color: "text-blue-400" },
        { title: "Local LLM & LangChain pipeline'ları", tag: "LLM", color: "text-green-400" },
        { title: "JWT / RBAC / OWASP ile güvenli mimari", tag: "Security", color: "text-purple-400" },
    ];

    return (
        <div className="min-h-screen w-full overflow-x-hidden bg-base">
            <SEO
                title={t('navbar.home')}
                description="Eyüp Zeki Salihoğlu — Full-Stack AI Engineer. Production seviyesinde RAG sistemleri, LLM ve güvenli kurumsal web uygulamaları."
                schema={[
                    {
                        '@context': 'https://schema.org',
                        '@type': 'Person',
                        name: 'Eyüp Zeki Salihoğlu',
                        jobTitle: 'Full-Stack AI Engineer',
                        url: 'https://salihoglueyup.vercel.app',
                        knowsAbout: ['RAG', 'LLM', 'LangChain', 'FastAPI', 'React', 'Cybersecurity'],
                        sameAs: [
                            'https://github.com/salihoglueyup',
                            'https://www.linkedin.com/in/eyupzekisalihoglu/'
                        ]
                    },
                    {
                        '@context': 'https://schema.org',
                        '@type': 'WebSite',
                        name: 'Eyüp Zeki Salihoğlu — Full-Stack AI Engineer',
                        url: typeof window !== 'undefined' ? window.location.origin : undefined
                    }
                ]}
            />

            {/* 1. HERO BÖLÜMÜ */}
            <section className="relative min-h-[85vh] flex flex-col justify-center items-center px-6 pt-20 pb-10">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />
                </div>

                <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <StatusBadge color="blue" dot="ping" className="mb-6">
                            SYSTEM ONLINE
                        </StatusBadge>

                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                            {t('home.hero_line1')} <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">{t('home.hero_line2')}</span><br/>
                            {t('home.hero_line3')}
                        </h1>

                        <div className="text-xl text-gray-400 mb-4 font-mono h-8">
                            <TypeAnimation
                                sequence={[t('home.typing1'), 1500, t('home.typing2'), 1500]}
                                speed={50}
                                repeat={Infinity}
                            />
                        </div>

                        {/* Tek cümle değer önermesi — tarayıcılabilir */}
                        <p className="text-gray-400 mb-8 max-w-md leading-relaxed">
                            {t('home.value_prop')}
                        </p>

                        <div className="flex gap-4">
                            <Link to="/projects" className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-600/20">
                                {t('home.btn_projects')}
                            </Link>
                            <a href="https://github.com/salihoglueyup" target="_blank" rel="noopener noreferrer" className="px-8 py-3 border border-slate-700 text-gray-300 rounded-lg font-medium hover:bg-slate-800 transition-all flex items-center gap-2">
                                <FaGithub /> GitHub
                            </a>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <div className="bg-surface border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl">
                            <SkillChart />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 2. KPI & TICKER */}
            <TechTicker />
            <div className="border-b border-slate-800 bg-surface-overlay/50">
                <div className="max-w-7xl mx-auto px-6 py-16">
                    <StatCards />
                </div>
            </div>

            {/* 3. ÖNE ÇIKAN PROJE (kanıt — recruiter ayağı) */}
            {featured && (
                <section className="py-16 px-6 max-w-7xl mx-auto">
                    <div className="mb-8 flex items-end justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-white">{t('home.featured_title')}</h2>
                            <p className="text-gray-400 text-sm mt-1">{t('home.featured_desc')}</p>
                        </div>
                        <Link to="/projects" className="shrink-0 text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium">
                            {t('projects.view_all')} <FaArrowRight className="text-xs" />
                        </Link>
                    </div>

                    <Link
                        to={`/projects/${featured._id}`}
                        className="group relative grid grid-cols-1 md:grid-cols-2 bg-surface border border-slate-800 rounded-2xl overflow-hidden hover:border-blue-500/40 transition-colors"
                    >
                        <div className="h-56 md:h-auto bg-slate-900 relative overflow-hidden">
                            <span className="absolute top-4 left-4 z-10 px-3 py-1 bg-yellow-500 text-black text-xs font-bold rounded-full flex items-center gap-1 shadow-lg">
                                <FaStar /> {t('projects.featured_badge')}
                            </span>
                            {featured.image ? (
                                <img src={featured.image} alt={featured.title} loading="lazy" decoding="async" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900"><FaCodeBranch className="text-7xl text-slate-700" /></div>
                            )}
                        </div>
                        <div className="p-8 md:p-10 flex flex-col justify-center">
                            <div className="flex flex-wrap gap-2 mb-4">
                                {featured.tags?.slice(0, 4).map(tag => (
                                    <span key={tag} className="text-xs font-mono text-blue-400 bg-blue-400/10 px-2 py-1 rounded">{tag}</span>
                                ))}
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">{featured.title}</h3>
                            <p className="text-gray-400 mb-6 line-clamp-3">{featured.description}</p>
                            <span className="w-max text-sm font-bold text-white flex items-center gap-2 group-hover:gap-3 transition-all">
                                {t('projects.case_study')} <FaArrowRight />
                            </span>
                        </div>
                    </Link>
                </section>
            )}

            {/* 4. KOMUTA MERKEZİ (sadeleştirilmiş) */}
            <section className="py-16 px-6 max-w-7xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white">{t('home.command_center')}</h2>
                    <p className="text-gray-400 text-sm mt-1">{t('home.command_desc')}</p>
                </div>

                <div className="flex flex-col gap-6">

                    {/* Terminal & Monitor */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:h-[400px]">
                        <div className="lg:col-span-2 min-h-[320px] lg:h-full">
                            <DashboardCard title="Terminal Access" icon={<FaServer />} className="h-full">
                                <div className="-m-4 h-full">
                                    <Terminal />
                                </div>
                            </DashboardCard>
                        </div>
                        <div className="lg:col-span-1 min-h-[320px] lg:h-full">
                            <DashboardCard title="System Status" icon={<FaServer />} className="h-full">
                                <SystemMonitor />
                            </DashboardCard>
                        </div>
                    </div>

                    {/* Teknik Notlar */}
                    <DashboardCard title={t('home.tech_notes')} icon={<FaBook />}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {insights.map((item, idx) => (
                                <Link to="/blog" key={idx} className="block p-3 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-blue-500/50 transition-colors group">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className={`text-xs font-bold ${item.color}`}>{item.tag}</span>
                                        <FaArrowRight className="text-[10px] text-gray-500 group-hover:text-white transition-colors"/>
                                    </div>
                                    <h4 className="text-sm text-gray-200 font-medium group-hover:text-white">{item.title}</h4>
                                </Link>
                            ))}
                        </div>
                    </DashboardCard>

                    {/* Git Contributions (gerçek veri) */}
                    <DashboardCard title={t('home.git_activity')} icon={<FaGithub />}>
                        <div className="flex items-center justify-center w-full overflow-x-auto">
                            <ActivityMap />
                        </div>
                    </DashboardCard>

                    {/* Canlı sistem paneli — varsayılan kapalı (görsel yükü azaltır) */}
                    <details className="group bg-surface border border-slate-800 rounded-xl overflow-hidden">
                        <summary className="px-5 py-3 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between gap-3 cursor-pointer list-none">
                            <span className="flex items-center gap-3">
                                <FaNetworkWired className="text-blue-500" />
                                <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">{t('home.live_panel')}</h3>
                            </span>
                            <FaArrowRight className="text-xs text-gray-500 transition-transform group-open:rotate-90" />
                        </summary>
                        <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">{t('home.live_traffic')}</h4>
                                <TrafficLogs />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">{t('home.learning_path')}</h4>
                                <LearningPath />
                            </div>
                        </div>
                    </details>

                    {/* İletişim CTA */}
                    <CtaSection
                        className="w-full"
                        icon={<FaPaperPlane />}
                        titleAs="h3"
                        title={t('home.cta_title')}
                        description={t('home.cta_desc')}
                    >
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link to="/contact" className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-600/20">
                                {t('home.cta_contact')}
                            </Link>
                            <a href="https://linkedin.com/in/eyupzekisalihoglu" target="_blank" rel="noopener noreferrer" className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-xl font-medium transition-all border border-slate-700 flex items-center justify-center gap-2">
                                {t('home.cta_linkedin')}
                            </a>
                        </div>
                    </CtaSection>

                </div>
            </section>
        </div>
    );
};

export default Home;
