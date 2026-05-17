// server/seeder.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Project = require('./models/Project');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Bağlandı...'))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });

const GITHUB = "https://github.com/salihoglueyup";

const projects = [
    {
        title: "CBAM Guard (CarbonTrace)",
        description: "AB Sınırda Karbon Düzenleme Mekanizması (SKDM/CBAM) için Garanti BBVA tasarım sistemine sadık, kurumsal seviye emisyon takibi ve finansal modelleme platformu.",
        tags: ["React", "FastAPI", "PostgreSQL", "RAG", "Docker"],
        category: "AI / RAG",
        role: "Full-Stack AI Engineer",
        status: "Tamamlandı",
        date: "Oca 2026 – Şub 2026",
        technicalArchitecture: { frontend: "React 18, Vite, Tailwind (SPA)", backend: "FastAPI, SQLAlchemy ORM, Native WebSockets", database: "PostgreSQL, Vector DB", devops: "Docker, Nginx, GitHub Actions" },
        features: ["RAG tabanlı mevzuat asistanı", "Kapsam 1-2-3 + ETS fiyatlı vergi motoru", "Canlı WebSocket bildirimleri", "JWT + Pydantic + RBAC"],
        metrics: { complexity: 10, hoursSpent: 180, linesOfCode: 14000 },
        links: { github: GITHUB, live: "" }
    },
    {
        title: "Tera FinCore AI",
        description: "Yüksek frekanslı, AI destekli algoritmik ticaret platformu. Gerçek zamanlı veri akışı, risk yönetimi ve fiyat tahminleme modelleri içeren modüler FinTech sistemi.",
        tags: ["FastAPI", "PyTorch", "FinBERT", "React", "WebSocket"],
        category: "AI / ML",
        role: "AI Engineer & Mimar",
        status: "Devam Ediyor",
        date: "Şub 2026 – Devam ediyor",
        technicalArchitecture: { frontend: "React, Vite, Tailwind, TradingView WebSocket", backend: "FastAPI microservices", database: "PostgreSQL, MongoDB, Redis", devops: "Docker Compose, Nginx" },
        features: ["PyTorch LSTM fiyat tahmini", "FinBERT duyarlılık analizi", "Canlı dashboard", "Mikroservis mimari"],
        metrics: { complexity: 10, hoursSpent: 220, linesOfCode: 19000 },
        links: { github: GITHUB, live: "" }
    },
    {
        title: "LunarTech AI",
        description: "Supabase PGVector, LightRAG ve Grok 4.1 ile PDF dokümanlarını analiz edip otonom 20.000+ kelimelik yapılandırılmış rehberler üreten AI mühendisliği uygulaması.",
        tags: ["LightRAG", "PGVector", "Grok 4.1", "Streamlit", "RAG"],
        category: "AI / RAG",
        role: "AI Engineer",
        status: "Tamamlandı",
        date: "Şub 2026 – Mar 2026",
        technicalArchitecture: { frontend: "Streamlit Chat UI", backend: "LightRAG, LongWriter, OpenRouter (Grok 4.1)", database: "Supabase PostgreSQL (PGVector)", devops: "—" },
        features: ["Knowledge Graph ayrıştırma", "LongWriter ile hiyerarşik üretim", "Intent algılama", "20.000+ kelime otonom rehber"],
        metrics: { complexity: 9, hoursSpent: 95, linesOfCode: 7000 },
        links: { github: GITHUB, live: "" }
    },
    {
        title: "Metazon 360",
        description: "Metazon'un operasyonel iş akışını, görev dağılımını ve içerik üretimini tek merkezden yöneten, AI destekli uçtan uca kurumsal yönetim ve otomasyon platformu.",
        tags: ["React", "Vite", "Django", "MongoDB", "Redis", "N8N"],
        category: "Full-Stack",
        role: "Full-Stack Geliştirici & Mimar",
        status: "Devam Ediyor",
        date: "Kas 2025 – Devam ediyor",
        technicalArchitecture: { frontend: "React, Vite (dashboard)", backend: "Python (Django/Flask), N8N", database: "MongoDB, Redis", devops: "—" },
        features: ["Kanban görev modülleri", "RBAC yetkilendirme", "AI API entegrasyonları (özet/metin)", "Anlık veri raporlama"],
        metrics: { complexity: 9, hoursSpent: 190, linesOfCode: 16000 },
        links: { github: GITHUB, live: "" }
    },
    {
        title: "UBIS Yeniden Yapılandırma",
        description: "Üniversitenin Öğrenci Bilgi Sistemi'ndeki performans/arayüz sorunlarını çözen; modern, güvenli ve mobile-first bağımsız re-platforming projesi.",
        tags: ["React", "Vite", "JavaScript", "RBAC", "Secure API"],
        category: "Full-Stack",
        role: "Frontend & Güvenlik",
        status: "Devam Ediyor",
        date: "Oca 2026 – Devam ediyor",
        technicalArchitecture: { frontend: "React + Vite, mobile-first SPA", backend: "Ölçeklenebilir Secure API", database: "—", devops: "—" },
        features: ["Yüksek render performansı", "RBAC yetki izolasyonu (öğrenci/akademisyen/idari)", "Responsive dinamik SPA"],
        metrics: { complexity: 8, hoursSpent: 120, linesOfCode: 8500 },
        links: { github: GITHUB, live: "" }
    },
    {
        title: "CyberGuard AI (Bitirme Projesi)",
        description: "Sistem log'larını gerçek zamanlı analiz eden Blue Team asistanı. Local LLM RAG mimarisiyle hassas veriyi cloud'a göndermeden bağlamsal güvenlik önerileri sunar.",
        tags: ["Python", "Local LLM", "RAG", "Cybersecurity"],
        category: "Cybersecurity",
        role: "Geliştirici",
        status: "Devam Ediyor",
        date: "2026 (Bitirme)",
        technicalArchitecture: { frontend: "SOC raporlama arayüzü", backend: "Python, Local LLM RAG", database: "Vector DB", devops: "—" },
        features: ["Gerçek zamanlı log analizi", "Bağlamsal güvenlik önerileri", "Tehdit/zafiyet görselleştirme", "Otomatik raporlama"],
        metrics: { complexity: 9, hoursSpent: 150, linesOfCode: 9500 },
        links: { github: GITHUB, live: "" }
    },
    {
        title: "İ.A.Ü. Proje Takip Veritabanı",
        description: "Üniversite mezuniyet ve ekip projelerini dijitalleştiren, Microsoft 365 ekosistemiyle tam entegre kapsamlı SharePoint platformu.",
        tags: ["SharePoint", "Azure AD", "Microsoft 365"],
        category: "Kurumsal",
        role: "Sistem Mimarı",
        status: "Tamamlandı",
        date: "Mar 2025 – Haz 2025",
        technicalArchitecture: { frontend: "SharePoint", backend: "Microsoft 365 API", database: "Microsoft 365", devops: "Azure AD / Office 365" },
        features: ["Azure AD güvenli giriş", "RBAC veri gizliliği", "Kanban + zaman çizelgesi", "Eş zamanlı belge & raporlama"],
        metrics: { complexity: 7, hoursSpent: 90, linesOfCode: 4000 },
        links: { github: "", live: "" }
    },
    {
        title: "Akıllı Enerji & Deprem İzleme (TÜBİTAK 2209-A)",
        description: "Sanayi altyapılarında enerji verimliliği ve yapısal güvenliği anlık izleyen, donanım-yazılım entegrasyonlu TÜBİTAK destekli IoT projesi.",
        tags: ["Python", "Arduino", "IoT", "SQL"],
        category: "IoT / Araştırma",
        role: "Sistem Mimarı & Geliştirici",
        status: "Tamamlandı",
        date: "Şub 2025 – May 2025",
        technicalArchitecture: { frontend: "—", backend: "Python analiz scriptleri", database: "SQL", devops: "Arduino seri haberleşme" },
        features: ["Çoklu sensör veri toplama (DHT11, voltaj, deprem)", "Enerji tüketim/anomali analizi", "Uçtan uca sistem mimarisi"],
        metrics: { complexity: 8, hoursSpent: 130, linesOfCode: 5000 },
        links: { github: GITHUB, live: "" }
    },
    {
        title: "Hearts of Iron IV — Millennium Dawn TR Yerelleştirme",
        description: "Strateji oyunu HOI4'ün modern çağ modu Millennium Dawn için yürütülen gönüllü Türkçe yerelleştirme ve çeviri projesi.",
        tags: ["Çeviri", "Lokalizasyon", "Topluluk"],
        category: "Gönüllü",
        role: "Yerelleştirme Katkıcısı",
        status: "Devam Ediyor",
        date: "Kas 2025 – Devam ediyor",
        technicalArchitecture: { frontend: "—", backend: "—", database: "—", devops: "—" },
        features: ["Binlerce satır metin çevirisi", "Anlamsal bütünlük & tarihsel doğruluk", "Topluluk testi"],
        metrics: { complexity: 5, hoursSpent: 60, linesOfCode: 0 },
        links: { github: "", live: "" }
    },
    {
        title: "Kişisel Web Portfolyosu",
        description: "Projeleri ve tech stack'i profesyonel sergileyen, mobile-first ve responsive kişisel web sitesi. Clean code mimarisi, açık kaynak ve canlı yayında.",
        tags: ["React", "Vite", "Tailwind", "Node.js", "MongoDB"],
        category: "Full-Stack",
        role: "Full-Stack Developer",
        status: "Tamamlandı",
        date: "Kas 2025 – Mar 2026",
        technicalArchitecture: { frontend: "React, Vite, Tailwind", backend: "Node.js, Express", database: "MongoDB", devops: "Vercel, GitHub Actions" },
        features: ["Admin panel", "i18n (TR/EN)", "PWA", "SEO & sitemap", "httpOnly + CSRF auth"],
        metrics: { complexity: 7, hoursSpent: 90, linesOfCode: 11000 },
        links: { github: "https://github.com/salihoglueyup/Kisisel-Portfolyo", live: "https://salihoglueyup.vercel.app" }
    }
];

const importData = async () => {
    // GÜVENLİK KALKANI: deleteMany() TÜM projeleri siler.
    // Production'da çalışmasın; kasıtlı kullanım için --force bayrağı gereksin.
    if (process.env.NODE_ENV === 'production') {
        console.error('❌ Seeder production ortamında çalıştırılamaz (veri kaybı riski).');
        process.exit(1);
    }
    if (!process.argv.includes('--force')) {
        console.error('⚠️  Bu işlem TÜM projeleri siler ve verilen veriyle değiştirir.');
        console.error('   Eminseniz: node seeder.js --force');
        process.exit(1);
    }

    try {
        await Project.deleteMany();
        await Project.insertMany(projects);
        console.log(`✅ ${projects.length} proje başarıyla eklendi!`);
        process.exit();
    } catch (error) {
        console.error(`❌ Hata: ${error}`);
        process.exit(1);
    }
};

importData();
