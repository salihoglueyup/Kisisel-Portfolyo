// server/seeder.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Project = require('./models/Project'); // Proje modelini çağırıyoruz

dotenv.config();

// Veritabanına bağlan (index.js'teki mantığın aynısı ama tek seferlik)
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Bağlandı...'))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });

const projects = [
    {
        title: "Kişisel Portfolyo V1",
        description: "React ve Node.js kullanılarak geliştirilmiş, admin panelli full-stack kişisel web sitesi.",
        tags: ["React", "Node.js", "MongoDB", "Tailwind"],
        metrics: {
            complexity: 7,
            hoursSpent: 45,
            linesOfCode: 3200
        },
        links: {
            github: "https://github.com/senin-kullanici-adin/portfolio",
            live: "https://senin-siten.com"
        }
    },
    {
        title: "E-Ticaret Veri Analizi Dashboard",
        description: "Bir e-ticaret sitesinin satış verilerini analiz eden ve görselleştiren Python tabanlı dashboard.",
        tags: ["Python", "Pandas", "Data Visualization", "MIS"],
        metrics: {
            complexity: 9,
            hoursSpent: 60,
            linesOfCode: 1500
        },
        links: {
            github: "https://github.com/",
            live: "https://demo-link.com"
        }
    },
    {
        title: "Kurumsal Kaynak Planlama (ERP) Modülü",
        description: "Stok takibi ve faturalandırma işlemleri için geliştirilmiş mini ERP sistemi.",
        tags: ["C#", ".NET Core", "SQL Server"],
        metrics: {
            complexity: 8,
            hoursSpent: 80,
            linesOfCode: 5000
        },
        links: {
            github: "https://github.com/",
            live: ""
        }
    }
];

const importData = async () => {
    try {
        await Project.deleteMany(); // Önce temizle (Duplicate olmasın)
        await Project.insertMany(projects); // Verileri ekle

        console.log('✅ Veriler Başarıyla Eklendi!');
        process.exit();
    } catch (error) {
        console.error(`❌ Hata: ${error}`);
        process.exit(1);
    }
};

// Fonksiyonu çalıştır
importData();