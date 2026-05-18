const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { validateMessage } = require('../middleware/validationMiddleware');
const { contactLimiter } = require('../middleware/rateLimiters');
const { sendMessage, getMessages, markAsRead, deleteMessage } = require('../controllers/messageController');

// Public — ziyaretçi mesaj gönderebilir (spam'e karşı sıkı limit)
router.post('/', contactLimiter, validateMessage, sendMessage);

// Protected — sadece admin görebilir
router.get('/', protect, getMessages);
router.put('/:id/read', protect, markAsRead);
router.delete('/:id', protect, deleteMessage);

module.exports = router;