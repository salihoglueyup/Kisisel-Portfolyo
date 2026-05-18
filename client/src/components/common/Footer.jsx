import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaHeart, FaArrowUp } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-sunken border-t border-slate-900 pt-16 pb-8 text-sm font-sans">
            <div className="max-w-7xl mx-auto px-6">

                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

                    <div className="col-span-1 md:col-span-1">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
                            Eyüp Zeki Salihoğlu
                        </h2>
                        <p className="text-xs text-blue-400 font-mono mb-4">Full-Stack AI Engineer</p>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            {t('footer.tagline')}
                        </p>
                        <div className="flex gap-4">
                            <a href="https://github.com/salihoglueyup" target="_blank" rel="noopener noreferrer" aria-label="GitHub profili" className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center text-gray-400 hover:text-white hover:bg-slate-800 transition-all"><FaGithub /></a>
                            <a href="https://linkedin.com/in/eyupzekisalihoglu" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profili" className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center text-gray-400 hover:text-blue-400 hover:bg-slate-800 transition-all"><FaLinkedin /></a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-6">{t('footer.menu')}</h3>
                        <ul className="space-y-3 text-gray-400">
                            <li><Link to="/" className="hover:text-blue-400 transition-colors">{t('navbar.home')}</Link></li>
                            <li><Link to="/about" className="hover:text-blue-400 transition-colors">{t('navbar.about')}</Link></li>
                            <li><Link to="/projects" className="hover:text-blue-400 transition-colors">{t('navbar.projects')}</Link></li>
                            <li><Link to="/blog" className="hover:text-blue-400 transition-colors">{t('navbar.blog')}</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-6">{t('footer.expertise_title')}</h3>
                        <ul className="space-y-3 text-gray-400">
                            <li className="hover:text-blue-400 transition-colors">{t('footer.exp_ai')}</li>
                            <li className="hover:text-blue-400 transition-colors">{t('footer.exp_fullstack')}</li>
                            <li className="hover:text-blue-400 transition-colors">{t('footer.exp_security')}</li>
                            <li className="hover:text-blue-400 transition-colors">{t('footer.exp_llm')}</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-6">{t('navbar.contact')}</h3>
                        <ul className="space-y-3 text-gray-400">
                            <li>{t('footer.location')}</li>
                            <li>eyupzekisalihoglu@gmail.com</li>
                            <li className="text-green-500 flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> {t('footer.available')}</li>
                        </ul>
                    </div>

                </div>

                <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-xs">
                        {t('footer.copyright', { year: currentYear })} <FaHeart className="inline text-red-500 mx-1" /> {t('footer.built_with')}
                    </p>

                    <button
                        onClick={scrollToTop}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider"
                    >
                        {t('footer.back_to_top')} <FaArrowUp />
                    </button>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
