const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { validateMessage } = require('../middleware/validationMiddleware');
const { contactLimiter } = require('../middleware/rateLimiters');
const { sendMessage, getMessages, markAsRead, deleteMessage } = require('../controllers/messageController');

// Spam koruması — public mesaj gönderimi sıkı limitli. Testte devre dışı
// (testler limite takılmasın); yalnız POST /'a uygulanır, admin uçları
// (GET/PUT/DELETE) etkilenmez. app.js'teki limiter deseniyle aynı.
const isTest = process.env.NODE_ENV === 'test';
const contactLimiter = isTest
    ? (req, res, next) => next()
    : rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 5,
        message: { success: false, message: 'Çok fazla mesaj gönderildi. Lütfen 15 dakika sonra tekrar deneyin.' },
        standardHeaders: true,
        legacyHeaders: false,
    });

// Public — ziyaretçi mesaj gönderebilir (rate-limit + doğrulama)
// Public — ziyaretçi mesaj gönderebilir (spam'e karşı sıkı limit)
router.post('/', contactLimiter, validateMessage, sendMessage);

// Protected — sadece admin görebilir
router.get('/', protect, getMessages);
router.put('/:id/read', protect, markAsRead);
router.delete('/:id', protect, deleteMessage);

module.exports = router;