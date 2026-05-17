import { motion } from 'framer-motion';
import {
    FaGraduationCap, FaBriefcase, FaCode, FaBrain, FaCoffee, FaGamepad, FaCodeBranch,FaDesktop,
    FaLaptopCode, FaLanguage, FaUserAstronaut, FaQuoteLeft, FaLightbulb, FaRocket, FaFilePdf,FaTablet,FaWindows,
    FaBuilding, FaAward, FaCertificate, FaUsers, FaShieldAlt, FaRobot, FaDatabase, FaHandsHelping,
    FaServer, FaReact
} from 'react-icons/fa';
import {
    SiPython, SiJavascript, SiReact, SiNodedotjs, SiMongodb, SiPostgresql, SiDocker, SiFigma,
    SiWebstorm,SiPycharm,SiCisco,SiDbeaver,
    SiFastapi, SiDjango, SiPytorch, SiRedis, SiLinux, SiNginx
} from 'react-icons/si';
import { VscVscode } from "react-icons/vsc";
import profilFoto from '../../assets/profil.jpeg';
import SEO from '../../components/common/SEO';
import { useTranslation } from 'react-i18next';

const softwareTools = [
    { name: "WebStorm", desc: "Ana IDE (JavaScript & Front-End)" },
    { name: "PyCharm", desc: "Python Geliştirme Ortamı" },
    { name: "Cisco Packet Tracer", desc: "Ağ Simülasyonu & Konfigürasyon" },
    { name: "DBeaver", desc: "Veritabanı Yönetimi (SQL)" },
];

// AI/ML — kimliğin merkezi: öne çıkan kart
const aiCategory = {
    group: "AI / ML",
    icon: <FaBrain />,
    titleColor: "text-purple-300",
    chip: "border-purple-500/30 text-purple-200 hover:border-purple-400 hover:bg-purple-500/10",
    items: ["LangChain", "LightRAG", "Ollama", "RAG", "PyTorch", "Hugging Face", "Prompt Engineering", "Vector DB"]
};

const techCategories = [
    { group: "Backend", icon: <FaServer />, titleColor: "text-teal-300", chip: "border-teal-500/30 text-teal-200 hover:border-teal-400 hover:bg-teal-500/10", items: ["Python", "FastAPI", "Django", "Flask", "Node.js", "REST API", "Microservice", "Bash"] },
    { group: "Frontend", icon: <FaReact />, titleColor: "text-blue-300", chip: "border-blue-500/30 text-blue-200 hover:border-blue-400 hover:bg-blue-500/10", items: ["React 18", "Vite", "JavaScript (ES6+)", "Tailwind CSS", "HTML5/CSS3", "Electron.js", "WebSocket"] },
    { group: "Veritabanı & DevOps", icon: <FaDatabase />, titleColor: "text-green-300", chip: "border-green-500/30 text-green-200 hover:border-green-400 hover:bg-green-500/10", items: ["PostgreSQL", "MongoDB", "Redis", "SQLite", "Docker", "GitHub Actions", "Nginx", "Linux", "VMware"] },
    { group: "Güvenlik & İzleme", icon: <FaShieldAlt />, titleColor: "text-cyan-300", chip: "border-cyan-500/30 text-cyan-200 hover:border-cyan-400 hover:bg-cyan-500/10", items: ["JWT", "RBAC", "OWASP", "Pentest", "SIEM", "Log Analizi", "ELK Stack", "Grafana"] },
];

