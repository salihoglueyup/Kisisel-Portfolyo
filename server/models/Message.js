const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true }, // Örn: İş Teklifi, Freelance
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false }, // Admin panelinde "Okundu" işaretlemek için
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);