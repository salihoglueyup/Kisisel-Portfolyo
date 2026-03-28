const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');
const asyncHandler = require('express-async-handler');

// JWT Token üretme yardımcı fonksiyonu
const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

// @desc    Yeni admin kayıt
// @route   POST /api/auth/register
const register = asyncHandler(async (req, res) => {
    const { email, password, displayName } = req.body;

    const existingUser = await AdminUser.findOne({ email });
    if (existingUser) {
        res.status(400);
        throw new Error('Bu email adresi zaten kayıtlı.');
    }

    const userCount = await AdminUser.countDocuments();
    const role = userCount === 0 ? 'superadmin' : 'admin';

    if (userCount > 0) {
        if (!req.user || req.user.role !== 'superadmin') {
            res.status(403);
            throw new Error('Yeni admin oluşturmak için superadmin yetkisi gereklidir.');
        }
    }

    const user = await AdminUser.create({
        email,
        password,
        displayName: displayName || 'Admin',
        role
    });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.status(201).json({
        success: true,
        message: `${role === 'superadmin' ? 'Superadmin' : 'Admin'} hesabı oluşturuldu.`,
        data: {
            id: user._id,
            email: user.email,
            displayName: user.displayName,
            role: user.role,
            accessToken,
            refreshToken
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

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        res.status(401);
        throw new Error('Geçersiz email veya şifre.');
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.json({
        success: true,
        message: 'Giriş başarılı.',
        data: {
            id: user._id,
            email: user.email,
            displayName: user.displayName,
            role: user.role,
            accessToken,
            refreshToken
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
    await user.save();

    res.json({
        success: true,
        message: 'Şifre başarıyla değiştirildi.'
    });
});

// @desc    Token yenile
// @route   POST /api/auth/refresh
const refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken: token } = req.body;

    if (!token) {
        res.status(400);
        throw new Error('Refresh token gereklidir.');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const user = await AdminUser.findById(decoded.id);

        if (!user) {
            res.status(401);
            throw new Error('Geçersiz refresh token.');
        }

        const newAccessToken = generateAccessToken(user._id);

        res.json({
            success: true,
            data: { accessToken: newAccessToken }
        });
    } catch (error) {
        res.status(401);
        throw new Error('Geçersiz veya süresi dolmuş refresh token.');
    }
});

module.exports = {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword,
    refreshToken
};
