const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    excerpt: { type: String, required: true }, // Kısa özet
    content: { type: String, required: true }, // Uzun yazı
    category: { type: String, required: true },
    image: { type: String, default: '' },
    readTime: { type: String, default: '5 dk' },
    featured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Blog', blogSchema);