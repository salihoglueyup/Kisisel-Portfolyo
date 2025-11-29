// client/src/context/LanguageContext.jsx
import { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

// --- SÖZLÜK (TRANSLATIONS) ---
const translations = {
    tr: {
        navbar: {
            home: "Ana Sayfa",
            about: "Hakkımda",
            projects: "Projeler",
            blog: "Blog",
            contact: "İletişim"
        },
        home: {
            badge: "Sistem Online • v2.5",
            titlePart1: "Veriyi",
            titlePart2: "Kodlayan",
            titlePart3: "Zihin.",
            typewriter: [
                'Yönetim Bilişim Sistemleri.',
                'Full Stack Development.',
                'Data Engineering.'
            ],
            btnProject: "Projelerimi Gör",
            btnGithub: "GitHub",
            stats: "Sayılarla Ben",
            statsDesc: "Yazılım serüvenimden güncel metrikler",
            dashboardTitle: "Komuta Merkezi",
            dashboardDesc: "Canlı sistem verileri ve geliştirme günlükleri."
        }
        // Diğer sayfalar (About, Contact vs.) buraya eklenecek...
    },
    en: {
        navbar: {
            home: "Home",
            about: "About",
            projects: "Projects",
            blog: "Blog",
            contact: "Contact"
        },
        home: {
            badge: "System Online • v2.5",
            titlePart1: "The Mind That",
            titlePart2: "Codes",
            titlePart3: "Data.",
            typewriter: [
                'Management Information Systems.',
                'Full Stack Development.',
                'Data Engineering.'
            ],
            btnProject: "View Projects",
            btnGithub: "GitHub",
            stats: "Me in Numbers",
            statsDesc: "Current metrics from my coding journey",
            dashboardTitle: "Command Center",
            dashboardDesc: "Live system data and development logs."
        }
    }
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('tr'); // Varsayılan Türkçe

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === 'tr' ? 'en' : 'tr'));
    };

    // Çeviri fonksiyonu: t('home.titlePart1') gibi kullanılır
    const t = (key) => {
        const keys = key.split('.');
        let value = translations[language];
        keys.forEach((k) => {
            value = value ? value[k] : key;
        });
        return value;
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);