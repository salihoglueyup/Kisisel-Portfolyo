const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { validateBlog } = require('../middleware/validationMiddleware');
const { upload, processImage } = require('../middleware/uploadMiddleware');
const { getBlogs, createBlog, getBlogById, updateBlog, deleteBlog } = require('../controllers/blogController');

// Public
router.route('/')
    .get(getBlogs)
    .post(protect, upload.single('image'), processImage, validateBlog, createBlog);

// Public GET (view counter), Protected PUT/DELETE
router.route('/:id')
    .get(getBlogById)
    .put(protect, upload.single('image'), processImage, updateBlog)
    .delete(protect, deleteBlog);

module.exports = router;