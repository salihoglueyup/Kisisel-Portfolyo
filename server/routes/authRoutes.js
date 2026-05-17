const express = require('express');
const router = express.Router();
const { protect, superAdminOnly } = require('../middleware/authMiddleware');
const { verifyCsrf } = require('../middleware/csrf');
const {
    validateRegister, validateLogin, validatePasswordChange,
    validateForgotPassword, validateResetPassword
} = require('../middleware/validationMiddleware');
const {
    register,
    login,
    logout,
    getProfile,
    updateProfile,
    changePassword,
    refreshToken,
    forgotPassword,
    resetPassword
} = require('../controllers/authController');

// Public routes
router.post('/login', validateLogin, login);
router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.post('/reset-password/:token', validateResetPassword, resetPassword);
// Cookie ile çalışan endpoint'ler — CSRF double-submit doğrulaması
router.post('/refresh', verifyCsrf, refreshToken);
router.post('/logout', verifyCsrf, logout);

// Protected routes
router.post('/register', protect, superAdminOnly, validateRegister, register); // Sadece superadmin yeni admin oluşturabilir
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, validatePasswordChange, changePassword);

module.exports = router;
