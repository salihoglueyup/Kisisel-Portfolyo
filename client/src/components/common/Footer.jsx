import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaTwitter, FaHeart, FaArrowUp } from 'react-icons/fa';

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#050a14] border-t border-slate-900 pt-16 pb-8 text-sm font-sans">
            <div className="max-w-7xl mx-auto px-6">

                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

                    <div className="col-span-1 md:col-span-1">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
                            YBS.Dev
                        </h2>
                        <p className="text-gray-500 leading-relaxed mb-6">
                            Yönetim Bilişim Sistemleri vizyonuyla geliştirilmiş, veri odaklı ve modern web çözümleri.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center text-gray-400 hover:text-white hover:bg-slate-800 transition-all"><FaGithub /></a>
                            <a href="#" className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center text-gray-400 hover:text-blue-400 hover:bg-slate-800 transition-all"><FaLinkedin /></a>
                            <a href="#" className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center text-gray-400 hover:text-blue-300 hover:bg-slate-800 transition-all"><FaTwitter /></a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-6">Menü</h3>
                        <ul className="space-y-3 text-gray-500">
                            <li><Link to="/" className="hover:text-blue-400 transition-colors">Ana Sayfa</Link></li>
                            <li><Link to="/about" className="hover:text-blue-400 transition-colors">Hakkımda</Link></li>
                            <li><Link to="/projects" className="hover:text-blue-400 transition-colors">Projeler</Link></li>
                            <li><Link to="/blog" className="hover:text-blue-400 transition-colors">Blog</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-6">Hizmetler</h3>
                        <ul className="space-y-3 text-gray-500">
                            <li className="hover:text-blue-400 transition-colors cursor-pointer">Web Geliştirme</li>
                            <li className="hover:text-blue-400 transition-colors cursor-pointer">Veri Analizi</li>
                            <li className="hover:text-blue-400 transition-colors cursor-pointer">UI/UX Tasarım</li>
                            <li className="hover:text-blue-400 transition-colors cursor-pointer">SEO Optimizasyonu</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-6">İletişim</h3>
                        <ul className="space-y-3 text-gray-500">
                            <li>İstanbul, Türkiye</li>
                            <li>eyupzekisalihoglu@gmail.com</li>
                            <li className="text-green-500 flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Available for Freelance</li>
                        </ul>
                    </div>

                </div>

                <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-600 text-xs">
                        &copy; {currentYear} Tüm Hakları Saklıdır. React & Vite ile <FaHeart className="inline text-red-500 mx-1" /> yapıldı.
                    </p>

                    <button
                        onClick={scrollToTop}
                        className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider"
                    >
                        Yukarı Çık <FaArrowUp />
                    </button>
                </div>

            </div>
        </footer>
    );
};

export default Footer;