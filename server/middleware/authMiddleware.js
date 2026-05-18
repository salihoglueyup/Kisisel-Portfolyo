const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');

const protect = async (req, res, next) => {
    let token;

    // Bearer token kontrolü
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Yetkisiz erişim. Lütfen giriş yapın.'
        });
    }

    // Token doğrulama — yalnız JWT hatası 401; DB/altyapı hatası 500 olmalı
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
        return res.status(401).json({
            success: false,
            message: 'Geçersiz veya süresi dolmuş token.'
        });
    }

    try {
        const user = await AdminUser.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Bu token ile eşleşen kullanıcı bulunamadı.'
            });
        }

        // Şifre değişimi/sıfırlamadan önce üretilmiş token'lar geçersiz
        if ((decoded.tv ?? 0) !== (user.tokenVersion ?? 0)) {
            return res.status(401).json({
                success: false,
                message: 'Oturum sonlandırıldı. Lütfen tekrar giriş yapın.'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        // DB/altyapı hatası — yanlışlıkla 401 dönmesin; errorHandler 500 versin
        next(error);
    }
};

// Sadece superadmin erişimi
const superAdminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'superadmin') {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: 'Bu işlem için superadmin yetkisi gereklidir.'
        });
    }
};

module.exports = { protect, superAdminOnly };
