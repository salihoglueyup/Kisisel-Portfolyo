// Sayfa hero'larında tekrar eden "● SYSTEM ONLINE" tarzı durum çipi.
// Kanonik varyant: border-{renk}-500/30 · bg-{renk}-500/10. Önceden
// Home ve About-work /20·/5 kullanıyordu; tutarlılık için /30·/10'a
// normalize edildi (çok hafif, bilinçli görsel fark).

const VARIANTS = {
    blue: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
    cyan: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
    purple: 'border-purple-500/30 bg-purple-500/10 text-purple-400',
    green: 'border-green-500/30 bg-green-500/10 text-green-400',
};

// Mavi "yayılan" nokta (Home hero'su ile birebir aynı görünüm)
const PingDot = () => (
    <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
    </span>
);

// Yeşil sade nabız noktası ("müsait" sinyali — rozet rengiyle bağımsız)
const PulseDot = () => (
    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
);

/**
 * @param {'blue'|'cyan'|'purple'|'green'} color - Renk varyantı
 * @param {'ping'|'pulse'|false} dot - Başa eklenen durum noktası
 * @param {React.ReactNode} icon - Nokta yerine ikon (örn. <FaCode />)
 * @param {string} className - Çağrı yerine özel (örn. mb-6 boşluğu)
 */
const StatusBadge = ({ color = 'blue', dot = false, icon = null, className = '', children }) => (
    <div className={`inline-flex items-center gap-2 px-3 py-1 border rounded-full text-xs font-mono ${VARIANTS[color] || VARIANTS.blue} ${className}`}>
        {dot === 'ping' && <PingDot />}
        {dot === 'pulse' && <PulseDot />}
        {icon}
        {children}
    </div>
);

export default StatusBadge;
