const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
    // Mevcut bir status kodu varsa onu kullan, yoksa 500
    const statusCode = res.statusCode ? res.statusCode : 500;

    res.status(statusCode);

    // Hata durumunu log dosyasına yaz
    logger.error(`${statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    if (process.env.NODE_ENV !== 'production') {
        logger.error(err.stack); // Geliştirme ekranında stack izini de kaydedelim
    }

    // Üretim ortamında gerçek hata mesajını gizlemek isteyebiliriz
    res.json({
        success: false,
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = { errorHandler };
