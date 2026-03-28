const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { validateProject } = require('../middleware/validationMiddleware');
const { upload, processImage } = require('../middleware/uploadMiddleware');
const { getProjects, createProject, getProjectById, updateProject, deleteProject } = require('../controllers/projectController');

// Public
router.route('/')
    .get(getProjects)
    .post(protect, upload.single('image'), processImage, validateProject, createProject);

// Public GET, Protected PUT/DELETE
router.route('/:id')
    .get(getProjectById)
    .put(protect, upload.single('image'), processImage, updateProject)
    .delete(protect, deleteProject);

module.exports = router;