const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { validateRegister, validateLogin, validatePasswordChange } = require('../middleware/validationMiddleware');
const {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword,
    refreshToken
} = require('../controllers/authController');

// Public routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/refresh', refreshToken);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, validatePasswordChange, changePassword);

module.exports = router;
