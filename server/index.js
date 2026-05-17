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

connectDB();

const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    logger.info(`Sunucu ${PORT} portunda çalışıyor...`);
});
