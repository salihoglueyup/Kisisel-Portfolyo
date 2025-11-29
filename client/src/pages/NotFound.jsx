// client/src/pages/NotFound.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-[#0B1120] flex items-center justify-center px-6 text-center">
            <div className="max-w-lg">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-9xl font-bold text-slate-800 select-none"
                >
                    404
                </motion.div>

                <h1 className="text-3xl font-bold text-white mb-4 mt-[-2rem] relative z-10">
                    Sistem Hatası: Sayfa Bulunamadı
                </h1>

                <p className="text-gray-400 mb-8">
                    Aradığınız veri modülü silinmiş, taşınmış veya hiç var olmamış olabilir.
                    Lütfen sistem rotasına geri dönün.
                </p>

                <Link
                    to="/"
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold transition-all shadow-lg shadow-blue-600/20 inline-block"
                >
                    Ana Sisteme Dön
                </Link>
            </div>
        </div>
    );
};

export default NotFound;