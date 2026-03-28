import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaHome, FaProjectDiagram, FaUser, FaEnvelope, FaPenNib, FaArrowRight, FaSignInAlt } from 'react-icons/fa';
import { useProjects } from '../../hooks/queries/useProjects';
import { useBlogs } from '../../hooks/queries/useBlogs';

const CommandPalette = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    const inputRef = useRef(null);

    // Fetch data for live search (React Query will cache this)
    const { data: projects = [] } = useProjects();
    const { data: blogs = [] } = useBlogs();

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
            setSearch(''); // Reset search on open
        }
    }, [isOpen]);

    const handleSelect = (path) => {
        navigate(path);
        setIsOpen(false);
    };

    // --- Search Logic ---
    const staticRoutes = [
        { id: '1', title: 'Ana Sayfa', path: '/', icon: <FaHome />, type: 'Sayfa' },
        { id: '2', title: 'Projeler', path: '/projects', icon: <FaProjectDiagram />, type: 'Sayfa' },
        { id: '3', title: 'Blog', path: '/blog', icon: <FaPenNib />, type: 'Sayfa' },
        { id: '4', title: 'Hakkımda', path: '/about', icon: <FaUser />, type: 'Sayfa' },
        { id: '5', title: 'İletişim', path: '/contact', icon: <FaEnvelope />, type: 'Sayfa' },
        { id: '6', title: 'Admin Girişi', path: '/admin/login', icon: <FaSignInAlt />, type: 'Sistem' }
    ];

    const safeProjects = Array.isArray(projects) ? projects : (projects?.data || []);
    const projectRoutes = safeProjects.map(p => ({
        id: `p-${p._id}`,
        title: p.title,
        path: `/projects/${p._id}`,
        icon: <FaProjectDiagram className="text-blue-500" />,
        type: 'Proje'
    }));

    const safeBlogs = Array.isArray(blogs) ? blogs : (blogs?.data || []);
    const blogRoutes = safeBlogs.map(b => ({
        id: `b-${b._id}`,
        title: b.title,
        path: `/blog/${b._id}`,
        icon: <FaPenNib className="text-pink-500" />,
        type: 'Makale'
    }));

    const allItems = [...staticRoutes, ...projectRoutes, ...blogRoutes];

    const filteredItems = allItems.filter(item => 
        item.title.toLowerCase().includes(search.toLowerCase()) || 
        item.type.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 8); // Max 8 results to prevent overflow

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        onClick={() => setIsOpen(false)} 
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: -20 }} 
                        animate={{ opacity: 1, scale: 1, y: 0 }} 
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.15 }}
                        className="relative w-full max-w-2xl bg-[#111827] border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden mx-4"
                    >
                        {/* Search Input */}
                        <div className="relative flex items-center px-4 border-b border-slate-700/60">
                            <FaSearch className="text-slate-400 text-lg mr-3" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Komut, sayfa veya proje ara..."
                                className="w-full bg-transparent text-white placeholder-slate-500 p-4 outline-none text-lg"
                            />
                            <div className="flex gap-1">
                                <span className="bg-slate-800 text-slate-400 text-xs px-2 py-1 rounded border border-slate-700">ESC</span>
                            </div>
                        </div>

                        {/* Results */}
                        <div className="max-h-[60vh] overflow-y-auto p-2 no-scrollbar">
                            {filteredItems.length === 0 ? (
                                <div className="text-center py-8 text-slate-500">
                                    <p>Sonuç bulunamadı.</p>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {filteredItems.map((item, idx) => (
                                        <button
                                            key={item.id}
                                            onClick={() => handleSelect(item.path)}
                                            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/80 hover:text-white text-slate-300 transition-colors group text-left"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-[#1f2937] group-hover:text-white transition-colors">
                                                    {item.icon}
                                                </div>
                                                <span className="font-medium group-hover:text-blue-400 transition-colors">{item.title}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs font-bold uppercase text-slate-500 group-hover:text-slate-400">{item.type}</span>
                                                <FaArrowRight className="text-slate-600 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        {/* Footer */}
                        <div className="bg-slate-900 border-t border-slate-800 p-3 flex items-center justify-between text-xs text-slate-500">
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1"><span className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">↑</span><span className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">↓</span> Gezinmek için</span>
                                <span className="flex items-center gap-1"><span className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">↵</span> Seçmek için</span>
                            </div>
                            <div className="font-mono text-blue-500/50">v2.1.0</div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CommandPalette;
