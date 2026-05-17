const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { validateProject } = require('../middleware/validationMiddleware');
const { upload, processImage } = require('../middleware/uploadMiddleware');
const { getProjects, createProject, getProjectById, updateProject, deleteProject } = require('../controllers/projectController');

// Public GET, Protected POST
// Sıra: upload (multipart body) -> validate -> processImage
// Böylece validasyon başarısızsa Sharp görseli işlemez/diske yazmaz (yetim dosya yok)
router.route('/')
    .get(getProjects)
    .post(protect, upload.single('image'), validateProject, processImage, createProject);

// Public GET, Protected PUT/DELETE
router.route('/:id')
    .get(getProjectById)
    .put(protect, upload.single('image'), validateProject, processImage, updateProject)
    .delete(protect, deleteProject);

module.exports = router;