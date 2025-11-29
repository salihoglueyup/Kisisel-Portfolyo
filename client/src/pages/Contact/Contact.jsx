import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaPaperPlane, FaEnvelope, FaMapMarkerAlt, FaGithub, FaLinkedin,
    FaClock, FaCheckCircle, FaCalendarAlt, FaUserTie, FaTimes,
    FaBolt, FaCalculator, FaGlobeAmericas, FaQuoteRight,
    FaSlack, FaTrello, FaVideo, FaFileInvoice, FaShieldAlt, FaQuestionCircle
} from 'react-icons/fa';
import { SiJira, SiNotion, SiZoom } from 'react-icons/si';

// --- MODAL (TOPLANTI) ---
const MeetingModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm"></motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#1f2937] border border-slate-700 w-full max-w-lg rounded-2xl p-8 relative z-50 shadow-2xl">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><FaTimes size={20} /></button>
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-600/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl"><FaCalendarAlt /></div>
                    <h3 className="text-2xl font-bold text-white">Toplantı Planla</h3>
                    <p className="text-gray-400 text-sm mt-2">Projeniz için 30 dakikalık ücretsiz ön görüşme.</p>
                </div>
                <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-xs font-bold text-gray-500 uppercase">Tarih</label><input type="date" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none" /></div>
                        <div><label className="text-xs font-bold text-gray-500 uppercase">Saat</label><select className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none"><option>10:00</option><option>14:00</option></select></div>
                    </div>
                    <button type="button" onClick={() => { alert("Demo: Talep Alındı!"); onClose(); }} className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors">Randevu Oluştur</button>
                </form>
            </motion.div>
        </div>
    );
};

