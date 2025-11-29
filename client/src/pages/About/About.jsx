import { motion } from 'framer-motion';
import {
    FaGraduationCap, FaBriefcase, FaCode, FaBrain, FaCoffee, FaGamepad, FaCodeBranch,FaDesktop,
    FaAward, FaCertificate, FaLaptopCode, FaLanguage, FaUserAstronaut, FaQuoteLeft, FaLightbulb, FaRocket, FaFilePdf,FaTablet,FaWindows
} from 'react-icons/fa';
import {
    SiPython, SiJavascript, SiReact, SiNodedotjs, SiMongodb, SiPostgresql, SiDocker, SiFigma,
    SiWebstorm,SiPycharm,SiCisco,SiDbeaver
} from 'react-icons/si';
import { VscVscode } from "react-icons/vsc";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import profilFoto from '../../assets/profil.jpeg';

const routineData = [
    { name: 'Kodlama', value: 5, color: '#3b82f6' },
    { name: 'Analiz & Öğrenme', value: 6, color: '#8b5cf6' },
    { name: 'Uyku', value: 9, color: '#1e293b' },
    { name: 'Sosyal & Oyun', value: 4, color: '#10b981' },
];

const certifications = [
    { title: "Sıfırdan IT Uzmanlığı", issuer: "Udemy", date: "2025", icon: <FaAward className="text-yellow-400" /> },
    { title: "AWS Cloud Practitioner", issuer: "Amazon Web Services", date: "2023", icon: <FaCertificate className="text-orange-400" /> },
    { title: "Advanced React Patterns", issuer: "Udemy", date: "2023", icon: <FaCode className="text-blue-400" /> },
];

const gear = {
    hardware: [
        { name: "HP Victus 15", desc: "Ana İş İstasyonu", icon: <FaWindows /> },
        { name: "Steelseries Prime RGB", desc: "Verimlilik Faresi", icon: <FaLaptopCode /> },
        { name: "Honor Pad X8A", desc: "Yardımcı Tablet", icon: <FaTablet /> },
        { name: "Viewsonic VX2779-HD-PRO", desc: "Çoklu ekran çalışma", icon: <FaDesktop /> },

    ],
    software: [
        {
            name: "WebStorm",
            desc: "Ana IDE (JavaScript & Front-End)",
            icon: <SiWebstorm className="text-blue-400" />
        },
        {
            name: "PyCharm",
            desc: "Python Geliştirme Ortamı",
            icon: <SiPycharm className="text-green-400" />
        },
        {
            name: "Cisco Packet Tracer",
            desc: "Ağ Simülasyonu & Konfigürasyon",
            icon: <SiCisco className="text-blue-500" />
        },
        {
            name: "DBeaver",
            desc: "Veritabanı Yönetimi (SQL)",
            icon: <SiDbeaver className="text-gray-300" />
        },
    ]
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
};

