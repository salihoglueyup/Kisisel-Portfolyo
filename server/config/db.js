const mongoose = require('mongoose');
const logger = require('./logger');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        logger.info(`MongoDB Bağlantısı Başarılı: ${conn.connection.host}`);
    } catch (error) {
        logger.error(`MongoDB ilk bağlantı hatası: ${error.message}`);
        process.exit(1); // İlk bağlantı kurulamazsa uygulamayı kapat
    }
};

// İlk bağlantıdan SONRAKİ kopma/hata olayları (ağ kesintisi, DB restart vb.)
mongoose.connection.on('error', (err) => {
    logger.error(`MongoDB bağlantı hatası: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB bağlantısı koptu — yeniden bağlanmaya çalışılıyor...');
});

mongoose.connection.on('reconnected', () => {
    logger.info('MongoDB yeniden bağlandı.');
});

module.exports = connectDB;
