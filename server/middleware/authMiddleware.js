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

    try {
        // Token doğrulama
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Kullanıcıyı bul ve request'e ekle
        const user = await AdminUser.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Bu token ile eşleşen kullanıcı bulunamadı.'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Geçersiz veya süresi dolmuş token.'
        });
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
