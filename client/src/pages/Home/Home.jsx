import { TypeAnimation } from 'react-type-animation';
import { motion } from 'framer-motion';
import { FaGithub, FaServer, FaNetworkWired, FaCodeBranch, FaBook, FaPaperPlane, FaArrowRight } from 'react-icons/fa';
import { GitHubCalendar } from 'react-github-calendar'; // Deneme amaçlı

// Bileşen Importları
import TechTicker from '../../components/common/TechTicker';
import StatCards from '../../components/charts/StatCards';
import SkillChart from '../../components/charts/SkillChart';
import Terminal from '../../components/features/Terminal';
import SystemMonitor from '../../components/features/SystemMonitor';
import ActivityMap from '../../components/features/ActivityMap';
import TrafficLogs from '../../components/features/TrafficLogs';
import LearningPath from '../../components/features/LearningPath';
import LatestInsights from '../../components/features/LatestInsights';

// Ortak Kart Tasarımı
const DashboardCard = ({ title, icon, children, className = "" }) => (
    <div className={`bg-[#111827] border border-slate-800 rounded-xl overflow-hidden flex flex-col h-full ${className}`}>
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

    const insights = [
        { title: "Node.js ile mikroservisler", tag: "Architecture", color: "text-blue-400" },
        { title: "Python for Data Science", tag: "Veri", color: "text-green-400" },
        { title: "Modern React Tabloları", tag: "Frontend", color: "text-purple-400" },
    ];

    return (
        <div className="min-h-screen w-full overflow-x-hidden bg-[#0B1120]">

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
                        <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-blue-500/20 rounded-full bg-blue-500/5 text-blue-400 text-xs font-mono">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            SYSTEM ONLINE
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                            Veriyi <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Kodlayan</span><br/>
                            Zihin.
                        </h1>

                        <div className="text-xl text-gray-400 mb-8 font-mono h-8">
                            <TypeAnimation
                                sequence={['Yönetim Bilişim Sistemleri.', 1500, 'Full Stack Development.', 1500]}
                                speed={50}
                                repeat={Infinity}
                            />
                        </div>

                        <div className="flex gap-4">
                            <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
                                Projeler
                            </button>
                            <button className="px-8 py-3 border border-slate-700 text-gray-300 rounded-lg font-medium hover:bg-slate-800 transition-all flex items-center gap-2">
                                <FaGithub /> GitHub
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="hidden md:block"
                    >
                        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-2xl">
                            <SkillChart />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 2. KPI & TICKER */}
            <TechTicker />
            <div className="border-b border-slate-800 bg-[#0f172a]/50">
                <div className="max-w-7xl mx-auto px-6 py-16">
                    <StatCards />
                </div>
            </div>

            {/* 3. KOMUTA MERKEZİ (GRID DÜZENİ) */}
            <section className="py-16 px-6 max-w-7xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white">Komuta Merkezi</h2>
                    <p className="text-gray-400 text-sm mt-1">Canlı sistem verileri ve geliştirme durumu.</p>
                </div>

                <div className="flex flex-col gap-6">

                    {/* ROW 0: Terminal & Monitor (Başlangıç Paneli) */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
                        <div className="lg:col-span-2 h-full">
                            <DashboardCard title="Terminal Access" icon={<FaServer />} className="h-full">
                                <div className="-m-4 h-full">
                                    <Terminal />
                                </div>
                            </DashboardCard>
                        </div>
                        <div className="lg:col-span-1 h-full">
                            <DashboardCard title="System Status" icon={<FaServer />} className="h-full">
                                <SystemMonitor />
                            </DashboardCard>
                        </div>
                    </div>

                    {/* ROW 1: Teknik Notlar - Loglar - Learning (Senin İstediğin Kısım) */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* SOL: Teknik Notlar (Dikey Liste) */}
                        <DashboardCard title="Teknik Notlar" icon={<FaBook />}>
                            <div className="flex flex-col gap-3">
                                {insights.map((item, idx) => (
                                    <div key={idx} className="p-3 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-blue-500/50 transition-colors group cursor-pointer">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className={`text-xs font-bold ${item.color}`}>{item.tag}</span>
                                            <FaArrowRight className="text-[10px] text-gray-500 group-hover:text-white transition-colors"/>
                                        </div>
                                        <h4 className="text-sm text-gray-200 font-medium group-hover:text-white">{item.title}</h4>
                                    </div>
                                ))}
                            </div>
                        </DashboardCard>

                        {/* ORTA: Live Network Logs */}
                        <DashboardCard title="Live Network Traffic" icon={<FaNetworkWired />}>
                            <TrafficLogs />
                        </DashboardCard>

                        {/* SAĞ: Learning Path */}
                        <DashboardCard title="Current Learning Path" icon={<FaCodeBranch />}>
                            <LearningPath />
                        </DashboardCard>
                    </div>

                    {/* ROW 2: Git Contributions (Tam Genişlik) */}
                    <div className="w-full">
                        <DashboardCard title="Git Contribution Activity" icon={<FaGithub />}>
                            <div className="flex items-center justify-center w-full overflow-x-auto">
                                <ActivityMap />
                            </div>
                        </DashboardCard>
                    </div>

                    {/* ROW 3: İletişim (Tam Genişlik) */}
                    <div className="w-full">
                        <div className="bg-gradient-to-r from-blue-900/40 to-slate-900 border border-blue-500/30 rounded-xl p-8 text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -z-10"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -z-10"></div>

                            <FaPaperPlane className="text-4xl text-blue-400 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-white mb-2">Birlikte Harika İşler Çıkaralım</h3>
                            <p className="text-gray-400 max-w-xl mx-auto mb-8">
                                Yönetim Bilişim Sistemleri vizyonu ve Full Stack teknik yeteneklerimle projelerinize değer katmaya hazırım.
                            </p>

                            <div className="flex justify-center gap-4">
                                <button className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-medium transition-all shadow-lg shadow-blue-600/20">
                                    Hemen İletişime Geç
                                </button>
                                <button className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-full font-medium transition-all border border-slate-700">
                                    linkedin.com/in/ben
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </div>
    );
};

export default Home;