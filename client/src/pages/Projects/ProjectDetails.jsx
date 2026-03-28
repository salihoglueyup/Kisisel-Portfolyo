// client/src/pages/Projects/ProjectDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaArrowLeft, FaCode, FaDatabase, FaServer, FaLayerGroup, FaCalendarAlt } from 'react-icons/fa';

const ProjectDetails = () => {
    const { id } = useParams(); // URL'den ID'yi al
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview'); // Tab kontrolü

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await api.get(`/projects/${id}`);
                setProject(res.data);
                setLoading(false);
            } catch (error) {
                console.error("Hata:", error);
                setLoading(false);
            }
        };
        fetchProject();
    }, [id]);

    if (loading) return <div className="min-h-screen bg-[#0B1120] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>;
    if (!project) return <div className="min-h-screen bg-[#0B1120] flex items-center justify-center text-white">Proje Bulunamadı.</div>;

    return (
        <div className="min-h-screen bg-[#0B1120] pt-24 pb-20 px-6 font-sans text-gray-300">

            {/* 1. ÜST NAVİGASYON */}
            <div className="max-w-6xl mx-auto mb-8">
                <Link to="/projects" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors mb-6">
                    <FaArrowLeft /> Projelere Dön
                </Link>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto"
            >
                {/* 2. HERO BÖLÜMÜ (Başlık & Görsel) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    <div className="flex flex-col justify-center">
                        <div className="flex flex-wrap gap-2 mb-4">
                            {project.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-bold border border-blue-500/20">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">{project.title}</h1>
                        <p className="text-lg text-gray-400 mb-8">{project.description}</p>

                        <div className="flex gap-4">
                            {project.links?.github && (
                                <a href={project.links.github} target="_blank" className="px-6 py-3 bg-[#1f2937] text-white rounded-lg flex items-center gap-2 hover:bg-[#374151] transition-all border border-slate-700">
                                    <FaGithub /> Kaynak Kod
                                </a>
                            )}
                            {project.links?.live && (
                                <a href={project.links.live} target="_blank" className="px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20">
                                    <FaExternalLinkAlt /> Canlı Demo
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

                {/* 3. İSTATİSTİK ŞERİDİ (YBS METRİKLERİ) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 border-y border-slate-800 py-8">
                    <div className="text-center border-r border-slate-800 last:border-0">
                        <span className="block text-3xl font-bold text-white mb-1">{project.metrics?.complexity}/10</span>
                        <span className="text-xs text-gray-500 uppercase tracking-wider">Karmaşıklık</span>
                    </div>
                    <div className="text-center border-r border-slate-800 last:border-0">
                        <span className="block text-3xl font-bold text-white mb-1">{project.metrics?.hoursSpent}h</span>
                        <span className="text-xs text-gray-500 uppercase tracking-wider">Geliştirme Süresi</span>
                    </div>
                    <div className="text-center border-r border-slate-800 last:border-0">
                        <span className="block text-3xl font-bold text-white mb-1">{project.metrics?.linesOfCode}</span>
                        <span className="text-xs text-gray-500 uppercase tracking-wider">Satır Kod</span>
                    </div>
                    <div className="text-center">
                        <span className="block text-3xl font-bold text-white mb-1 flex justify-center items-center gap-2"><FaCalendarAlt className="text-sm text-blue-500" /> 2025</span>
                        <span className="text-xs text-gray-500 uppercase tracking-wider">Yıl</span>
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
                                    {tab === 'overview' && 'Genel Bakış'}
                                    {tab === 'technical' && 'Teknik Mimari'}
                                    {tab === 'challenges' && 'Zorluklar & Çözümler'}
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
                                    <h3 className="text-xl font-bold text-white">Proje Hakkında</h3>
                                    <p className="leading-relaxed">
                                        {project.description} <br /><br />
                                        Bu proje, modern web geliştirme standartlarına uygun olarak tasarlanmıştır.
                                        Kullanıcı deneyimini (UX) ön planda tutarken, arka planda güvenli ve ölçeklenebilir bir yapı kurulmuştur.
                                    </p>
                                    <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                                        <h4 className="font-bold text-white mb-2">🚀 Ana Özellikler</h4>
                                        <ul className="list-disc list-inside space-y-2 text-gray-400">
                                            <li>Responsive (Mobil Uyumlu) Tasarım</li>
                                            <li>RESTful API Entegrasyonu</li>
                                            <li>Admin Yönetim Paneli</li>
                                            <li>Gerçek Zamanlı Veri Akışı</li>
                                        </ul>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'technical' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                    <h3 className="text-xl font-bold text-white">Teknik Altyapı</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-4 border border-slate-800 rounded-xl">
                                            <div className="flex items-center gap-3 mb-3 text-blue-400"><FaCode size={24} /> <span className="font-bold">Frontend</span></div>
                                            <p className="text-sm">React.js, Tailwind CSS, Framer Motion kullanılarak dinamik ve hızlı bir arayüz oluşturuldu.</p>
                                        </div>
                                        <div className="p-4 border border-slate-800 rounded-xl">
                                            <div className="flex items-center gap-3 mb-3 text-green-400"><FaServer size={24} /> <span className="font-bold">Backend</span></div>
                                            <p className="text-sm">Node.js ve Express.js ile REST API mimarisi kuruldu. JWT ile güvenlik sağlandı.</p>
                                        </div>
                                        <div className="p-4 border border-slate-800 rounded-xl">
                                            <div className="flex items-center gap-3 mb-3 text-yellow-400"><FaDatabase size={24} /> <span className="font-bold">Database</span></div>
                                            <p className="text-sm">MongoDB kullanılarak esnek ve performanslı NoSQL veri yapısı oluşturuldu.</p>
                                        </div>
                                        <div className="p-4 border border-slate-800 rounded-xl">
                                            <div className="flex items-center gap-3 mb-3 text-purple-400"><FaLayerGroup size={24} /> <span className="font-bold">DevOps</span></div>
                                            <p className="text-sm">Git versiyon kontrolü ve Vercel/Render üzerinde deployment süreçleri yönetildi.</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'challenges' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                    <h3 className="text-xl font-bold text-white">Karşılaşılan Sorunlar ve Çözümler</h3>
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
                            <h3 className="text-lg font-bold text-white mb-4">Proje Künyesi</h3>
                            <div className="space-y-4 text-sm">
                                <div className="flex justify-between border-b border-slate-800 pb-2">
                                    <span className="text-gray-500">Kategori</span>
                                    <span className="text-white font-medium">{project.tags[0]}</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-800 pb-2">
                                    <span className="text-gray-500">Müşteri / Tip</span>
                                    <span className="text-white font-medium">Kişisel Proje</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-800 pb-2">
                                    <span className="text-gray-500">Durum</span>
                                    <span className="text-green-400 font-medium flex items-center gap-1"><span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Tamamlandı</span>
                                </div>

                                <div className="pt-4">
                                    <h4 className="text-gray-500 mb-2">Kullanılan Teknolojiler</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tags.map(t => (
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