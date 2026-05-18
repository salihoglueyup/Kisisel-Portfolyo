// client/src/pages/Blog/BlogDetails.jsx
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaClock, FaCalendarAlt, FaLinkedin, FaTwitter, FaLink } from 'react-icons/fa';
import toast from 'react-hot-toast';
import SEO from '../../components/common/SEO';
import { useBlog } from '../../hooks/queries/useBlogs';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { formatDate } from '../../utils/formatDate';

const BlogDetails = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const { data: blog, isLoading: loading } = useBlog(id);

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            toast.success(t('blogDetails.share_copied'));
        } catch {
            toast.error(t('blogDetails.share_failed'));
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-base pt-32 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
    );

    if (!blog) return (
        <div className="min-h-screen bg-base pt-32 text-center text-white">
            <p className="text-gray-400">{t('blogDetails.not_found')}</p>
            <Link to="/blog" className="text-blue-400 hover:underline mt-4 inline-block">← {t('blogDetails.back_short')}</Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-base pt-28 pb-20 px-6">
            <SEO
                title={blog.title}
                description={blog.excerpt}
                type="article"
                image={blog.image || undefined}
                schema={{
                    '@context': 'https://schema.org',
                    '@type': 'BlogPosting',
                    headline: blog.title,
                    description: blog.excerpt,
                    image: blog.image || undefined,
                    datePublished: blog.createdAt,
                    dateModified: blog.updatedAt || blog.createdAt,
                    articleSection: blog.category,
                    author: { '@type': 'Person', name: 'Eyüp Zeki Salihoğlu' },
                    publisher: { '@type': 'Organization', name: 'Eyüp Zeki Salihoğlu' }
                }}
            />
            <div className="max-w-3xl mx-auto">

                <Link to="/blog" className="text-gray-400 hover:text-white flex items-center gap-2 mb-8 transition-colors">
                    <FaArrowLeft /> {t('blogDetails.back')}
                </Link>

                {/* Meta Veriler */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-blue-400 font-mono font-bold mb-6">
                    <span className="bg-blue-500/10 px-3 py-1 rounded-full">{blog.category}</span>
                    <span className="text-gray-500 flex items-center gap-2"><FaClock /> {blog.readTime}</span>
                    <span className="text-gray-500 flex items-center gap-2"><FaCalendarAlt /> {formatDate(blog.createdAt)}</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">{blog.title}</h1>

                {blog.image && (
                    <div className="w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-10 border border-slate-800">
                        <img src={blog.image} alt={blog.title} decoding="async" className="w-full h-full object-cover" />
                    </div>
                )}

                {/* İçerik Alanı */}
                <div className="prose prose-invert prose-lg max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{blog.content}</ReactMarkdown>
                </div>

                {/* Paylaş */}
                <div className="mt-16 pt-8 border-t border-slate-800 flex flex-wrap items-center gap-3">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mr-1">{t('blogDetails.share')}</span>
                    <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                        target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                        className="w-9 h-9 rounded-lg bg-surface border border-slate-800 flex items-center justify-center text-gray-400 hover:text-blue-400 hover:border-blue-500/40 transition-all"
                    ><FaLinkedin /></a>
                    <a
                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(blog.title)}`}
                        target="_blank" rel="noopener noreferrer" aria-label="X / Twitter"
                        className="w-9 h-9 rounded-lg bg-surface border border-slate-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-slate-500 transition-all"
                    ><FaTwitter /></a>
                    <button
                        type="button" onClick={copyLink} aria-label={t('blogDetails.share_copy')}
                        className="w-9 h-9 rounded-lg bg-surface border border-slate-800 flex items-center justify-center text-gray-400 hover:text-blue-400 hover:border-blue-500/40 transition-all"
                    ><FaLink /></button>
                </div>

                {/* Yazar Kutusu */}
                <div className="mt-10 pt-8 border-t border-slate-800 flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-xl font-bold text-white">EZ</span>
                    </div>
                    <div>
                        <h4 className="text-white font-bold">Eyüp Zeki Salihoğlu</h4>
                        <p className="text-sm text-gray-500">{t('blogDetails.author_note')}</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default BlogDetails;