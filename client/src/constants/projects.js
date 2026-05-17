// Kanonik proje kategorileri — server/seeder.js'teki gerçek verilerle birebir.
// TEK KAYNAK: hem public Projects filtresi hem AddProject formu bunu kullanır,
// böylece panelden eklenen proje her zaman bir filtreye düşer.
export const PROJECT_CATEGORIES = [
    'AI / RAG',
    'AI / ML',
    'Full-Stack',
    'Cybersecurity',
    'IoT / Araştırma',
    'Kurumsal',
    'Gönüllü',
];

// Public filtre listesi — başında "All" ile.
export const PROJECT_FILTERS = ['All', ...PROJECT_CATEGORIES];
