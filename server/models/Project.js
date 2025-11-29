const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Lütfen proje başlığı giriniz']
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: 'no-image.jpg'
    },
    tags: [String],

    // --- YENİ EKLENEN DETAY ALANLARI ---
    category: { type: String, default: 'Web Geliştirme' },
    role: { type: String, default: 'Full Stack Developer' },
    status: { type: String, default: 'Tamamlandı' },
    date: { type: String },

    // Teknik Mimari (Frontend, Backend, DB, DevOps)
    technicalArchitecture: {
        frontend: { type: String, default: '' },
        backend: { type: String, default: '' },
        database: { type: String, default: '' },
        devops: { type: String, default: '' }
    },

    // Ana Özellikler (Liste halinde)
    features: [String],

    // Metrikler
    metrics: {
        complexity: { type: Number, default: 5 },
        hoursSpent: { type: Number, default: 0 },
        linesOfCode: { type: Number, default: 0 }
    },
    links: {
        github: String,
        live: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Project', projectSchema);