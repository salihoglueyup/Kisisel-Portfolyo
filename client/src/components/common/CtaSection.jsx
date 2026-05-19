import { motion } from 'framer-motion';

// Sayfa altı eylem çağrısı paneli — Home/About/Blog için ortak.
// Kanonik standart: blue→purple gradient, rounded-3xl, p-8 md:p-12,
// köşelerde blur-blob dekor, başlık text-3xl md:text-4xl. Eylem alanı
// (buton satırı / form) children olarak verilir; çağrı yeri kendi
// markup'ını koyar (buton şekli rounded-xl standardına çekilmiştir).

/**
 * @param {React.ReactNode} icon - Üstte ortalı ikon (opsiyonel, bare ikon ver)
 * @param {React.ReactNode} title - Başlık metni
 * @param {'h2'|'h3'} titleAs - Başlık etiketi (varsayılan h2)
 * @param {React.ReactNode} description - Açıklama (opsiyonel)
 * @param {React.ReactNode} children - Eylem alanı (butonlar/form)
 * @param {string} className - Çağrı yerine özel sınıf (örn. mt-24 boşluğu)
 */
const CtaSection = ({ icon, title, titleAs: TitleTag = 'h2', description, children, className = '' }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/30 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden ${className}`}
    >
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl mx-auto">
            {icon && <div className="text-4xl text-blue-400 mb-4 flex justify-center">{icon}</div>}
            <TitleTag className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</TitleTag>
            {description && (
                <p className="text-gray-400 text-lg mb-8">{description}</p>
            )}
            {children}
        </div>
    </motion.div>
);

export default CtaSection;
