import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaBars, FaSearch } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { t, i18n } = useTranslation();

    const links = [
        { name: t('navbar.home'), path: '/' },
        { name: t('navbar.about'), path: '/about' },
        { name: t('navbar.projects'), path: '/projects' },
        { name: t('navbar.blog'), path: '/blog' },
        { name: t('navbar.contact'), path: '/contact' },
    ];

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    const toggleLanguage = () => {
        const newLang = i18n.language === 'tr' ? 'en' : 'tr';
        i18n.changeLanguage(newLang);
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-[#0B1120]/80 border-b border-slate-800"
            role="navigation"
            aria-label="Ana navigasyon"
        >
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <NavLink to="/" onClick={closeMenu} className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-mono">
                    YBS.Dev
                </NavLink>

                {/* Desktop Menü */}
                <div className="hidden md:flex items-center space-x-8">
                    {links.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) =>
                                `text-sm font-medium transition-colors duration-300 ${
                                    isActive ? 'text-blue-400' : 'text-gray-300 hover:text-white'
                                }`
                            }
                        >
                            {link.name}
                        </NavLink>
                    ))}

                    {/* Command Palette Trigger */}
                    <button
                        onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
                        className="flex items-center gap-2 px-3 py-1.5 bg-[#0f172a] border border-slate-700/60 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:border-slate-500 transition-all group"
                        title="Arama veya Komut (Ctrl+K)"
                    >
                        <FaSearch className="text-slate-500 group-hover:text-blue-400 transition-colors" />
                        <span className="hidden lg:inline">Arama</span>
                        <kbd className="ml-1 font-mono text-[10px] bg-slate-800 text-slate-400 px-1.5 rounded border border-slate-700 group-hover:border-slate-500 transition-colors">Ctrl K</kbd>
                    </button>

                    {/* Dil Değiştirme Butonu */}
                    <button
                        onClick={toggleLanguage}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/70 border border-slate-700 rounded-lg text-xs font-bold hover:bg-slate-700 transition-all"
                        title={i18n.language === 'tr' ? 'Switch to English' : 'Türkçe\'ye geç'}
                        aria-label={i18n.language === 'tr' ? 'Switch to English' : 'Türkçeye geç'}
                    >
                        <span className="text-base">{i18n.language === 'tr' ? '🇬🇧' : '🇹🇷'}</span>
                        <span className="text-gray-300">{i18n.language === 'tr' ? 'EN' : 'TR'}</span>
                    </button>
                </div>

                {/* Mobil: Dil + Hamburger */}
                <div className="flex items-center gap-3 md:hidden">
                    <button
                        onClick={toggleLanguage}
                        className="text-base p-2 rounded-lg hover:bg-slate-800 transition-colors"
                        aria-label={i18n.language === 'tr' ? 'Switch to English' : 'Türkçeye geç'}
                    >
                        {i18n.language === 'tr' ? '🇬🇧' : '🇹🇷'}
                    </button>
                    <button
                        onClick={toggleMenu}
                        className="text-white text-xl p-2 rounded-lg hover:bg-slate-800 transition-colors z-50"
                        aria-label="Menü"
                    >
                        {isOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>

            {/* Mobil Menü Panel */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden"
                            onClick={closeMenu}
                        />

                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="fixed top-0 right-0 w-72 h-full bg-[#0f172a] border-l border-slate-800 shadow-2xl md:hidden z-40"
                        >
                            <div className="flex flex-col pt-24 px-6">
                                {links.map((link, idx) => (
                                    <motion.div
                                        key={link.path}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.08 }}
                                    >
                                        <NavLink
                                            to={link.path}
                                            onClick={closeMenu}
                                            className={({ isActive }) =>
                                                `block py-4 px-4 text-lg font-medium rounded-xl mb-2 transition-all ${
                                                    isActive
                                                        ? 'text-blue-400 bg-blue-500/10 border border-blue-500/30'
                                                        : 'text-gray-300 hover:text-white hover:bg-slate-800'
                                                }`
                                            }
                                        >
                                            {link.name}
                                        </NavLink>
                                    </motion.div>
                                ))}

                                <div className="mt-auto pt-8 border-t border-slate-800">
                                    <p className="text-xs text-gray-600 text-center">YBS.Dev © 2025</p>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;