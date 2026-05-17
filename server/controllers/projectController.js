const Project = require('../models/Project');
const asyncHandler = require('express-async-handler');
const pick = require('../utils/pick');

const PROJECT_FIELDS = [
    'title', 'description', 'image', 'tags', 'category', 'role', 'status',
    'date', 'technicalArchitecture', 'features', 'metrics', 'links', 'challenges'
];

// Form multipart gönderdiğinde challenges JSON string olarak gelir;
// Mongoose'a vermeden önce diziye çevir. (Seeder düz nesne gönderir,
// string olmadığı için dokunulmaz.)
const parseChallenges = (body) => {
    if (typeof body.challenges === 'string') {
        try {
            const parsed = JSON.parse(body.challenges);
            body.challenges = Array.isArray(parsed) ? parsed : [];
        } catch {
            body.challenges = [];
        }
    }
    return body;
};

const getProjects = asyncHandler(async (req, res) => {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: projects });
});

const createProject = asyncHandler(async (req, res) => {
    const newProject = await Project.create(pick(parseChallenges(req.body), PROJECT_FIELDS));
    res.status(201).json({ success: true, data: newProject, message: 'Proje oluşturuldu.' });
});

const getProjectById = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);
    if (!project) {
        res.status(404);
        throw new Error('Proje bulunamadı');
    }
    res.json({ success: true, data: project });
});

const updateProject = asyncHandler(async (req, res) => {
    const updatedProject = await Project.findByIdAndUpdate(req.params.id, pick(parseChallenges(req.body), PROJECT_FIELDS), {
        new: true,
        runValidators: true
    });
    if (!updatedProject) {
        res.status(404);
        throw new Error('Proje bulunamadı');
    }
    res.json({ success: true, data: updatedProject, message: 'Proje güncellendi.' });
});

const deleteProject = asyncHandler(async (req, res) => {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
        res.status(404);
        throw new Error('Proje bulunamadı');
    }
    res.json({ success: true, message: 'Proje silindi' });
});

module.exports = { getProjects, createProject, getProjectById, updateProject, deleteProject };
