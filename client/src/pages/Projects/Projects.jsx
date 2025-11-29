import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaCode, FaClock, FaLayerGroup, FaStar, FaArrowRight, FaChartPie, FaThLarge, FaList } from 'react-icons/fa';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Link } from 'react-router-dom';
import ProjectCard from '../../components/project/ProjectCard';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filtre ve Görünüm State'leri
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' veya 'list'

    const categories = ['All', 'React', 'Node.js', 'Python', 'Data Analysis', 'Mobile', '.NET'];

    // API'den Veri Çekme
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/projects');
                setProjects(res.data);
                setFilteredProjects(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Hata:", err);
                setError('Veri çekilemedi. Backend bağlantısını kontrol et.');
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    // Filtreleme Mantığı
    useEffect(() => {
        let result = projects;
        if (activeFilter !== 'All') {
            result = result.filter(project => project.tags.some(tag => tag.toLowerCase() === activeFilter.toLowerCase()));
        }
        if (searchTerm) {
            result = result.filter(project =>
                project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredProjects(result);
    }, [searchTerm, activeFilter, projects]);

    // --- 1. ANALİTİK HESAPLAMALARI ---
    const stats = useMemo(() => {
        if (!projects.length) return null;

        const totalHours = projects.reduce((acc, curr) => acc + (curr.metrics?.hoursSpent || 0), 0);
        const totalLines = projects.reduce((acc, curr) => acc + (curr.metrics?.linesOfCode || 0), 0);
        const avgComplexity = (projects.reduce((acc, curr) => acc + (curr.metrics?.complexity || 0), 0) / projects.length).toFixed(1);

        // Tech Stack Chart Data
        const tagCounts = {};
        projects.forEach(p => {
            p.tags.forEach(tag => { tagCounts[tag] = (tagCounts[tag] || 0) + 1; });
        });
        const chartData = Object.keys(tagCounts)
            .map(key => ({ name: key, count: tagCounts[key] }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        return { totalHours, totalLines, avgComplexity, chartData };
    }, [projects]);

    // --- 2. VİTRİN PROJESİ (En karmaşık olan) ---
    const featuredProject = useMemo(() => {
        if(!projects.length) return null;
        return projects.reduce((prev, current) => (prev.metrics?.complexity > current.metrics?.complexity) ? prev : current);
    }, [projects]);

    return (
        <div className="min-h-screen bg-[#0B1120] pt-28 pb-20 px-6 overflow-x-hidden">
            <div className="max-w-7xl mx-auto">

                {/* HEADER */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 border border-purple-500/30 rounded-full bg-purple-500/10 text-purple-400 text-xs font-mono">
                        <FaCode className="animate-pulse"/> PORTFOLIO_V2_BUILD
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                        Dijital <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">İmzam.</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Problemleri algoritmalarla, fikirleri kodlarla çözüyorum. İşte teorinin pratiğe dönüştüğü laboratuvarım.
                    </p>
                </div>

                {/* --- BÖLÜM 1: DASHBOARD --- */}
                {!loading && stats && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
                        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-[#111827] border border-slate-800 p-6 rounded-2xl flex flex-col items-center text-center hover:border-blue-500/30 transition-colors group">
                                <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400 text-2xl mb-3 group-hover:scale-110 transition-transform"><FaClock /></div>
                                <h3 className="text-3xl font-bold text-white">{stats.totalHours}+</h3>
                                <p className="text-xs text-gray-400 uppercase mt-1">Geliştirme Saati</p>
                            </div>
                            <div className="bg-[#111827] border border-slate-800 p-6 rounded-2xl flex flex-col items-center text-center hover:border-purple-500/30 transition-colors group">
                                <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-400 text-2xl mb-3 group-hover:scale-110 transition-transform"><FaCode /></div>
                                <h3 className="text-3xl font-bold text-white">{(stats.totalLines / 1000).toFixed(1)}k+</h3>
                                <p className="text-xs text-gray-400 uppercase mt-1">Satır Kod</p>
                            </div>
                            <div className="bg-[#111827] border border-slate-800 p-6 rounded-2xl flex flex-col items-center text-center hover:border-green-500/30 transition-colors group">
                                <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center text-green-400 text-2xl mb-3 group-hover:scale-110 transition-transform"><FaLayerGroup /></div>
                                <h3 className="text-3xl font-bold text-white">{stats.avgComplexity}/10</h3>
                                <p className="text-xs text-gray-400 uppercase mt-1">Ort. Karmaşıklık</p>
                            </div>
                        </div>

                        <div className="bg-[#111827] border border-slate-800 p-6 rounded-2xl flex flex-col">
                            <h4 className="text-sm text-gray-400 font-bold uppercase mb-4 flex items-center gap-2"><FaChartPie /> Teknoloji Dağılımı</h4>
                            <div className="flex-1 w-full h-32">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats.chartData}>
                                        <XAxis dataKey="name" hide />
                                        <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                            {stats.chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'][index % 5]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* --- BÖLÜM 2: FEATURED PROJECT --- */}
                {!loading && featuredProject && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="mb-20 relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                        <div className="relative bg-[#111827] border border-slate-800 rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
                            <div className="h-64 md:h-auto bg-slate-900 relative overflow-hidden">
                                <div className="absolute top-4 left-4 z-10">
                                    <span className="px-3 py-1 bg-yellow-500 text-black text-xs font-bold rounded-full flex items-center gap-1 shadow-lg"><FaStar /> FEATURED PROJECT</span>
                                </div>
                                {featuredProject.image ? (
                                    <img src={featuredProject.image} alt="Featured" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900"><FaCode className="text-8xl text-slate-700" /></div>
                                )}
                            </div>
                            <div className="p-8 md:p-12 flex flex-col justify-center">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {featuredProject.tags.map(t => <span key={t} className="text-xs font-mono text-blue-400 bg-blue-400/10 px-2 py-1 rounded">{t}</span>)}
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{featuredProject.title}</h2>
                                <p className="text-gray-400 text-lg mb-8 line-clamp-3">{featuredProject.description}</p>

                                <div className="grid grid-cols-3 gap-4 mb-8 border-t border-slate-800 pt-6">
                                    <div><span className="block text-2xl font-bold text-white">{featuredProject.metrics?.complexity}/10</span><span className="text-xs text-gray-500">Complexity</span></div>
                                    <div><span className="block text-2xl font-bold text-white">{featuredProject.metrics?.hoursSpent}h</span><span className="text-xs text-gray-500">Development</span></div>
                                    <div><span className="block text-2xl font-bold text-white">Backend</span><span className="text-xs text-gray-500">Architecture</span></div>
                                </div>

                                <Link to={`/projects/${featuredProject._id}`} className="w-max px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-colors flex items-center gap-2">
                                    Vaka Analizini İncele <FaArrowRight />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* --- BÖLÜM 3: METODOLOJİ --- */}
                <div className="mb-20 border-y border-slate-800 py-12 bg-[#111827]/30">
                    <div className="text-center mb-10">
                        <h3 className="text-2xl font-bold text-white">Geliştirme Sürecim</h3>
                        <p className="text-sm text-gray-400">Agile & Veri Odaklı Yaklaşım</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 px-4">
                        {[
                            { step: "01", title: "Analiz", desc: "Gereksinim & Veri Modelleme" },
                            { step: "02", title: "Mimari", desc: "DB Şeması & API Tasarımı" },
                            { step: "03", title: "Kodlama", desc: "Clean Code & Test Driven" },
                            { step: "04", title: "Deploy", desc: "CI/CD & Cloud Integration" },
                        ].map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center text-center group">
                                <div className="w-16 h-16 rounded-full border-2 border-slate-700 flex items-center justify-center text-xl font-bold text-gray-500 mb-4 group-hover:border-blue-500 group-hover:text-blue-400 transition-all bg-[#0B1120]">{item.step}</div>
                                <h4 className="text-white font-bold mb-1">{item.title}</h4>
                                <p className="text-xs text-gray-500 max-w-[120px]">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- BÖLÜM 4: KONTROL VE LİSTE --- */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8 sticky top-24 z-30 bg-[#0B1120]/90 backdrop-blur-md py-4 border-b border-slate-800">
                    <div className="flex flex-col gap-2 w-full md:w-auto">
                        <span className="text-xs text-gray-500 font-bold uppercase ml-1">Kategoriye Göre Filtrele</span>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <button key={cat} onClick={() => setActiveFilter(cat)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${activeFilter === cat ? 'bg-blue-600 border-blue-500 text-white' : 'bg-[#1f2937] border-slate-700 text-gray-400 hover:border-gray-500'}`}>
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        {/* Search */}
                        <div className="relative w-full md:w-64">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                            <input type="text" placeholder="Proje ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-[#1f2937] border border-slate-700 rounded-lg text-gray-200 focus:outline-none focus:border-blue-500 transition-all" />
                        </div>
                        {/* View Toggle */}
                        <div className="flex bg-[#1f2937] rounded-lg p-1 border border-slate-700 shrink-0">
                            <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-slate-700 text-white' : 'text-gray-400 hover:text-white'}`}><FaThLarge /></button>
                            <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-slate-700 text-white' : 'text-gray-400 hover:text-white'}`}><FaList /></button>
                        </div>
                    </div>
                </div>

                {/* PROJE GRID/LIST */}
                {loading ? (
                    <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>
                ) : error ? (
                    <div className="text-center py-12 bg-red-500/10 border border-red-500/20 rounded-2xl"><p className="text-red-400">{error}</p></div>
                ) : (
                    <motion.div layout className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                        <AnimatePresence>
                            {filteredProjects.map((project) => (
                                <ProjectCard key={project._id} project={project} />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

                {!loading && !error && filteredProjects.length === 0 && (
                    <div className="text-center py-20 border border-dashed border-slate-800 rounded-2xl">
                        <div className="text-4xl mb-4 text-gray-600">📭</div>
                        <h3 className="text-xl font-bold text-white mb-2">Proje Bulunamadı</h3>
                        <p className="text-gray-500">Arama kriterlerini değiştirerek tekrar deneyin.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Projects;