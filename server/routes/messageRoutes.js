const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { validateMessage } = require('../middleware/validationMiddleware');
const { sendMessage, getMessages, markAsRead, deleteMessage } = require('../controllers/messageController');

// Public — ziyaretçi mesaj gönderebilir
router.post('/', validateMessage, sendMessage);

// Protected — sadece admin görebilir
router.get('/', protect, getMessages);
router.put('/:id/read', protect, markAsRead);
router.delete('/:id', protect, deleteMessage);

module.exports = router;