const experience = [
    {
        company: "Metazon", role: "Yapay Zeka Stajyeri", date: "Ara 2025 – Mar 2026", place: "İstanbul (Hibrit)",
        points: [
            "AI destekli video üretimi, kurgu ve içerik süreçlerini uçtan uca yönetiyorum.",
            "Generative AI + Local LLM (Ollama, ComfyUI) ile görsel/video pipeline'ları ve ses klonlama/sentez kuruyorum.",
            "React + Django/Flask ile iç yönetim platformu geliştirip AI özellikleri (otomatik metin/özet) entegre ediyorum.",
            "İleri Prompt Engineering ve Python otomasyonuyla tekrarlayan görevlerin zaman maliyetini düşürüyorum."
        ]
    },
    {
        company: "Siber Vatan", role: "Siber Güvenlik Kursiyeri", date: "Kas 2025 – Mar 2026", place: "İstanbul (Uzaktan)",
        points: [
            "Red Team (sızma testi, payload geliştirme) ve Blue Team (SOC, log analizi) uygulamalı lab çalışmaları.",
            "Gerçek senaryolarla ağ güvenliği, zafiyet analizi ve sistem sıkılaştırma.",
            "CTF yarışmaları ve simülasyon ortamlarında ofansif/defansif beceri geliştirme."
        ]
    },
    {
        company: "İlkay Denizcilik", role: "Bilgi Teknolojileri Stajyeri", date: "Eki 2025 – Kas 2025", place: "İstanbul (Ofis)",
        points: [
            "BT altyapısının yönetimi ve günlük operasyonlara destek sağladım.",
            "Excel script/makrolarıyla raporlama ve veri girişini otomatize ederek manuel iş yükünü azalttım."
        ]
    },
    {
        company: "Bluesense", role: "Yapay Zeka Mühendisi Stajyeri", date: "Eyl 2025 – Kas 2025", place: "İstanbul (Uzaktan)",
        points: [
            "AI modellerinin araştırılması, testi ve sisteme entegrasyonunda görev aldım.",
            "Python web scraping bot'larıyla ML eğitimi için büyük ölçekli veri setleri topladım.",
            "Veri madenciliği ve preprocessing ile ham veriyi analize hazır hale getirdim."
        ]
    },
    {
        company: "Techbros", role: "Veri Analizi Stajyeri", date: "Tem 2025 – Ağu 2025", place: "İstanbul (Uzaktan)",
        points: [
            "Python ile ETL süreçleri; SQL sorgulama/optimizasyon işlemleri gerçekleştirdim.",
            "Power BI ile interaktif rapor/dashboard tasarladım.",
            "IBM Cloud Pak for Data üzerinden BI ve AI tabanlı analitik çözümler geliştirdim."
        ]
    },
    {
        company: "Öztiryakiler Savunma", role: "Bilgi Teknolojileri Stajyeri", date: "Mar 2025 – Haz 2025", place: "Tekirdağ (Ofis)",
        points: [
            "Log analizi, zafiyet taraması ve ağ güvenliği denetimleri gerçekleştirdim.",
            "Python otomasyon script'leri ve SQL veritabanı operasyonları geliştirdim.",
            "Ağ cihazı yapılandırması, sistem kurulumları ve donanım/yazılım sorun çözümü."
        ]
    },
    {
        company: "İstanbul Aydın Üniversitesi", role: "Bilgi Teknolojileri Stajyeri", date: "Eki 2024 – Ara 2024", place: "İstanbul (Ofis)",
        points: [
            "Üniversite IT altyapısı, ağ yönetimi ve envanter takibine teknik destek sağladım.",
            "Donanım/yazılım sorun tespiti, sistem bakımı, güncelleme ve veri yedekleme süreçlerini yürüttüm.",
            "Kampüs ağ güvenliği ve laboratuvar cihaz konfigürasyonlarında aktif rol aldım."
        ]
    },
];

// Öne çıkan: bir program kabulü (sertifika değil) — ayrı vurgulu şerit
const featuredCert = {
    title: "İleri Seviye Siber Güvenlik",
    issuer: "IBM AI4Future",
    date: "2026",
    tag: "Program · Kabul"
};

