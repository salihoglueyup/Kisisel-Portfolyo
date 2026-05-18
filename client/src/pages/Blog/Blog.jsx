// client/src/pages/Blog/Blog.jsx
import { useState } from 'react';
import { useBlogList } from '../../hooks/queries/useBlogs';
import { Link } from 'react-router-dom'; // Link bileşeni eklendi
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaSearch, FaClock, FaHashtag, FaArrowRight, FaRegNewspaper, FaFire,
    FaHeart, FaRegComment, FaBookmark, FaTag, FaLinkedin, FaGithub
} from 'react-icons/fa';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import SEO from '../../components/common/SEO';
import NewsletterForm from '../../components/common/NewsletterForm';
import { useTranslation } from 'react-i18next';
import { formatDate } from '../../utils/formatDate';

const Blog = () => {
    const { t } = useTranslation();
    
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };
    
    // --- STATE YÖNETİMİ ---
    const [activeCat, setActiveCat] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);

    // Kategori key → DB value eşleşmesi (i18n-safe)
    const categories = [
        { key: 'all', label: t('blog.all_categories'), value: 'all' },
        { key: 'tech', label: t('blog.cat_tech'), value: 'Teknoloji' },
        { key: 'career', label: t('blog.cat_career'), value: 'Kariyer' },
        { key: 'data', label: t('blog.cat_data'), value: 'Data' },
        { key: 'ybs', label: t('blog.cat_ybs'), value: 'YBS' },
        { key: 'personal', label: t('blog.cat_personal'), value: 'Kişisel Gelişim' },
    ];
    const popularTags = ['React', 'Node.js', 'YBS', 'Freelance', 'Data Science', 'Python'];

    const categoryValue = categories.find(c => c.key === activeCat)?.value || 'all';
    const isFiltering = !!searchTerm || activeCat !== 'all';

    // Server-side: arama / kategori / sayfalama
    const { data, isLoading: loading, error: queryError } = useBlogList({
        search: searchTerm,
        category: categoryValue,
        page,
        limit: 6
    });
    const posts = data?.posts || [];
    const pagination = data?.pagination || { page: 1, totalPages: 1, total: 0 };

    const error = queryError ? (queryError.friendlyMessage || queryError.message || 'Blog yazıları yüklenemedi.') : null;

    // Filtre/arama değişince ilk sayfaya dön
    const changeCategory = (key) => { setActiveCat(key); setPage(1); };
    const changeSearch = (val) => { setSearchTerm(val); setPage(1); };

    // --- ÖNE ÇIKAN YAZI (VİTRİN) — yalnız ilk sayfada ve filtre yokken ---
    const featuredPost = posts.find(p => p.featured) || posts[0];
    const showFeatured = !isFiltering && page === 1 && !!featuredPost;
    // Vitrin gösteriliyorsa aynı yazı alttaki listede tekrar etmesin
    const listPosts = showFeatured
        ? posts.filter(p => p._id !== featuredPost._id)
        : posts;


    return (
        <div className="min-h-screen bg-[#0B1120] pt-28 pb-20 px-6 font-sans text-gray-300">
            <SEO title={t('blog.title')} description={t('blog.subtitle')} />
            <div className="max-w-7xl mx-auto">

                {/* HEADER */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 border border-blue-500/30 rounded-full bg-blue-500/10 text-blue-400 text-xs font-mono">
                        <FaRegNewspaper /> DEV_BLOG_V1
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                        {t('blog.title')} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">{t('blog.subtitle')}</span>
                    </h1>
                </div>

                {/* YÜKLENİYOR DURUMU */}
                {loading && (
                    <div className="flex justify-center items-center h-64 mb-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                )}

                {/* HATA DURUMU */}
                {error && (
                    <div className="text-center p-6 bg-red-500/10 border border-red-500/20 rounded-xl mb-12 text-red-400">
                        {error}
                    </div>
                )}

                {/* --- VİTRİN BÖLÜMÜ (FEATURED POST) --- */}
                {!loading && !error && showFeatured && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-16 relative group rounded-3xl overflow-hidden border border-slate-800 bg-[#111827]"
                    >
                        <Link to={`/blog/${featuredPost._id}`} className="grid grid-cols-1 md:grid-cols-2 h-full md:h-[450px]">
                            <div className="relative h-64 md:h-full overflow-hidden">
                                <div className="absolute top-4 left-4 z-10">
                                    <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-lg animate-pulse">
                                        <FaFire /> {t('blog.hot_topic')}
                                    </span>
                                </div>
                                {/* Resim Yoksa Placeholder */}
                                {featuredPost.image ? (
                                    <img src={featuredPost.image} alt={featuredPost.title} decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-slate-800 to-black flex items-center justify-center text-6xl">📝</div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#111827] to-transparent md:bg-gradient-to-r"></div>
                            </div>
                            <div className="p-8 md:p-12 flex flex-col justify-center relative">
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>
                                <div className="flex items-center gap-4 mb-4 text-sm text-blue-400 font-mono font-bold">
                                    <span>{featuredPost.category}</span>
                                    <span className="text-gray-600">•</span>
                                    <span>{formatDate(featuredPost.createdAt)}</span>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors leading-tight">
                                    {featuredPost.title}
                                </h2>
                                <p className="text-gray-400 mb-8 line-clamp-3 text-lg">
                                    {featuredPost.excerpt}
                                </p>

                                <div className="flex items-center gap-6 text-gray-500 text-sm font-medium mt-auto">
                                    <div className="flex items-center gap-2"><FaHeart className="text-red-500" /> {featuredPost.views || 0} {t('blog.views')}</div>
                                    <div className="flex items-center gap-2 ml-auto text-white group-hover:translate-x-2 transition-transform">
                                        {t('blog.read_more')} <FaArrowRight />
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
                                    <button key={cat.key} aria-pressed={activeCat === cat.key} onClick={() => changeCategory(cat.key)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeCat === cat.key ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-400 hover:text-white hover:bg-slate-700'}`}>{cat.label}</button>
                                ))}
                            </div>
                            <div className="relative w-full md:w-48">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                <input type="text" aria-label={t('blog.search')} placeholder={t('blog.search')} value={searchTerm} onChange={(e) => changeSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-black/20 border border-slate-700 rounded-lg text-gray-200 text-sm focus:outline-none focus:border-blue-500" />
                            </div>
                        </div>

                        {/* Yazılar Grid */}
                        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
                            {!loading && listPosts.length === 0 && !showFeatured ? (
                                <div className="text-center py-20 border border-dashed border-slate-800 rounded-2xl">
                                    <h3 className="text-xl font-bold text-white">{t('blog.no_posts')}</h3>
                                </div>
                            ) : (
                                <AnimatePresence>
                                    {listPosts.map((post) => (
                                        <motion.div layout key={post._id} variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } }} exit={{ opacity: 0, scale: 0.9 }} className="group">
                                            {/* LİNK BİLEŞENİ: Tüm kartı kapsar */}
                                            <Link to={`/blog/${post._id}`} className="bg-[#111827] border border-slate-800 rounded-2xl p-6 hover:border-blue-500/30 transition-all flex flex-col md:flex-row gap-6 h-full">
                                                <div className="w-full md:w-48 h-48 rounded-xl overflow-hidden shrink-0 bg-slate-800">
                                                    {post.image ? (
                                                        <img src={post.image} alt={post.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-4xl">📝</div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col flex-1">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="text-blue-400 text-xs font-bold uppercase tracking-wider bg-blue-500/10 px-2 py-1 rounded">{post.category}</span>
                                                        <FaBookmark className="text-gray-600 hover:text-white transition-colors" />
                                                    </div>
                                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                                                        {post.title}
                                                    </h3>
                                                    <p className="text-gray-400 text-sm line-clamp-2 mb-4 flex-1">
                                                        {post.excerpt}
                                                    </p>

                                                    <div className="flex items-center justify-between text-xs text-gray-500 border-t border-slate-800 pt-4 mt-auto">
                                                        <div className="flex gap-4">
                                                            <span>{formatDate(post.createdAt)}</span>
                                                            <span className="flex items-center gap-1"><FaClock /> {post.readTime} {t('blog.min_read')}</span>
                                                        </div>
                                                        <div className="flex gap-3">
                                                            <span className="flex items-center gap-1 text-blue-400 font-bold group-hover:translate-x-1 transition-transform">{t('blog.read_more')} <FaArrowRight /></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </motion.div>

                        {/* SAYFALAMA */}
                        {!loading && !error && pagination.totalPages > 1 && (
                            <div className="flex items-center justify-center gap-4 mt-12">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={pagination.page <= 1}
                                    className="px-4 py-2 rounded-lg text-sm font-medium bg-[#1f2937] border border-slate-700 text-gray-300 hover:border-blue-500 hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    ← {t('blog.prev')}
                                </button>
                                <span className="text-sm text-gray-400 font-mono">
                                    {pagination.page} / {pagination.totalPages}
                                </span>
                                <button
                                    onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                                    disabled={pagination.page >= pagination.totalPages}
                                    className="px-4 py-2 rounded-lg text-sm font-medium bg-[#1f2937] border border-slate-700 text-gray-300 hover:border-blue-500 hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    {t('blog.next')} →
                                </button>
                            </div>
                        )}
                    </div>

                    {/* SAĞ: SIDEBAR (4 Birim) - Sticky */}
                    <div className="lg:col-span-4 space-y-8 hidden lg:block">

                        {/* Yazar Kartı */}
                        <div className="bg-[#1f2937] border border-slate-700 rounded-2xl p-6 text-center sticky top-28">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-1 mx-auto mb-4">
                                <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center overflow-hidden">
                                    <span className="text-4xl">👨‍💻</span>
                                </div>
                            </div>
                            <h3 className="text-white font-bold text-lg">Eyüp Zeki Salihoğlu</h3>
                            <p className="text-gray-400 text-sm mb-4">{t('blog.author_bio')}</p>
                            <div className="flex justify-center gap-3 mb-6">
                                <a href="https://www.linkedin.com/in/eyupzekisalihoglu/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profili" className="text-gray-400 hover:text-blue-500 transition-colors"><FaLinkedin /></a>
                                <a href="https://github.com/salihoglueyup" target="_blank" rel="noopener noreferrer" aria-label="GitHub profili" className="text-gray-400 hover:text-white transition-colors"><FaGithub /></a>
                            </div>
                            <a href="https://github.com/salihoglueyup" target="_blank" rel="noopener noreferrer" className="block w-full py-2 bg-white text-black font-bold rounded-lg text-sm hover:bg-gray-200 transition-colors text-center">{t('blog.follow')}</a>
                        </div>

                        {/* Popüler Etiketler */}
                        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
                            <h4 className="text-white font-bold mb-4 flex items-center gap-2"><FaTag className="text-blue-500" /> {t('blog.popular_tags')}</h4>
                            <div className="flex flex-wrap gap-2">
                                {popularTags.map(tag => (
                                    <span key={tag} className="text-xs text-gray-400 bg-slate-800 border border-slate-700 px-3 py-1 rounded-full hover:border-blue-500 hover:text-white cursor-pointer transition-all">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Mini Bülten */}
                        <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-2xl p-6">
                            <h4 className="text-white font-bold mb-2">{t('blog.newsletter_title')}</h4>
                            <p className="text-xs text-gray-400 mb-4">{t('blog.newsletter_desc')}</p>
                            <NewsletterForm variant="compact" />
                        </div>

                    </div>

                </div>

                {/* NEWSLETTER (Mobil için de görünür) */}
                <div className="mt-24 bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px]"></div>
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-600/20 rounded-full blur-[100px]"></div>

                    <div className="relative z-10 max-w-2xl mx-auto">
                        <FaHashtag className="text-4xl text-gray-600 mx-auto mb-4" />
                        <h2 className="text-3xl font-bold text-white mb-4">{t('blog.community_title')}</h2>
                        <p className="text-gray-400 mb-8">{t('blog.community_desc')}</p>
                        <NewsletterForm variant="inline" />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Blog;