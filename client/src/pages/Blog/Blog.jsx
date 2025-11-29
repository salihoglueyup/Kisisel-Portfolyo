// client/src/pages/Blog/Blog.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Link bileşeni eklendi
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaSearch, FaClock, FaHashtag, FaArrowRight, FaRegNewspaper, FaFire,
    FaHeart, FaRegComment, FaBookmark, FaTag, FaTwitter, FaLinkedin, FaGithub
} from 'react-icons/fa';

const Blog = () => {
    // --- STATE YÖNETİMİ ---
    const [posts, setPosts] = useState([]); // Veritabanından gelen yazılar
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [activeCat, setActiveCat] = useState('Tümü');
    const [searchTerm, setSearchTerm] = useState('');

    const categories = ['Tümü', 'Teknoloji', 'Kariyer', 'Data', 'YBS', 'Kişisel Gelişim'];
    const popularTags = ['React', 'Node.js', 'YBS', 'Freelance', 'Data Science', 'Python'];

    // --- 1. VERİLERİ BACKEND'DEN ÇEK ---
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/blogs');
                setPosts(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Blog verisi çekilemedi:", err);
                setError("Yazılar yüklenirken bir sorun oluştu.");
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    // --- 2. FİLTRELEME MANTIĞI ---
    const filteredPosts = posts.filter(post => {
        const matchCat = activeCat === 'Tümü' || post.category === activeCat;
        const matchSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchCat && matchSearch;
    });

    // --- 3. ÖNE ÇIKAN YAZI (VİTRİN) ---
    // Eğer veritabanında "featured: true" olan varsa onu al, yoksa en son ekleneni al.
    const featuredPost = posts.find(p => p.featured) || posts[0];

    // Tarih Formatlayıcı Yardımcı Fonksiyon
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <div className="min-h-screen bg-[#0B1120] pt-28 pb-20 px-6 font-sans text-gray-300">
            <div className="max-w-7xl mx-auto">

                {/* HEADER */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 border border-pink-500/30 rounded-full bg-pink-500/10 text-pink-400 text-xs font-mono">
                        <FaRegNewspaper /> DEV_BLOG_V1
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                        Teknik Notlar & <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">Dijital Günlük.</span>
                    </h1>
                </div>

                {/* YÜKLENİYOR DURUMU */}
                {loading && (
                    <div className="flex justify-center items-center h-64 mb-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
                    </div>
                )}

                {/* HATA DURUMU */}
                {error && (
                    <div className="text-center p-6 bg-red-500/10 border border-red-500/20 rounded-xl mb-12 text-red-400">
                        {error}
                    </div>
                )}

                {/* --- VİTRİN BÖLÜMÜ (FEATURED POST) --- */}
                {!loading && !error && featuredPost && !searchTerm && activeCat === 'Tümü' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-16 relative group rounded-3xl overflow-hidden border border-slate-800 bg-[#111827]"
                    >
                        <Link to={`/blog/${featuredPost._id}`} className="grid grid-cols-1 md:grid-cols-2 h-full md:h-[450px]">
                            <div className="relative h-64 md:h-full overflow-hidden">
                                <div className="absolute top-4 left-4 z-10">
                            <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-lg animate-pulse">
                                <FaFire /> HOT TOPIC
                            </span>
                                </div>
                                {/* Resim Yoksa Placeholder */}
                                {featuredPost.image ? (
                                    <img src={featuredPost.image} alt="Featured" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-slate-800 to-black flex items-center justify-center text-6xl">📝</div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#111827] to-transparent md:bg-gradient-to-r"></div>
                            </div>
                            <div className="p-8 md:p-12 flex flex-col justify-center relative">
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-500/20 rounded-full blur-3xl"></div>
                                <div className="flex items-center gap-4 mb-4 text-sm text-pink-400 font-mono font-bold">
                                    <span>{featuredPost.category}</span>
                                    <span className="text-gray-600">•</span>
                                    <span>{formatDate(featuredPost.createdAt)}</span>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 group-hover:text-pink-400 transition-colors leading-tight">
                                    {featuredPost.title}
                                </h2>
                                <p className="text-gray-400 mb-8 line-clamp-3 text-lg">
                                    {featuredPost.excerpt}
                                </p>

                                <div className="flex items-center gap-6 text-gray-500 text-sm font-medium mt-auto">
                                    <div className="flex items-center gap-2"><FaHeart className="text-red-500" /> {featuredPost.views || 0} Okunma</div>
                                    <div className="flex items-center gap-2 ml-auto text-white group-hover:translate-x-2 transition-transform">
                                        Devamını Oku <FaArrowRight />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                )}

                {/* --- ANA İÇERİK ALANI --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* SOL: MAKALE LİSTESİ (8 Birim) */}
                    <div className="lg:col-span-8">

                        {/* Filtre Bar */}
                        <div className="flex flex-wrap gap-4 mb-8 items-center justify-between bg-[#1f2937]/50 p-2 rounded-xl border border-slate-800">
                            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                                {categories.map(cat => (
                                    <button key={cat} onClick={() => setActiveCat(cat)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeCat === cat ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/20' : 'text-gray-400 hover:text-white hover:bg-slate-700'}`}>{cat}</button>
                                ))}
                            </div>
                            <div className="relative w-full md:w-48">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                <input type="text" placeholder="Ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-black/20 border border-slate-700 rounded-lg text-gray-200 text-sm focus:outline-none focus:border-pink-500" />
                            </div>
                        </div>

                        {/* Yazılar Grid */}
                        <div className="space-y-8">
                            {!loading && filteredPosts.length === 0 ? (
                                <div className="text-center py-20 border border-dashed border-slate-800 rounded-2xl">
                                    <h3 className="text-xl font-bold text-white">Henüz yazı yok.</h3>
                                    <p className="text-gray-500">Admin panelinden yeni içerik ekleyebilirsiniz.</p>
                                </div>
                            ) : (
                                <AnimatePresence>
                                    {filteredPosts.map((post) => (
                                        <motion.div layout key={post._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="group">
                                            {/* LİNK BİLEŞENİ: Tüm kartı kapsar */}
                                            <Link to={`/blog/${post._id}`} className="bg-[#111827] border border-slate-800 rounded-2xl p-6 hover:border-pink-500/30 transition-all flex flex-col md:flex-row gap-6 h-full">
                                                <div className="w-full md:w-48 h-48 rounded-xl overflow-hidden shrink-0 bg-slate-800">
                                                    {post.image ? (
                                                        <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-4xl">📝</div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col flex-1">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="text-pink-400 text-xs font-bold uppercase tracking-wider bg-pink-500/10 px-2 py-1 rounded">{post.category}</span>
                                                        <FaBookmark className="text-gray-600 hover:text-white transition-colors" />
                                                    </div>
                                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-pink-400 transition-colors line-clamp-2">
                                                        {post.title}
                                                    </h3>
                                                    <p className="text-gray-400 text-sm line-clamp-2 mb-4 flex-1">
                                                        {post.excerpt}
                                                    </p>

                                                    <div className="flex items-center justify-between text-xs text-gray-500 border-t border-slate-800 pt-4 mt-auto">
                                                        <div className="flex gap-4">
                                                            <span>{formatDate(post.createdAt)}</span>
                                                            <span className="flex items-center gap-1"><FaClock /> {post.readTime}</span>
                                                        </div>
                                                        <div className="flex gap-3">
                                                            <span className="flex items-center gap-1 text-blue-400 font-bold group-hover:translate-x-1 transition-transform">İncele <FaArrowRight /></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>
                    </div>

                    {/* SAĞ: SIDEBAR (4 Birim) - Sticky */}
                    <div className="lg:col-span-4 space-y-8 hidden lg:block">

                        {/* Yazar Kartı */}
                        <div className="bg-[#1f2937] border border-slate-700 rounded-2xl p-6 text-center sticky top-28">
                            <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full p-1 mx-auto mb-4">
                                <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center overflow-hidden">
                                    <span className="text-4xl">👨‍💻</span>
                                </div>
                            </div>
                            <h3 className="text-white font-bold text-lg">YBS Geliştirici</h3>
                            <p className="text-gray-400 text-sm mb-4">Teknoloji, iş dünyası ve kodlama üzerine deneyimlerimi paylaşıyorum.</p>
                            <div className="flex justify-center gap-3 mb-6">
                                <FaTwitter className="text-gray-400 hover:text-blue-400 cursor-pointer" />
                                <FaLinkedin className="text-gray-400 hover:text-blue-600 cursor-pointer" />
                                <FaGithub className="text-gray-400 hover:text-white cursor-pointer" />
                            </div>
                            <button className="w-full py-2 bg-white text-black font-bold rounded-lg text-sm hover:bg-gray-200 transition-colors">Takip Et</button>
                        </div>

                        {/* Popüler Etiketler */}
                        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
                            <h4 className="text-white font-bold mb-4 flex items-center gap-2"><FaTag className="text-pink-500"/> Popüler Etiketler</h4>
                            <div className="flex flex-wrap gap-2">
                                {popularTags.map(tag => (
                                    <span key={tag} className="text-xs text-gray-400 bg-slate-800 border border-slate-700 px-3 py-1 rounded-full hover:border-pink-500 hover:text-white cursor-pointer transition-all">
                                #{tag}
                            </span>
                                ))}
                            </div>
                        </div>

                        {/* Mini Bülten */}
                        <div className="bg-gradient-to-br from-pink-900/20 to-purple-900/20 border border-pink-500/30 rounded-2xl p-6">
                            <h4 className="text-white font-bold mb-2">Bültene Katıl</h4>
                            <p className="text-xs text-gray-400 mb-4">Her hafta yeni yazılar e-postana gelsin.</p>
                            <input type="email" placeholder="Email adresi" className="w-full bg-black/30 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white mb-2 focus:border-pink-500 outline-none" />
                            <button className="w-full py-2 bg-pink-600 hover:bg-pink-500 text-white text-sm font-bold rounded-lg transition-colors">Abone Ol</button>
                        </div>

                    </div>

                </div>

                {/* NEWSLETTER (Mobil için de görünür) */}
                <div className="mt-24 bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-pink-600/20 rounded-full blur-[100px]"></div>
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px]"></div>

                    <div className="relative z-10 max-w-2xl mx-auto">
                        <FaHashtag className="text-4xl text-gray-600 mx-auto mb-4" />
                        <h2 className="text-3xl font-bold text-white mb-4">Topluluğa Katıl</h2>
                        <p className="text-gray-400 mb-8">YBS dünyasından en güncel haberler için bültene katılın.</p>
                        <form className="flex flex-col sm:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
                            <input type="email" placeholder="E-posta adresiniz" className="flex-1 px-6 py-4 bg-black/30 border border-slate-600 rounded-xl text-white focus:border-pink-500 outline-none backdrop-blur-sm"/>
                            <button className="px-8 py-4 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-pink-600/25">Abone Ol</button>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Blog;