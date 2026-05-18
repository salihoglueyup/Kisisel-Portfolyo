const dotenv = require('dotenv');
const connectDB = require('./config/db');
const logger = require('./config/logger');

dotenv.config();

// Environment variable doğrulama
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];
const missingVars = requiredEnvVars.filter(v => !process.env[v]);
if (missingVars.length > 0) {
    logger.error(`Eksik environment değişkenleri: ${missingVars.join(', ')}`);
    logger.error('Lütfen .env dosyasını kontrol edin. Örnek: .env.example');
    process.exit(1);
}

// Production'da JWT secret güç doğrulaması — zayıf/placeholder secret ile
// imzalanan token'lar tahmin edilebilir; access ve refresh secret'i de
// AYNI olmamalı (refresh token access olarak kullanılamasın).
if (process.env.NODE_ENV === 'production') {
    const { JWT_SECRET, JWT_REFRESH_SECRET } = process.env;
    const MIN_SECRET_LENGTH = 32;

    // .env.example placeholder'ları ve yaygın zayıf değerler
    const WEAK_PATTERNS = [
        'your_jwt_secret', 'your_refresh_secret', 'change_in_production',
        'changeme', 'secret', 'password', 'test_access_secret', 'test_refresh_secret'
    ];

    const isWeak = (val) => {
        const v = String(val).toLowerCase();
        return val.length < MIN_SECRET_LENGTH || WEAK_PATTERNS.some(p => v.includes(p));
    };

    const problems = [];
    if (isWeak(JWT_SECRET)) {
        problems.push(`JWT_SECRET zayıf/placeholder veya ${MIN_SECRET_LENGTH} karakterden kısa`);
    }
    if (isWeak(JWT_REFRESH_SECRET)) {
        problems.push(`JWT_REFRESH_SECRET zayıf/placeholder veya ${MIN_SECRET_LENGTH} karakterden kısa`);
    }
    if (JWT_SECRET === JWT_REFRESH_SECRET) {
        problems.push('JWT_SECRET ve JWT_REFRESH_SECRET aynı olamaz');
    }

    if (problems.length > 0) {
        logger.error(`Güvensiz JWT yapılandırması (production): ${problems.join('; ')}`);
        logger.error('Güçlü, benzersiz secret üretin: openssl rand -hex 32');
        process.exit(1);
    }
}

connectDB();

const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    logger.info(`Sunucu ${PORT} portunda çalışıyor...`);
});
