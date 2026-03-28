const { body, validationResult } = require('express-validator');

// Hata kontrolü yapan yardımcı middleware
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validasyon hatası',
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

// --- AUTH VALİDASYONLARI ---
const validateRegister = [
    body('email')
        .isEmail().withMessage('Geçerli bir email adresi giriniz')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 8 }).withMessage('Şifre en az 8 karakter olmalıdır')
        .matches(/[A-Z]/).withMessage('Şifre en az bir büyük harf içermelidir')
        .matches(/[a-z]/).withMessage('Şifre en az bir küçük harf içermelidir')
        .matches(/[0-9]/).withMessage('Şifre en az bir rakam içermelidir'),
    body('displayName')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 }).withMessage('İsim 2-50 karakter arasında olmalıdır'),
    handleValidationErrors
];

const validateLogin = [
    body('email')
        .isEmail().withMessage('Geçerli bir email adresi giriniz')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Şifre boş bırakılamaz'),
    handleValidationErrors
];

const validatePasswordChange = [
    body('currentPassword')
        .notEmpty().withMessage('Mevcut şifre gereklidir'),
    body('newPassword')
        .isLength({ min: 8 }).withMessage('Yeni şifre en az 8 karakter olmalıdır')
        .matches(/[A-Z]/).withMessage('Yeni şifre en az bir büyük harf içermelidir')
        .matches(/[a-z]/).withMessage('Yeni şifre en az bir küçük harf içermelidir')
        .matches(/[0-9]/).withMessage('Yeni şifre en az bir rakam içermelidir'),
    handleValidationErrors
];

// --- PROJE VALİDASYONLARI ---
const validateProject = [
    body('title')
        .notEmpty().withMessage('Proje başlığı gereklidir')
        .trim()
        .isLength({ max: 200 }).withMessage('Başlık 200 karakterden uzun olamaz'),
    body('description')
        .notEmpty().withMessage('Proje açıklaması gereklidir')
        .trim(),
    handleValidationErrors
];

// --- BLOG VALİDASYONLARI ---
const validateBlog = [
    body('title')
        .notEmpty().withMessage('Blog başlığı gereklidir')
        .trim(),
    body('excerpt')
        .notEmpty().withMessage('Blog özeti gereklidir')
        .trim(),
    body('content')
        .notEmpty().withMessage('Blog içeriği gereklidir'),
    body('category')
        .notEmpty().withMessage('Kategori gereklidir')
        .trim(),
    handleValidationErrors
];

// --- MESAJ VALİDASYONLARI ---
const validateMessage = [
    body('name')
        .notEmpty().withMessage('İsim gereklidir')
        .trim()
        .isLength({ max: 100 }).withMessage('İsim 100 karakterden uzun olamaz'),
    body('email')
        .isEmail().withMessage('Geçerli bir email adresi giriniz')
        .normalizeEmail(),
    body('subject')
        .notEmpty().withMessage('Konu gereklidir')
        .trim(),
    body('message')
        .notEmpty().withMessage('Mesaj gereklidir')
        .trim()
        .isLength({ max: 5000 }).withMessage('Mesaj 5000 karakterden uzun olamaz'),
    handleValidationErrors
];

module.exports = {
    validateRegister,
    validateLogin,
    validatePasswordChange,
    validateProject,
    validateBlog,
    validateMessage
};
