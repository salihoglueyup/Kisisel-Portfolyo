const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const asyncHandler = require('express-async-handler');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Store file in memory to process with Sharp
const storage = multer.memoryStorage();

// File filter for images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Sadece resim dosyaları yüklenebilir!'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Middleware to process and save the image
const processImage = asyncHandler(async (req, res, next) => {
    if (!req.file) return next();

    // Create unique filename
    req.file.filename = `image-${Date.now()}-${Math.round(Math.random() * 1E9)}.webp`;

    await sharp(req.file.buffer)
        .resize(1200, 1200, {
            fit: 'inside',
            withoutEnlargement: true
        })
        .toFormat('webp')
        .webp({ quality: 80 })
        .toFile(path.join(uploadDir, req.file.filename));

    // Append the public URL path to body (or file object) so controller can use it
    const fileUrl = `/uploads/${req.file.filename}`;
    req.body.image = fileUrl;

    next();
});

module.exports = {
    upload,
    processImage
};
