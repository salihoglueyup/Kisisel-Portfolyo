import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
    const links = [
        { name: 'Ana Sayfa', path: '/' },
        { name: 'Hakkımda', path: '/about' },
        { name: 'Projeler', path: '/projects' },
        { name: 'Blog', path: '/blog' },
        { name: 'İletişim', path: '/contact' },
    ];

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-[#0B1120]/80 border-b border-slate-800"
        >
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-mono">
                    YBS.Dev
                </div>

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
                </div>

                <div className="md:hidden text-white">☰</div>
            </div>
        </motion.nav>
    );
};

export default Navbar;