// --- MALİYET HESAPLAYICI ---
const CostEstimator = () => {
    const [type, setType] = useState(1);
    const [pages, setPages] = useState(5);
    const [features, setFeatures] = useState({ admin: false, seo: false, design: false });

    const calculateCost = () => {
        let base = type === 1 ? 500 : type === 2 ? 1200 : 2500;
        let pageCost = pages * 50;
        let featureCost = (features.admin ? 400 : 0) + (features.seo ? 200 : 0) + (features.design ? 300 : 0);
        return base + pageCost + featureCost;
    };

    return (
        <div className="bg-[#1f2937] border border-slate-700 rounded-2xl p-6 mt-6">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-700 pb-2">
                <FaCalculator className="text-green-400" />
                <h3 className="text-white font-bold">Hızlı Fiyat Hesaplayıcı</h3>
            </div>
            <div className="space-y-4">
                <div>
                    <label className="text-xs text-gray-400 uppercase font-bold">Proje Tipi</label>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                        {['Landing', 'Kurumsal', 'E-Ticaret'].map((label, i) => (
                            <button key={i} onClick={() => setType(i + 1)} className={`text-xs py-2 rounded border ${type === i + 1 ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-gray-400'}`}>{label}</button>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="text-xs text-gray-400 uppercase font-bold flex justify-between">Sayfa Sayısı: <span className="text-white">{pages}</span></label>
                    <input type="range" min="1" max="20" value={pages} onChange={(e) => setPages(e.target.value)} className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer mt-1 accent-blue-500" />
                </div>
                <div className="flex flex-wrap gap-2">
                    {Object.keys(features).map(f => (
                        <button key={f} onClick={() => setFeatures({...features, [f]: !features[f]})} className={`text-xs px-3 py-1 rounded-full border ${features[f] ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-slate-800 border-slate-700 text-gray-500'}`}>
                            {f === 'admin' ? '+ Admin' : f === 'seo' ? '+ SEO' : '+ Tasarım'}
                        </button>
                    ))}
                </div>
                <div className="bg-black/30 p-4 rounded-xl text-center mt-2 border border-slate-700 border-dashed">
                    <p className="text-gray-500 text-xs mb-1">Tahmini Bütçe Aralığı</p>
                    <p className="text-2xl font-bold text-white">${calculateCost()} - ${calculateCost() + 500}</p>
                </div>
            </div>
        </div>
    );
};

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: 'Proje Teklifi', message: '' });
    const [status, setStatus] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'}));

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})), 60000);
        return () => clearInterval(timer);
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        try {
            await axios.post('http://localhost:5000/api/messages', formData);
            setStatus('success');
            setFormData({ name: '', email: '', subject: 'Proje Teklifi', message: '' });
            setTimeout(() => setStatus(null), 5000);
        } catch (error) { setStatus('error'); }
    };

    return (
        <div className="min-h-screen bg-[#0B1120] pt-28 pb-20 px-6 font-sans overflow-x-hidden">
            <AnimatePresence>
                <MeetingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            </AnimatePresence>

            <div className="max-w-7xl mx-auto">

                {/* HEADER */}
                <div className="text-center mb-16">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="inline-block px-3 py-1 mb-4 border border-green-500/30 rounded-full bg-green-500/10 text-green-400 text-xs font-mono">
                        <span className="w-2 h-2 inline-block bg-green-500 rounded-full mr-2 animate-pulse"></span>
                        STATUS: AVAILABLE FOR WORK
                    </motion.div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                        Bir Sonraki Projeni <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Birlikte Tasarlayalım.</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Kod, Kahve ve Strateji. Fikrinizi hayata geçirmek için gereken her şey burada.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">

                    {/* --- SOL KOLON --- */}
                    <motion.div className="lg:col-span-5 flex flex-col gap-6" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>

                        {/* 1. İletişim Kartı */}
                        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl -z-10"></div>
                            <h3 className="text-xl font-bold text-white mb-6">İletişim Kanalları</h3>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 group/item">
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 text-xl"><FaEnvelope /></div>
                                    <div><span className="block text-xs text-gray-500 font-bold uppercase tracking-wider">Email</span><a href="mailto:eyupzekisalihoglu@gmail.com" className="text-white hover:text-blue-400 transition-colors font-medium">eyupzekisalihoglu@gmail.com</a></div>
                                </div>
                                <div className="flex items-center gap-4 group/item">
                                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 text-xl"><FaMapMarkerAlt /></div>
                                    <div><span className="block text-xs text-gray-500 font-bold uppercase tracking-wider">Lokasyon</span><span className="text-white font-medium">İstanbul, Türkiye (Remote)</span></div>
                                </div>
                            </div>
                            <div className="mt-8 pt-8 border-t border-slate-800 flex gap-4">
                                <a
                                    href="https://github.com/salihoglueyup"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 py-2 rounded-lg bg-slate-800 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black transition-all gap-2 text-sm font-bold border border-slate-700"
                                >
                                    <FaGithub /> Github
                                </a>
                                <a
                                    href="https://www.linkedin.com/in/eyupzekisalihoglu/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 py-2 rounded-lg bg-slate-800 flex items-center justify-center text-gray-400 hover:bg-[#0077b5] hover:text-white transition-all gap-2 text-sm font-bold border border-slate-700"
                                >
                                    <FaLinkedin /> LinkedIn
                                </a>
                            </div>
                        </div>

                        {/* 2. CANLI OPERASYON PANELİ */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#1f2937] border border-slate-700 p-4 rounded-xl flex flex-col items-center justify-center text-center">
                                <FaBolt className="text-yellow-400 text-xl mb-2" />
                                <span className="text-2xl font-bold text-white">&lt; 2 Saat</span>
                                <span className="text-[10px] text-gray-400 uppercase font-bold">Ort. Yanıt Süresi</span>
                            </div>
                            <div className="bg-[#1f2937] border border-slate-700 p-4 rounded-xl flex flex-col items-center justify-center text-center">
                                <FaClock className="text-blue-400 text-xl mb-2" />
                                <span className="text-2xl font-bold text-white">{currentTime}</span>
                                <span className="text-[10px] text-gray-400 uppercase font-bold">Yerel Saat (GMT+3)</span>
                            </div>
                        </div>

                        {/* 3. CTA: Toplantı */}
                        <div className="bg-gradient-to-r from-blue-900/40 to-slate-900 border border-blue-500/30 rounded-2xl p-6 text-center">
                            <FaUserTie className="text-3xl text-blue-400 mx-auto mb-3" />
                            <h3 className="text-white font-bold mb-2">Yüz Yüze Görüşelim?</h3>
                            <p className="text-sm text-gray-400 mb-4">Projenizi detaylandırmak için 30 dakikalık bir görüşme.</p>
                            <button onClick={() => setIsModalOpen(true)} className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20">Takvimime Bak</button>
                        </div>

                        {/* 4. MALİYET HESAPLAYICI */}
                        <CostEstimator />

                        {/* 5. YENİ: İLETİŞİM TOOL STACK (İşbirliği Araçları) */}
                        <div className="bg-[#1f2937] border border-slate-700 rounded-2xl p-6">
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-4 text-center">İş Birliği Araçlarım</h4>
                            <div className="flex justify-between items-center px-2">
                                <div className="text-center group"><FaSlack className="text-2xl text-gray-400 group-hover:text-white transition-colors mb-1 mx-auto" /><span className="text-[10px] text-gray-600">Slack</span></div>
                                <div className="text-center group"><SiJira className="text-2xl text-gray-400 group-hover:text-blue-400 transition-colors mb-1 mx-auto" /><span className="text-[10px] text-gray-600">Jira</span></div>
                                <div className="text-center group"><SiNotion className="text-2xl text-gray-400 group-hover:text-white transition-colors mb-1 mx-auto" /><span className="text-[10px] text-gray-600">Notion</span></div>
                                <div className="text-center group"><FaVideo className="text-2xl text-gray-400 group-hover:text-blue-500 transition-colors mb-1 mx-auto" /><span className="text-[10px] text-gray-600">Zoom</span></div>
                            </div>
                        </div>

                    </motion.div>

                    {/* --- SAĞ KOLON --- */}
                    <motion.div className="lg:col-span-7" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-8 lg:p-10 relative shadow-2xl">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-2xl font-bold text-white">Mesaj Gönder</h3>
                                <FaPaperPlane className="text-slate-700 text-2xl rotate-12" />
                            </div>

                            {status === 'success' ? (
                                <div className="flex flex-col items-center justify-center py-24 text-center bg-slate-900/50 rounded-xl border border-slate-700 border-dashed">
                                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6"><FaCheckCircle className="text-4xl text-green-500 animate-bounce" /></div>
                                    <h4 className="text-2xl font-bold text-white">Mesajın İletildi!</h4>
                                    <p className="text-gray-400 mt-2 max-w-xs mx-auto">Teşekkürler. En kısa sürede dönüş yapacağım.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2"><label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">İsim Soyisim</label><input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full bg-[#1f2937] border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:bg-slate-900 outline-none transition-all" placeholder="Adınız" /></div>
                                        <div className="space-y-2"><label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">E-posta</label><input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full bg-[#1f2937] border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:bg-slate-900 outline-none transition-all" placeholder="ornek@email.com" /></div>
                                    </div>
                                    <div className="space-y-2"><label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Konu</label><div className="grid grid-cols-2 sm:grid-cols-4 gap-2">{['Proje Teklifi', 'Freelance', 'İş Fırsatı', 'Diğer'].map(opt => (<button type="button" key={opt} onClick={() => setFormData({...formData, subject: opt})} className={`py-2 text-xs font-bold rounded-lg border transition-all ${formData.subject === opt ? 'bg-blue-600 border-blue-500 text-white' : 'bg-[#1f2937] border-slate-700 text-gray-400 hover:border-gray-500'}`}>{opt}</button>))}</div></div>
                                    <div className="space-y-2"><label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Mesajınız</label><textarea name="message" rows="6" required value={formData.message} onChange={handleChange} className="w-full bg-[#1f2937] border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:bg-slate-900 outline-none transition-all resize-none" placeholder="Projenizden veya fikrinizden bahsedin..."></textarea></div>
                                    <button type="submit" disabled={status === 'loading'} className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-1">{status === 'loading' ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div> : <><FaPaperPlane /> Mesajı Gönder</>}</button>
                                </form>
                            )}
                        </div>

                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-center items-center min-h-[200px]">
                                <div className="absolute inset-0 opacity-20"><div className="w-full h-full bg-[radial-gradient(circle,_#3b82f6_1px,_transparent_1px)] bg-[size:20px_20px]"></div></div>
                                <div className="relative z-10 text-center">
                                    <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse"><FaGlobeAmericas size={24} /></div>
                                    <h4 className="text-white font-bold">Global Hizmet</h4>
                                    <p className="text-xs text-gray-500">İstanbul merkezli, dünya çapında vizyon.</p>
                                </div>
                            </div>
                            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 flex flex-col justify-center relative">
                                <FaQuoteRight className="absolute top-4 right-4 text-slate-700 text-4xl" />
                                <p className="text-gray-300 text-sm italic mb-4 z-10">"YBS vizyonu sayesinde sadece kod yazmadı, iş süreçlerimizi de optimize etti. Harika bir ortak."</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs">MK</div>
                                    <div><h5 className="text-white text-xs font-bold">Mehmet K.</h5><p className="text-[10px] text-gray-500">Tech Lead, StartUp A.Ş.</p></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* --- YENİ ALT BÖLÜM: DESTEK VE BİLGİ MERKEZİ --- */}
                <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="border-t border-slate-800 pt-16">
                    <h2 className="text-3xl font-bold text-white mb-10 text-center">Profesyonel Hizmet Standartları</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                        {/* SOL: SLA TABLOSU (Veri Odaklı) */}
                        <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden">
                            <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex items-center gap-3">
                                <FaShieldAlt className="text-green-500" />
                                <h3 className="font-bold text-white">SLA (Hizmet Seviyesi Anlaşması)</h3>
                            </div>
                            <div className="p-6">
                                <p className="text-sm text-gray-400 mb-6">Müşteri taleplerine dönüş ve çözüm sürelerim aşağıdaki standartlara tabidir.</p>
                                <table className="w-full text-sm text-left text-gray-400">
                                    <thead className="text-xs text-gray-500 uppercase bg-slate-800/50">
                                    <tr>
                                        <th className="px-6 py-3 rounded-l-lg">Öncelik</th>
                                        <th className="px-6 py-3">İlk Yanıt</th>
                                        <th className="px-6 py-3 rounded-r-lg">Çözüm Hedefi</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr className="border-b border-slate-800 hover:bg-slate-800/30">
                                        <td className="px-6 py-4 font-bold text-red-400 flex items-center gap-2"><div className="w-2 h-2 bg-red-500 rounded-full"></div> Kritik</td>
                                        <td className="px-6 py-4">1 Saat</td>
                                        <td className="px-6 py-4">4 Saat</td>
                                    </tr>
                                    <tr className="border-b border-slate-800 hover:bg-slate-800/30">
                                        <td className="px-6 py-4 font-bold text-yellow-400 flex items-center gap-2"><div className="w-2 h-2 bg-yellow-500 rounded-full"></div> Yüksek</td>
                                        <td className="px-6 py-4">4 Saat</td>
                                        <td className="px-6 py-4">24 Saat</td>
                                    </tr>
                                    <tr className="hover:bg-slate-800/30">
                                        <td className="px-6 py-4 font-bold text-blue-400 flex items-center gap-2"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> Normal</td>
                                        <td className="px-6 py-4">24 Saat</td>
                                        <td className="px-6 py-4">3 İş Günü</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* SAĞ: SIKÇA SORULANLAR (Accordion) */}
                        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <FaQuestionCircle className="text-blue-500" />
                                <h3 className="font-bold text-white text-lg">Sıkça Sorulan Sorular</h3>
                            </div>
                            <div className="space-y-4">
                                <details className="group p-4 border border-slate-800 rounded-xl bg-slate-900/30 open:bg-slate-900/80 transition-all">
                                    <summary className="flex cursor-pointer items-center justify-between font-bold text-gray-300 group-hover:text-white">
                                        Fatura kesiyor musunuz?
                                        <span className="transition group-open:rotate-180 text-blue-500"><FaBolt /></span>
                                    </summary>
                                    <div className="mt-3 text-sm text-gray-400 pl-4 border-l-2 border-blue-500">
                                        Evet, tüm freelance çalışmalarım için resmi olarak fatura kesiyorum.
                                    </div>
                                </details>
                                <details className="group p-4 border border-slate-800 rounded-xl bg-slate-900/30 open:bg-slate-900/80 transition-all">
                                    <summary className="flex cursor-pointer items-center justify-between font-bold text-gray-300 group-hover:text-white">
                                        Proje sonrası destek veriyor musunuz?
                                        <span className="transition group-open:rotate-180 text-blue-500"><FaBolt /></span>
                                    </summary>
                                    <div className="mt-3 text-sm text-gray-400 pl-4 border-l-2 border-blue-500">
                                        Kesinlikle. Teslimat sonrası 1 ay ücretsiz "Bug-Fix" desteği sağlıyorum. Sonrası için bakım anlaşması yapabiliriz.
                                    </div>
                                </details>
                                <details className="group p-4 border border-slate-800 rounded-xl bg-slate-900/30 open:bg-slate-900/80 transition-all">
                                    <summary className="flex cursor-pointer items-center justify-between font-bold text-gray-300 group-hover:text-white">
                                        Ödeme yöntemleri neler?
                                        <span className="transition group-open:rotate-180 text-blue-500"><FaBolt /></span>
                                    </summary>
                                    <div className="mt-3 text-sm text-gray-400 pl-4 border-l-2 border-blue-500">
                                        Yasal şartlara bağlı olup tüm ödeme sistemlerine açığım.
                                    </div>
                                </details>
                            </div>
                        </div>

                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default Contact;