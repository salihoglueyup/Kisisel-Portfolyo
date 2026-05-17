const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'E-posta gereklidir'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Geçerli bir e-posta giriniz']
    }
}, { timestamps: true });

module.exports = mongoose.model('Subscriber', subscriberSchema);
