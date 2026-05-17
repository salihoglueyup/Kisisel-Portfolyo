const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
    // Express 5'te res.statusCode default 200 — hata durumunda 500 olmalı
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    // Mongoose CastError (geçersiz ObjectId)
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 404;
        message = 'Kaynak bulunamadı. Geçersiz ID formatı.';
    }

    // Mongoose Validation Error
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map(val => val.message).join(', ');
    }

    // Mongoose Duplicate Key Error
    if (err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyValue).join(', ');
        message = `Bu ${field} değeri zaten kullanılıyor.`;
    }

    res.status(statusCode);

    const isProd = process.env.NODE_ENV === 'production';

    // Hata durumunu log dosyasına yaz (tam detay yalnız sunucu tarafında)
    logger.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    if (!isProd) {
        logger.error(err.stack);
    }

    // Production'da beklenmeyen 5xx hatalarının ham mesajı istemciye SIZMASIN.
    // 4xx (operasyonel) hatalar kullanıcıya anlamlıdır; olduğu gibi gönderilir.
    const clientMessage = (isProd && statusCode >= 500)
        ? 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.'
        : message;

    res.json({
        success: false,
        message: clientMessage,
        ...(isProd ? {} : { stack: err.stack }),
    });
};

module.exports = { errorHandler };
