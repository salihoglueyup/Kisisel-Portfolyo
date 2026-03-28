const Message = require('../models/Message');
const asyncHandler = require('express-async-handler');

// @desc    Ziyaretçi mesaj gönderir
// @route   POST /api/messages
const sendMessage = asyncHandler(async (req, res) => {
    const newMessage = await Message.create(req.body);
    res.status(201).json({ success: true, data: newMessage });
});

// @desc    Tüm mesajları getir (Admin)
// @route   GET /api/messages
const getMessages = asyncHandler(async (req, res) => {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json({ success: true, data: messages });
});

// @desc    Mesajı okundu olarak işaretle (Admin)
// @route   PUT /api/messages/:id/read
const markAsRead = asyncHandler(async (req, res) => {
    const message = await Message.findByIdAndUpdate(
        req.params.id,
        { isRead: true },
        { new: true }
    );
    if (!message) {
        res.status(404);
        throw new Error('Mesaj bulunamadı');
    }
    res.json({ success: true, data: message });
});

// @desc    Mesajı sil (Admin)
// @route   DELETE /api/messages/:id
const deleteMessage = asyncHandler(async (req, res) => {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
        res.status(404);
        throw new Error('Mesaj bulunamadı');
    }
    res.json({ success: true, message: 'Mesaj silindi' });
});

module.exports = { sendMessage, getMessages, markAsRead, deleteMessage };