const certGroups = [
    {
        group: "Yapay Zeka",
        icon: <FaBrain />,
        accent: "text-purple-300",
        items: [
            { title: "Anthropic Academy — 10 Sertifika", issuer: "Claude Code, MCP, Subagents, Agent Skills, Claude API…", date: "May 2026" },
            { title: "Career Essentials in Generative AI", issuer: "Microsoft & LinkedIn", date: "Şub 2026" },
            { title: "AI Literacy for Everyone", issuer: "LinkedIn", date: "Şub 2026" },
            { title: "Akbank Generative AI Bootcamp", issuer: "Global AI Hub", date: "Kas 2025" },
        ]
    },
    {
        group: "Veri & BI",
        icon: <FaDatabase />,
        accent: "text-green-300",
        items: [
            { title: "Veri Bilimi ve Yapay Zeka Eğitimi", issuer: "Doğuş Teknoloji", date: "Kas 2025" },
            { title: "InternCamp2025 (SQL, Veri Müh./Bilimi, BI)", issuer: "TECHBROS", date: "Ağu 2025" },
        ]
    },
    {
        group: "Siber Güvenlik & Sistem",
        icon: <FaShieldAlt />,
        accent: "text-cyan-300",
        items: [
            { title: "Network Güvenliği Temelleri", issuer: "Siber Kulüpler Birliği", date: "Eyl 2025" },
            { title: "Introduction to Cybersecurity", issuer: "Cisco Networking Academy", date: "Ağu 2025" },
            { title: "Operating Systems Basics", issuer: "Cisco Networking Academy", date: "Ağu 2025" },
        ]
    },
];