const About = () => {
    const timeline = [
        { year: "2025", title: "Full Stack Developer", desc: "Modern web teknolojileri (MERN) ile kurumsal projeler geliştiriyorum.", icon: <FaCode /> },
        { year: "2023", title: "YBS Bölümü", desc: "Yönetim Bilişim Sistemleri lisans eğitimime başladım.", icon: <FaGraduationCap /> },
        { year: "2022", title: "İlk Kod Satırı", desc: "Python ile algoritmik düşünce yapısına giriş.", icon: <FaBrain /> },
    ];

    return (
        <div className="min-h-screen bg-[#0B1120] text-gray-300 font-sans pt-24 pb-20 px-6 overflow-x-hidden">

            <motion.div
                className="max-w-6xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >

                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center mb-24">
                    <motion.div className="md:col-span-4 relative group" variants={itemVariants}>
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
                        <div className="relative bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden aspect-square flex items-center justify-center shadow-2xl">
                            <div className="text-center">
                                <img
                                    src={profilFoto}
                                    alt="Profile Picture"
                                    className="w-32 h-32 object-cover mx-auto rounded-2xl"
                                />
                            </div>
                        </div>
                    </motion.div>


                    <motion.div className="md:col-span-8" variants={itemVariants}>
                        <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-blue-500/20 rounded-full bg-blue-500/5 text-blue-400 text-xs font-mono">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            OPEN FOR WORK
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                            Veri ile Düşünen, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                                Kod ile Üreten.
                            </span>
                        </h1>
                        <p className="text-lg leading-relaxed text-gray-400 mb-6 border-l-4 border-blue-500/50 pl-4">
                            Yönetim Bilişim Sistemleri (MIS) disipliniyle, karmaşık iş süreçlerini
                            anlaşılır, ölçeklenebilir ve modern yazılım çözümlerine dönüştürüyorum.
                        </p>

                        <div className="flex flex-wrap gap-4 mt-8">
                            <div className="flex items-center gap-2 px-4 py-2 bg-[#1e293b] rounded-lg border border-slate-700 text-sm hover:border-blue-500 transition-colors">
                                <FaCoffee className="text-yellow-500"/> Problem Çözücü
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-[#1e293b] rounded-lg border border-slate-700 text-sm hover:border-purple-500 transition-colors">
                                <FaGamepad className="text-purple-500"/> Teknoloji Tutkunu
                            </div>
                        </div>
                    </motion.div>
                </div>

                <motion.div variants={itemVariants} className="mb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    <div className="lg:col-span-7 space-y-6 text-lg leading-relaxed text-gray-400">
                        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                            <FaUserAstronaut className="text-blue-500" /> Yolculuğum
                        </h2>
                        <p>
                            Bilgisayar dünyasına olan merakım, sadece oyun oynamakla değil, "Bu oyun nasıl yapılıyor?" sorusuyla başladı.
                            Lise yıllarında basit HTML/CSS denemeleriyle başlayan bu serüven, üniversitede <strong className="text-white">Yönetim Bilişim Sistemleri</strong> bölümüyle profesyonel bir vizyona dönüştü.
                        </p>
                        <p>
                            Sadece kod yazan biri değilim; kodun işletmeye kattığı değeri hesaplayan, süreçleri analiz eden ve veriyi anlamlandıran biriyim.
                            Benim için yazılım, karmaşık problemleri en zarif ve verimli şekilde çözme sanatıdır.
                        </p>
                        <p>
                            Şu anda MERN Stack (MongoDB, Express, React, Node.js) üzerinde uzmanlaşırken, bir yandan da veri analitiği ve yapay zeka konularında kendimi geliştiriyorum.
                            Hedefim, teknolojiyi kullanarak insanların hayatını kolaylaştıran ölçeklenebilir sistemler kurmak.
                        </p>
                        <div className="pt-4 font-script text-3xl text-blue-400 opacity-80" style={{ fontFamily: 'cursive' }}>
                            Eyüp Zeki Salihoğlu
                        </div>
                    </div>

                    <div className="lg:col-span-5">
                        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-8 relative overflow-hidden">
                            <FaQuoteLeft className="absolute top-4 right-4 text-4xl text-slate-800" />
                            <h3 className="text-xl font-bold text-white mb-6">Çalışma Prensiplerim</h3>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400 shrink-0"><FaLightbulb /></div>
                                    <div>
                                        <h4 className="font-bold text-white">Sürekli Merak</h4>
                                        <p className="text-sm text-gray-500">Teknoloji durmaz, ben de durmam. Her gün yeni bir şeyler öğrenirim.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400 shrink-0"><FaBrain /></div>
                                    <div>
                                        <h4 className="font-bold text-white">Analitik Yaklaşım</h4>
                                        <p className="text-sm text-gray-500">Kararlarımı hislere göre değil, verilere ve mantığa göre veririm.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center text-green-400 shrink-0"><FaRocket /></div>
                                    <div>
                                        <h4 className="font-bold text-white">Sonuç Odaklılık</h4>
                                        <p className="text-sm text-gray-500">Temiz kod önemlidir, ama çalışan ve değer üreten ürün daha önemlidir.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* 2. İSTATİSTİK VE RUTİN */}
                <motion.div variants={itemVariants} className="mb-24 grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Sol: Bir Günüm (Grafik) */}
                    <div className="bg-[#111827] border border-slate-800 rounded-2xl p-8 relative overflow-hidden">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <FaBrain className="text-purple-500"/> Bir Günüm Nasıl Geçiyor?
                        </h3>
                        <div className="h-64 w-full relative z-10">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={routineData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {routineData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Ortadaki Yazı */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none mb-4">
                                <span className="text-2xl font-bold text-white">24h</span>
                                <span className="block text-xs text-gray-500">Daily Cycle</span>
                            </div>
                        </div>
                    </div>

                    {/* Sağ: Dil Yetkinlikleri & Hedefler */}
                    <div className="flex flex-col gap-6">
                        {/* Diller */}
                        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-8">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <FaLanguage className="text-green-500"/> Dil Yetkinlikleri
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-white text-sm">Türkçe (Ana Dil)</span>
                                        <span className="text-green-400 text-xs">Native</span>
                                    </div>
                                    <div className="h-2 bg-slate-700 rounded-full"><div className="h-full w-full bg-green-500 rounded-full"></div></div>
                                </div>
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-white text-sm">İngilizce (Teknik)</span>
                                        <span className="text-blue-400 text-xs">Advanced (C1)</span>
                                    </div>
                                    <div className="h-2 bg-slate-700 rounded-full"><div className="h-full w-[85%] bg-blue-500 rounded-full"></div></div>
                                </div>
                            </div>
                        </div>

                        {/* Hedef */}
                        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-2xl p-8 flex-1 flex flex-col justify-center">
                            <h4 className="text-blue-400 font-bold mb-2">2025 Hedefi</h4>
                            <p className="text-gray-300 italic">
                                "Yapay Zeka destekli kurumsal SaaS projeleri geliştirerek sektörde fark yaratmak."
                            </p>
                        </div>
                    </div>

                </motion.div>

                {/* 3. TIMELINE */}
                <motion.div variants={itemVariants} className="mb-24">
                    <h2 className="text-2xl font-bold text-white mb-10 flex items-center gap-3">
                        <FaCodeBranch className="text-blue-500" />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">Kariyer Geçmişi</span>
                    </h2>

                    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-800">
                        {timeline.map((item, index) => (
                            <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#0B1120] bg-slate-800 group-hover:bg-blue-600 transition-colors shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                    <span className="text-gray-400 group-hover:text-white text-sm">{item.icon}</span>
                                </div>
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-[#111827] p-6 rounded-xl border border-slate-800 hover:border-blue-500/50 transition-all shadow-sm hover:shadow-md hover:shadow-blue-900/10">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="font-bold text-white">{item.title}</div>
                                        <time className="font-mono text-xs text-blue-400 bg-blue-400/10 px-2 py-1 rounded">{item.year}</time>
                                    </div>
                                    <p className="text-slate-400 text-sm">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* 4. SERTİFİKALAR VE TECH STACK */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">

                    {/* Sertifikalar */}
                    <motion.div variants={itemVariants} className="lg:col-span-1">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <FaAward className="text-yellow-500"/> Sertifikalar
                        </h3>
                        <div className="space-y-4">
                            {certifications.map((cert, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-4 bg-[#111827] border border-slate-800 rounded-xl hover:border-yellow-500/50 transition-colors group cursor-default">
                                    <div className="text-2xl p-3 bg-slate-800 rounded-lg group-hover:bg-slate-700 transition-colors">
                                        {cert.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-sm">{cert.title}</h4>
                                        <p className="text-xs text-gray-500">{cert.issuer} • {cert.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Teknoloji Stack */}
                    <motion.div variants={itemVariants} className="lg:col-span-2">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <FaCode className="text-blue-500"/> Teknoloji Cephaneliği
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[
                                { name: "Python", icon: <SiPython />, color: "text-yellow-400" },
                                { name: "JavaScript", icon: <SiJavascript />, color: "text-yellow-300" },
                                { name: "React", icon: <SiReact />, color: "text-blue-400" },
                                { name: "Node.js", icon: <SiNodedotjs />, color: "text-green-500" },
                                { name: "MongoDB", icon: <SiMongodb />, color: "text-green-400" },
                                { name: "PostgreSQL", icon: <SiPostgresql />, color: "text-blue-300" },
                                { name: "Docker", icon: <SiDocker />, color: "text-blue-500" },
                                { name: "Figma", icon: <SiFigma />, color: "text-pink-500" },
                            ].map((tech, idx) => (
                                <div key={idx} className="flex flex-col items-center justify-center p-6 bg-[#111827] border border-slate-800 rounded-xl hover:border-blue-500/30 hover:bg-slate-800/50 transition-all group">
                                    <span className={`text-4xl mb-3 ${tech.color} group-hover:scale-110 transition-transform`}>{tech.icon}</span>
                                    <span className="text-gray-300 text-sm font-medium">{tech.name}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* 5. EKİPMANLAR (MY GEAR) */}
                <motion.div variants={itemVariants} className="bg-[#111827] border border-slate-800 rounded-2xl p-8">
                    <h3 className="text-xl font-bold text-white mb-8 text-center flex items-center justify-center gap-2">
                        <FaLaptopCode className="text-blue-400"/> Geliştirme Ortamım (My Gear)
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Hardware */}
                        <div>
                            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Hardware</h4>
                            <div className="space-y-4">
                                {gear.hardware.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl text-gray-400 group-hover:text-white transition-colors">{item.icon}</span>
                                            <span className="text-gray-200 font-medium">{item.name}</span>
                                        </div>
                                        <span className="text-xs text-gray-500">{item.desc}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Software */}
                        <div>
                            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Software & Tools</h4>
                            <div className="space-y-4">
                                {gear.software.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl text-gray-400 group-hover:text-white transition-colors">{item.icon}</span>
                                            <span className="text-gray-200 font-medium">{item.name}</span>
                                        </div>
                                        <span className="text-xs text-gray-500">{item.desc}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* 6. YENİ: AKADEMİK ODAK (YBS VİZYONU) */}
                <motion.div variants={itemVariants} className="mb-24">
                    <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                        <FaGraduationCap className="text-green-500"/> YBS Akademik Odak Alanlarım
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Teknik */}
                        <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 hover:border-blue-500/30 transition-colors">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400 mb-4">
                                <FaCode />
                            </div>
                            <h4 className="text-white font-bold mb-4">Bilişim & Yazılım</h4>
                            <div className="flex flex-wrap gap-2">
                                {['Veri Madenciliği', 'Algoritma ve Programlama', 'Veri Tabanı Yön.', 'Web Teknolojileri', 'Mobil Prog.'].map((course, i) => (
                                    <span key={i} className="text-xs text-gray-400 bg-slate-900 border border-slate-700 px-2 py-1 rounded">
                                 {course}
                             </span>
                                ))}
                            </div>
                        </div>

                        {/* İşletme */}
                        <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 hover:border-yellow-500/30 transition-colors">
                            <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center text-yellow-400 mb-4">
                                <FaBriefcase />
                            </div>
                            <h4 className="text-white font-bold mb-4">İşletme & Finans</h4>
                            <div className="flex flex-wrap gap-2">
                                {['Finansal Muhasebe', 'Dijital Pazarlama', 'İstatistik', 'Girişimcilik', 'Ekonomi'].map((course, i) => (
                                    <span key={i} className="text-xs text-gray-400 bg-slate-900 border border-slate-700 px-2 py-1 rounded">
                                 {course}
                             </span>
                                ))}
                            </div>
                        </div>

                        {/* Yönetim */}
                        <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 hover:border-purple-500/30 transition-colors">
                            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400 mb-4">
                                <FaLightbulb />
                            </div>
                            <h4 className="text-white font-bold mb-4">Sistem & Yönetim</h4>
                            <div className="flex flex-wrap gap-2">
                                {['Sistem Analizi', 'Proje Yönetimi', 'ERP Sistemleri', 'Bilişim Hukuku', 'Karar Destek Sis.'].map((course, i) => (
                                    <span key={i} className="text-xs text-gray-400 bg-slate-900 border border-slate-700 px-2 py-1 rounded">
                                 {course}
                             </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* 6. YENİ: CV İNDİRME (CTA) */}
                <motion.div variants={itemVariants} className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/30 rounded-3xl p-12 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Daha Fazlasını Keşfedin</h2>
                        <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
                            Deneyimlerim, eğitim detaylarım ve yetkinliklerimin tamamı için detaylı özgeçmişimi inceleyebilirsiniz.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <a
                                href="/cv.pdf" // Public klasörüne cv.pdf dosyasını koyman lazım
                                download="SeninAdin_CV.pdf"
                                className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-white/20"
                            >
                                <FaFilePdf className="text-red-600" /> Özgeçmişi İndir (PDF)
                            </a>
                            <a
                                href="/contact"
                                className="px-8 py-4 bg-slate-800/50 text-white font-bold rounded-xl border border-slate-600 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
                            >
                                İletişime Geç
                            </a>
                        </div>
                    </div>
                </motion.div>

            </motion.div>
        </div>
    );
};

export default About;