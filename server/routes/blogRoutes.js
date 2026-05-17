const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { validateBlog } = require('../middleware/validationMiddleware');
const { upload, processImage } = require('../middleware/uploadMiddleware');
const { getBlogs, createBlog, getBlogById, updateBlog, deleteBlog } = require('../controllers/blogController');

// Public GET, Protected POST
// Sıra: upload (multipart body) -> validate -> processImage
// Böylece validasyon başarısızsa Sharp görseli işlemez/diske yazmaz (yetim dosya yok)
router.route('/')
    .get(getBlogs)
    .post(protect, upload.single('image'), validateBlog, processImage, createBlog);

// Public GET (view counter), Protected PUT/DELETE
router.route('/:id')
    .get(getBlogById)
    .put(protect, upload.single('image'), validateBlog, processImage, updateBlog)
    .delete(protect, deleteBlog);

module.exports = router;