const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminUserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email adresi gereklidir'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Geçerli bir email adresi giriniz']
    },
    password: {
        type: String,
        required: [true, 'Şifre gereklidir'],
        minlength: [8, 'Şifre en az 8 karakter olmalıdır'],
        select: false // Sorgularda şifre döndürülmez
    },
    displayName: {
        type: String,
        default: 'Admin',
        trim: true
    },
    role: {
        type: String,
        enum: ['admin', 'superadmin'],
        default: 'admin'
    },
    lastLogin: {
        type: Date
    },
    // Brute-force koruması
    failedLoginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: {
        type: Date
    },
    // Oturum geçersizleştirme — şifre değişimi/sıfırlamada artar.
    // Refresh/access token payload'undaki sürüm bununla eşleşmezse token reddedilir.
    tokenVersion: {
        type: Number,
        default: 0
    },
    // Şifre sıfırlama (token DB'de hash'li tutulur, ham token sadece e-postada)
    resetPasswordToken: {
        type: String,
        select: false
    },
    resetPasswordExpire: {
        type: Date,
        select: false
    }
}, { timestamps: true });

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 dakika

// Hesap şu an kilitli mi?
adminUserSchema.methods.isLocked = function () {
    return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Başarısız denemeyi atomik olarak artır; eşik aşılırsa kilitle
adminUserSchema.methods.registerFailedLogin = async function () {
    // Kilit süresi dolmuşsa sayacı sıfırla
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.updateOne({
            $set: { failedLoginAttempts: 1 },
            $unset: { lockUntil: 1 }
        });
    }
    const update = { $inc: { failedLoginAttempts: 1 } };
    if (this.failedLoginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked()) {
        update.$set = { lockUntil: new Date(Date.now() + LOCK_TIME) };
    }
    return this.updateOne(update);
};

// Başarılı girişte sayaç/kilit temizle
adminUserSchema.methods.resetLoginAttempts = async function () {
    return this.updateOne({
        $set: { failedLoginAttempts: 0, lastLogin: new Date() },
        $unset: { lockUntil: 1 }
    });
};

// Kaydetmeden önce şifreyi hashle
// Mongoose 9: async middleware `next` callback'i ALMAZ — sadece
// işini yapıp döner, hata fırlatırsa Mongoose yakalar. (Eski `next()`
// kullanımı "next is not a function" hatası veriyordu.)
adminUserSchema.pre('save', async function () {
    // Şifre değişmediyse hashleme
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});

// Şifre karşılaştırma metodu
adminUserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('AdminUser', adminUserSchema);
