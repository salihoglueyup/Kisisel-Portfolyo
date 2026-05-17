const Subscriber = require('../models/Subscriber');
const asyncHandler = require('express-async-handler');

// @desc    Bülten aboneliği (public)
// @route   POST /api/subscribers
const subscribe = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const existing = await Subscriber.findOne({ email });
    if (existing) {
        // İdempotent — zaten aboneyse de başarı dön (e-posta sızıntısı/enumerasyon yok)
        return res.status(200).json({ success: true, message: 'Zaten abonesiniz. Teşekkürler!' });
    }

    await Subscriber.create({ email });
    res.status(201).json({ success: true, message: 'Bültene başarıyla abone oldunuz!' });
});

// @desc    Aboneleri listele (Admin)
// @route   GET /api/subscribers
const getSubscribers = asyncHandler(async (req, res) => {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    res.json({ success: true, data: subscribers });
});

module.exports = { subscribe, getSubscribers };
