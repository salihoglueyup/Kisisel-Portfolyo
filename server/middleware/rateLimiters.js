// Rate limiter'lar tek yerde — app.js bunları tüketir, route'lar
// (ör. iletişim formu) kendi sıkı limitini buradan alır.
//
// Testte TÜM limiter'lar no-op (testler limite takılmasın) — bu yüzden
// app.js'te ayrıca isTest sarmalamaya gerek yok.

const rateLimit = require('express-rate-limit');

const isTest = process.env.NODE_ENV === 'test';
const noop = (_req, _res, next) => next();

const make = (options) => (isTest ? noop : rateLimit(options));

const baseOptions = {
    standardHeaders: true,
    legacyHeaders: false,
};

// Genel API trafiği — 15 dk'da 100 istek
const generalLimiter = make({
    ...baseOptions,
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, message: 'Çok fazla istek gönderildi. Lütfen 15 dakika sonra tekrar deneyin.' },
});

// Kimlik doğrulama (login/forgot/reset) — 15 dk'da 5 deneme
const authLimiter = make({
    ...baseOptions,
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { success: false, message: 'Çok fazla giriş denemesi. Lütfen 15 dakika sonra tekrar deneyin.' },
});

// İletişim formu — spam'e karşı sıkı: 1 saatte 5 mesaj
const contactLimiter = make({
    ...baseOptions,
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: { success: false, message: 'Çok fazla mesaj gönderildi. Lütfen 1 saat sonra tekrar deneyin.' },
});

module.exports = { generalLimiter, authLimiter, contactLimiter };
