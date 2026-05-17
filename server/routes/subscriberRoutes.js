const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { validateSubscribe } = require('../middleware/validationMiddleware');
const { subscribe, getSubscribers } = require('../controllers/subscriberController');

// Public — ziyaretçi abone olabilir
router.post('/', validateSubscribe, subscribe);

// Protected — sadece admin listeler
router.get('/', protect, getSubscribers);

module.exports = router;
