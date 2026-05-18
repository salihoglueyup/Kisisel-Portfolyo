const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const AdminUser = require('../models/AdminUser');
const asyncHandler = require('express-async-handler');
const { sendMail } = require('../utils/mailer');

// JWT Token üretme — payload'a tokenVersion (tv) gömülür; şifre
// değişimi/sıfırlamada tv artar ve eski token'lar geçersiz olur.
const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user._id, tv: user.tokenVersion ?? 0 },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user._id, tv: user.tokenVersion ?? 0 },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );
};

const REFRESH_COOKIE = 'refreshToken';
const CSRF_COOKIE = 'csrfToken';
const isProd = process.env.NODE_ENV === 'production';

// CSRF double-submit token'ı: JS'in okuyabilmesi için httpOnly DEĞİL.
// Güvenlik, cross-site saldırganın bu değeri okuyup header'a koyamamasından gelir.
const setCsrfCookie = (res) => {
    const csrfToken = crypto.randomBytes(32).toString('hex');
    res.cookie(CSRF_COOKIE, csrfToken, {
        httpOnly: false,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        path: '/api/auth',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
    return csrfToken;
};

const clearCsrfCookie = (res) => {
    res.clearCookie(CSRF_COOKIE, {
        httpOnly: false,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        path: '/api/auth'
    });
};

// Refresh token'ı httpOnly cookie olarak ayarla (XSS'e karşı JS erişemez)
const setRefreshCookie = (res, token) => {
    res.cookie(REFRESH_COOKIE, token, {
        httpOnly: true,
        secure: isProd,                       // production'da yalnız HTTPS
        sameSite: isProd ? 'none' : 'lax',    // farklı domain (prod) için 'none'
        path: '/api/auth',                    // yalnız auth route'larına gönderilir
        maxAge: 7 * 24 * 60 * 60 * 1000       // 7 gün
    });
};

const clearRefreshCookie = (res) => {
    res.clearCookie(REFRESH_COOKIE, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        path: '/api/auth'
    });
};

// @desc    Yeni admin kayıt (yalnızca superadmin — route'ta protect + superAdminOnly ile korunur)
// @route   POST /api/auth/register
// Not: İlk superadmin hesabı bu endpoint'ten DEĞİL, `node seedAdmin.js` ile oluşturulur.
const register = asyncHandler(async (req, res) => {
    const { email, password, displayName, role: requestedRole } = req.body;

    const existingUser = await AdminUser.findOne({ email });
    if (existingUser) {
        res.status(400);
        throw new Error('Bu email adresi zaten kayıtlı.');
    }

    // Varsayılan 'admin'; superadmin açıkça isterse 'superadmin' verilebilir.
    const role = requestedRole === 'superadmin' ? 'superadmin' : 'admin';

    const user = await AdminUser.create({
        email,
        password,
        displayName: displayName || 'Admin',
        role
    });

    // Not: Token DÖNDÜRÜLMEZ — superadmin yeni kullanıcı oluşturur,
    // o kullanıcı olarak oturum açmaz.
    res.status(201).json({
        success: true,
        message: `${role === 'superadmin' ? 'Superadmin' : 'Admin'} hesabı oluşturuldu.`,
        data: {
            id: user._id,
            email: user.email,
            displayName: user.displayName,
            role: user.role
        }
    });
});

// @desc    Admin giriş
// @route   POST /api/auth/login
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await AdminUser.findOne({ email }).select('+password');

    if (!user) {
        res.status(401);
        throw new Error('Geçersiz email veya şifre.');
    }

    // Hesap kilitli mi? (brute-force koruması)
    if (user.isLocked()) {
        const remainingMin = Math.ceil((user.lockUntil - Date.now()) / 60000);
        res.status(429);
        throw new Error(`Çok fazla başarısız deneme. Hesap ${remainingMin} dakika kilitli.`);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        await user.registerFailedLogin();
        res.status(401);
        throw new Error('Geçersiz email veya şifre.');
    }

    // Başarılı giriş — sayaç/kilit temizle, lastLogin güncelle
    await user.resetLoginAttempts();

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Refresh token httpOnly cookie'de; access token yanıt gövdesinde (kısa ömürlü)
    setRefreshCookie(res, refreshToken);
    const csrfToken = setCsrfCookie(res);

    res.json({
        success: true,
        message: 'Giriş başarılı.',
        data: {
            id: user._id,
            email: user.email,
            displayName: user.displayName,
            role: user.role,
            accessToken,
            csrfToken
        }
    });
});

// @desc    Profil bilgilerini getir
// @route   GET /api/auth/profile
const getProfile = asyncHandler(async (req, res) => {
    const user = await AdminUser.findById(req.user._id);

    res.json({
        success: true,
        data: {
            id: user._id,
            email: user.email,
            displayName: user.displayName,
            role: user.role,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt
        }
    });
});

