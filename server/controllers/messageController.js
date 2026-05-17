const Message = require('../models/Message');
const asyncHandler = require('express-async-handler');
const { sendMail } = require('../utils/mailer');

const escapeHtml = (s = '') =>
    String(s).replace(/[&<>"']/g, (c) =>
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// @desc    Ziyaretçi mesaj gönderir
// @route   POST /api/messages
const sendMessage = asyncHandler(async (req, res) => {
    // Yalnız izin verilen alanlar — mass-assignment'a karşı (public endpoint).
    // Aksi halde saldırgan isRead/createdAt enjekte edebilir.
    const { name, email, subject, message } = req.body;
    const newMessage = await Message.create({ name, email, subject, message });
    res.status(201).json({ success: true, data: newMessage });

    // Admin'e bildirim — yanıtı bloke etmez, hatası akışı bozmaz (sendMail içte yutar)
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
        sendMail({
            to: adminEmail,
            subject: `📬 Yeni iletişim mesajı: ${subject}`,
            text: `${name} <${email}>\n\n${message}`,
            html: `
                <h2>Yeni İletişim Mesajı</h2>
                <p><strong>İsim:</strong> ${escapeHtml(name)}</p>
                <p><strong>E-posta:</strong> ${escapeHtml(email)}</p>
                <p><strong>Konu:</strong> ${escapeHtml(subject)}</p>
                <hr/>
                <p>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>
            `
        });
    }
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