const leadership = [
    {
        title: "Gönüllü Ekip Lideri", org: "AFAD (Afet ve Acil Durum Yönetimi)", date: "2022 – Devam ediyor",
        desc: "3+ yıl aktif gönüllü hizmet; 15 kişilik müdahale ekibine liderlik, ulusal operasyonlarda saha koordinasyonu ve kriz yönetimi.",
        icon: <FaHandsHelping className="text-red-400" />
    },
    {
        title: "Sınıf Temsilcisi", org: "İstanbul Aydın Üniversitesi", date: "2024 – 2026",
        desc: "2 akademik yıl boyunca seçildim; öğrenci-akademisyen iletişiminin köprüsü olarak etkinlik ve geri bildirim süreçlerini yönettim.",
        icon: <FaUsers className="text-purple-400" />
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
};

const About = () => {
    const { t } = useTranslation();
    // Eğitim & kilometre taşları — staj tekrarını önlemek için sade tutuldu (detay: Deneyim bölümü)
    const timeline = [
        { year: "2026", title: "Mezuniyet (Beklenen)", desc: "İstanbul Aydın Üniversitesi — Yönetim Bilişim Sistemleri (Lisans).", icon: <FaGraduationCap /> },
        { year: "2026", title: "IBM AI4Future — İleri Siber Güvenlik", desc: "İleri seviye siber güvenlik programına kabul aldım.", icon: <FaShieldAlt /> },
        { year: "2022", title: "Üniversiteye Başlangıç", desc: "İstanbul Aydın Üniversitesi YBS lisans eğitimine başladım (Ağu 2022).", icon: <FaCode /> },
    ];

    return (
        <div className="min-h-screen bg-[#0B1120] text-gray-300 font-sans pt-24 pb-20 px-6 overflow-x-hidden">
            <SEO
                title="Hakkımda"
                description="Eyüp Zeki Salihoğlu - Yönetim Bilişim Sistemleri öğrencisi, Full Stack Developer. Kariyer geçmişi, yetenekler ve eğitim."
                type="profile"
                schema={{
                    '@context': 'https://schema.org',
                    '@type': 'ProfilePage',
                    mainEntity: {
                        '@type': 'Person',
                        name: 'Eyüp Zeki Salihoğlu',
                        jobTitle: 'Full Stack Developer',
                        description: 'Yönetim Bilişim Sistemleri öğrencisi, MERN Stack Full Stack Developer.',
                        knowsLanguage: ['tr', 'en'],
                        sameAs: [
                            'https://github.com/salihoglueyup',
                            'https://www.linkedin.com/in/eyupzekisalihoglu/'
                        ]
                    }
                }}
            />

            <motion.div
                className="max-w-6xl mx-auto flex flex-col"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >

                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center mb-24">
                    <motion.div className="md:col-span-4 relative group" variants={itemVariants}>
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
                        <div className="relative bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden aspect-square shadow-2xl">
                            <img
                                src={profilFoto}
                                alt="Eyüp Zeki Salihoğlu profil fotoğrafı"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/60 to-transparent"></div>
                        </div>
                    </motion.div>


                    <motion.div className="md:col-span-8" variants={itemVariants}>
                        <div className="flex flex-wrap gap-3 mb-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 border border-blue-500/20 rounded-full bg-blue-500/5 text-blue-400 text-xs font-mono">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                {t('about.open_for_work')}
                            </div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 border border-cyan-500/30 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-mono">
                                <FaShieldAlt className="text-cyan-400" />
                                IBM AI4Future · İleri Siber Güvenlik (Kabul)
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                            {t('about.hero_title_1')} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                                {t('about.hero_title_2')}
                            </span>
                        </h1>
                        <p className="text-lg leading-relaxed text-gray-400 mb-6 border-l-4 border-blue-500/50 pl-4">
                            {t('about.hero_desc')}
                        </p>

                        <div className="flex flex-wrap gap-4 mt-8">
                            <div className="flex items-center gap-2 px-4 py-2 bg-[#1e293b] rounded-lg border border-slate-700 text-sm hover:border-blue-500 transition-colors">
                                <FaCoffee className="text-yellow-500"/> {t('about.badge_solver')}
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-[#1e293b] rounded-lg border border-slate-700 text-sm hover:border-purple-500 transition-colors">
                                <FaGamepad className="text-purple-500"/> {t('about.badge_tech')}
                            </div>
                        </div>
                    </motion.div>
                </div>

                <motion.div variants={itemVariants} className="mb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    <div className="lg:col-span-7 space-y-6 text-lg leading-relaxed text-gray-400">
                        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                            <FaUserAstronaut className="text-blue-500" /> {t('about.journey_title')}
                        </h2>
                        <p>
                            Yazılım yolculuğum, <strong className="text-white">Yönetim Bilişim Sistemleri</strong> disipliniyle başladı; ama beni asıl heyecanlandıran, teknolojinin gerçek dünya problemlerini nasıl çözdüğüydü.
                            Bugün <strong className="text-white">Full-Stack AI Engineer</strong> olarak production seviyesinde RAG sistemleri ve kurumsal web uygulamaları geliştiriyorum.
                        </p>
                        <p>
                            React ve FastAPI ile uçtan uca ürünler kuruyor; LangChain, vector database'ler ve local LLM altyapılarıyla
                            yapay zekayı işin merkezine yerleştiriyorum. <strong className="text-white">JWT, RBAC ve OWASP</strong> standartlarıyla güvenli yazılım geliştirmeyi bir prensip olarak benimsiyorum.
                        </p>
                        <p>
                            Metazon, Bluesense ve Techbros gibi şirketlerdeki stajlarımda GenAI pipeline'larından veri madenciliğine
                            uzanan bir deneyim kazandım. Siber Vatan'da Red &amp; Blue Team operasyonlarıyla ofansif ve defansif güvenliği
                            saha üzerinde öğrendim. Hedefim: ölçeklenebilir, güvenli ve gerçekten değer üreten AI sistemleri kurmak.
                        </p>
                    </div>

                    <div className="lg:col-span-5">
                        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-8 relative overflow-hidden">
                            <FaQuoteLeft className="absolute top-4 right-4 text-4xl text-slate-800" />
                            <h3 className="text-xl font-bold text-white mb-6">{t('about.principles_title')}</h3>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400 shrink-0"><FaLightbulb /></div>
                                    <div>
                                        <h4 className="font-bold text-white">{t('about.principle_curiosity')}</h4>
                                        <p className="text-sm text-gray-500">{t('about.principle_curiosity_desc')}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400 shrink-0"><FaBrain /></div>
                                    <div>
                                        <h4 className="font-bold text-white">{t('about.principle_analytic')}</h4>
                                        <p className="text-sm text-gray-500">{t('about.principle_analytic_desc')}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center text-green-400 shrink-0"><FaRocket /></div>
                                    <div>
                                        <h4 className="font-bold text-white">{t('about.principle_results')}</h4>
                                        <p className="text-sm text-gray-500">{t('about.principle_results_desc')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* EĞİTİM & KİLOMETRE TAŞLARI */}
                <motion.div variants={itemVariants} className="mb-24">
                    <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                        <FaCodeBranch className="text-blue-500" />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">Eğitim & Kilometre Taşları</span>
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

                {/* DENEYİM */}
                <motion.div variants={itemVariants} className="mb-24">
                    <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                        <FaBuilding className="text-blue-500" />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">Deneyim</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {experience.map((exp, idx) => (
                            <div key={idx} className="bg-[#111827] border border-slate-800 rounded-xl p-6 hover:border-blue-500/40 transition-all">
                                <div className="flex items-start justify-between mb-1 gap-3">
                                    <h3 className="text-white font-bold">{exp.company}</h3>
                                    <time className="font-mono text-[11px] text-blue-400 bg-blue-400/10 px-2 py-1 rounded shrink-0">{exp.date}</time>
                                </div>
                                <p className="text-sm text-blue-300 mb-1">{exp.role}</p>
                                <p className="text-xs text-gray-500 mb-3">{exp.place}</p>
                                <ul className="space-y-1.5">
                                    {exp.points.map((p, i) => (
                                        <li key={i} className="text-sm text-gray-400 flex gap-2">
                                            <span className="text-blue-500 mt-1 shrink-0">▹</span>{p}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* SERTİFİKALAR & EĞİTİMLER */}
                <motion.div variants={itemVariants} className="mb-24">
                    <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <FaCertificate className="text-yellow-500"/> Sertifikalar & Eğitimler
                        </h2>
                        <span className="text-xs font-mono text-yellow-400 bg-yellow-400/10 border border-yellow-400/30 px-3 py-1 rounded-full">20+ Sertifika</span>
                    </div>

                    {/* Öne çıkan: IBM AI4Future (program kabulü) */}
                    <div className="mb-8 bg-gradient-to-r from-cyan-900/30 to-[#111827] border border-cyan-500/40 rounded-2xl p-6 flex items-center gap-5">
                        <div className="text-3xl text-cyan-300 shrink-0"><FaShieldAlt /></div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-white font-bold">{featuredCert.title}</h3>
                                <span className="text-[10px] font-bold text-cyan-300 bg-cyan-400/10 border border-cyan-500/30 px-2 py-0.5 rounded-full">{featuredCert.tag}</span>
                            </div>
                            <p className="text-sm text-cyan-200/70">{featuredCert.issuer} • {featuredCert.date}</p>
                        </div>
                    </div>

                    {/* Kategoriye göre gruplu sertifikalar */}
                    <div className="space-y-8">
                        {certGroups.map((grp, gi) => (
                            <div key={gi}>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className={`text-lg ${grp.accent}`}>{grp.icon}</span>
                                    <h3 className={`text-sm font-bold uppercase tracking-wider ${grp.accent}`}>{grp.group}</h3>
                                    <span className="text-[10px] font-mono text-gray-500 bg-slate-800 px-2 py-0.5 rounded-full">{grp.items.length}</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {grp.items.map((cert, idx) => (
                                        <div key={idx} className="bg-[#111827] border border-slate-800 rounded-xl p-4 hover:border-yellow-500/40 transition-colors">
                                            <h4 className="text-white font-bold text-sm mb-1">{cert.title}</h4>
                                            <p className="text-xs text-gray-500">{cert.issuer} • {cert.date}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* LİDERLİK & GÖNÜLLÜLÜK */}
                <motion.div variants={itemVariants} className="mb-24">
                    <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                        <FaUsers className="text-purple-500"/> Liderlik & Gönüllülük
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {leadership.map((lead, idx) => (
                            <div key={idx} className="p-6 bg-[#111827] border border-slate-800 rounded-xl hover:border-purple-500/40 transition-colors">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="text-xl shrink-0">{lead.icon}</div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <h4 className="text-white font-bold">{lead.title}</h4>
                                            <time className="font-mono text-[11px] text-purple-400 bg-purple-400/10 px-2 py-1 rounded shrink-0">{lead.date}</time>
                                        </div>
                                        <p className="text-xs text-purple-300">{lead.org}</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-400">{lead.desc}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* TEKNOLOJİ & GELİŞTİRME ORTAMI (Tech + Gear birleşik) */}
                <motion.div variants={itemVariants} className="mb-24">
                    <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                        <FaCode className="text-blue-500"/> Teknoloji & Geliştirme Ortamım
                    </h2>

                    {/* Öne çıkan: AI / ML (kimliğin merkezi) */}
                    <div className="mb-6 bg-gradient-to-br from-purple-900/25 to-[#111827] border border-purple-500/30 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-2xl text-purple-300">{aiCategory.icon}</span>
                            <h3 className={`text-lg font-bold ${aiCategory.titleColor}`}>{aiCategory.group}</h3>
                            <span className="text-xs font-mono text-purple-400/70 bg-purple-500/10 px-2 py-0.5 rounded-full">{aiCategory.items.length}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {aiCategory.items.map((it, i) => (
                                <span key={i} className={`text-xs px-3 py-1.5 rounded-full bg-slate-800/60 border transition-colors ${aiCategory.chip}`}>{it}</span>
                            ))}
                        </div>
                    </div>

                    {/* Diğer 4 kategori — 2×2 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                        {techCategories.map((cat, idx) => (
                            <div key={idx} className="bg-[#111827] border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className={`text-xl ${cat.titleColor}`}>{cat.icon}</span>
                                    <h3 className={`text-sm font-bold uppercase tracking-wider ${cat.titleColor}`}>{cat.group}</h3>
                                    <span className="text-[10px] font-mono text-gray-500 bg-slate-800 px-2 py-0.5 rounded-full">{cat.items.length}</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {cat.items.map((it, i) => (
                                        <span key={i} className={`text-xs px-3 py-1.5 rounded-full bg-slate-800/60 border transition-colors ${cat.chip}`}>{it}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Geliştirme Ortamı — Software & Tools (kompakt) */}
                    <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <FaLaptopCode className="text-blue-400"/> {t('about.software')}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {softwareTools.map((item, i) => (
                                <span key={i} title={item.desc} className="text-xs text-gray-300 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-full hover:border-blue-500/50 transition-colors cursor-default">
                                    {item.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* CV İNDİRME (CTA) */}
                <motion.div variants={itemVariants} className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/30 rounded-3xl p-12 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{t('about.cv_title')}</h2>
                        <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
                            {t('about.cv_desc')}
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <a
                                href="/cv.pdf"
                                download="EyupZekiSalihoglu_CV.pdf"
                                className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-white/20"
                            >
                                <FaFilePdf className="text-red-600" /> {t('about.cv_download')}
                            </a>
                            <a
                                href="/contact"
                                className="px-8 py-4 bg-slate-800/50 text-white font-bold rounded-xl border border-slate-600 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
                            >
                                {t('about.cv_contact')}
                            </a>
                        </div>
                    </div>
                </motion.div>

            </motion.div>
        </div>
    );
};

export default About;