// @desc    Profil güncelle
// @route   PUT /api/auth/profile
const updateProfile = asyncHandler(async (req, res) => {
    const { displayName, email } = req.body;
    const user = await AdminUser.findById(req.user._id);

    if (displayName) user.displayName = displayName;

    if (email && email !== user.email) {
        const emailExists = await AdminUser.findOne({ email });
        if (emailExists) {
            res.status(400);
            throw new Error('Bu email adresi zaten kullanılıyor.');
        }
        user.email = email;
    }

    // Girdi doğrulaması route'taki validateUpdateProfile ile yapılır.
    // validateBeforeSave:false ZORUNLU: password `select:false` olduğundan
    // bu dokümana yüklenmez; şema validasyonu açık kalsa `password required`
    // hatası verir. Eşzamanlı email çakışması ise unique index → 11000 ile
    // errorHandler tarafından yakalanır.
    await user.save({ validateBeforeSave: false });

    res.json({
        success: true,
        message: 'Profil güncellendi.',
        data: {
            id: user._id,
            email: user.email,
            displayName: user.displayName,
            role: user.role
        }
    });
});

// @desc    Şifre değiştir
// @route   PUT /api/auth/password
const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    const user = await AdminUser.findById(req.user._id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
        res.status(401);
        throw new Error('Mevcut şifre hatalı.');
    }

    const isSame = await user.comparePassword(newPassword);
    if (isSame) {
        res.status(400);
        throw new Error('Yeni şifre eskisiyle aynı olamaz.');
    }

    user.password = newPassword;
    user.tokenVersion = (user.tokenVersion ?? 0) + 1; // diğer oturumları düşür
    await user.save();

    res.json({
        success: true,
        message: 'Şifre başarıyla değiştirildi.'
    });
});

// @desc    Token yenile (refresh token httpOnly cookie'den okunur)
// @route   POST /api/auth/refresh
const refreshToken = asyncHandler(async (req, res) => {
    const token = req.cookies?.[REFRESH_COOKIE];

    if (!token) {
        res.status(401);
        throw new Error('Refresh token bulunamadı. Lütfen tekrar giriş yapın.');
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch {
        clearRefreshCookie(res);
        clearCsrfCookie(res);
        res.status(401);
        throw new Error('Geçersiz veya süresi dolmuş refresh token.');
    }

    const user = await AdminUser.findById(decoded.id);
    if (!user) {
        clearRefreshCookie(res);
        clearCsrfCookie(res);
        res.status(401);
        throw new Error('Geçersiz refresh token.');
    }

    // Şifre değişimi/sıfırlamadan sonra eski refresh token'lar geçersiz
    if ((decoded.tv ?? 0) !== (user.tokenVersion ?? 0)) {
        clearRefreshCookie(res);
        clearCsrfCookie(res);
        res.status(401);
        throw new Error('Oturum sonlandırıldı. Lütfen tekrar giriş yapın.');
    }

    const newAccessToken = generateAccessToken(user);
    res.json({
        success: true,
        data: { accessToken: newAccessToken }
    });
});

// @desc    Çıkış — refresh cookie'sini temizle
// @route   POST /api/auth/logout
const logout = asyncHandler(async (req, res) => {
    clearRefreshCookie(res);
    clearCsrfCookie(res);
    res.json({ success: true, message: 'Çıkış yapıldı.' });
});

const hashResetToken = (raw) =>
    crypto.createHash('sha256').update(raw).digest('hex');

// @desc    Şifre sıfırlama isteği — e-postaya link gönderir
// @route   POST /api/auth/forgot-password
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    // Kullanıcı sızıntısını önlemek için HER ZAMAN aynı generic yanıt
    const genericResponse = () => res.json({
        success: true,
        message: 'Eğer bu e-posta kayıtlıysa, şifre sıfırlama bağlantısı gönderildi.'
    });

    const user = await AdminUser.findOne({ email });
    if (!user) return genericResponse();

    const rawToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = hashResetToken(rawToken);
    user.resetPasswordExpire = new Date(Date.now() + 60 * 60 * 1000); // 1 saat
    await user.save({ validateBeforeSave: false });

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}/admin/reset-password/${rawToken}`;

    await sendMail({
        to: user.email,
        subject: '🔑 Şifre Sıfırlama İsteği',
        text: `Şifrenizi sıfırlamak için: ${resetUrl}\n\nBağlantı 1 saat geçerlidir. Bu isteği siz yapmadıysanız yok sayın.`,
        html: `
            <h2>Şifre Sıfırlama</h2>
            <p>Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın (1 saat geçerli):</p>
            <p><a href="${resetUrl}">${resetUrl}</a></p>
            <p>Bu isteği siz yapmadıysanız bu e-postayı yok sayın.</p>
        `
    });

    return genericResponse();
});

// @desc    Yeni şifre belirle (token ile)
// @route   POST /api/auth/reset-password/:token
const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const hashed = hashResetToken(req.params.token || '');

    const user = await AdminUser.findOne({
        resetPasswordToken: hashed,
        resetPasswordExpire: { $gt: new Date() }
    }).select('+resetPasswordToken +resetPasswordExpire +password');

    if (!user) {
        res.status(400);
        throw new Error('Geçersiz veya süresi dolmuş sıfırlama bağlantısı.');
    }

    user.password = password; // pre-save hook hash'ler
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    user.tokenVersion = (user.tokenVersion ?? 0) + 1; // çalınmış oturumları geçersiz kıl
    // Sıfırlama başarılıysa olası kilidi de kaldır
    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    res.json({ success: true, message: 'Şifre başarıyla sıfırlandı. Giriş yapabilirsiniz.' });
});

module.exports = {
    register,
    login,
    logout,
    getProfile,
    updateProfile,
    changePassword,
    refreshToken,
    forgotPassword,
    resetPassword
};
