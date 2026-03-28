const Project = require('../models/Project');
const asyncHandler = require('express-async-handler');

const getProjects = asyncHandler(async (req, res) => {
    const projects = await Project.find();
    res.status(200).json(projects);
});

const createProject = asyncHandler(async (req, res) => {
    const newProject = await Project.create(req.body);
    res.status(201).json(newProject);
});

const getProjectById = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);
    if (!project) {
        res.status(404);
        throw new Error('Proje bulunamadı');
    }
    res.json(project);
});

const updateProject = asyncHandler(async (req, res) => {
    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!updatedProject) {
        res.status(404);
        throw new Error('Proje bulunamadı');
    }
    res.json(updatedProject);
});

const deleteProject = asyncHandler(async (req, res) => {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
        res.status(404);
        throw new Error('Proje bulunamadı');
    }
    res.json({ message: 'Proje silindi' });
});

module.exports = { getProjects, createProject, getProjectById, updateProject, deleteProject };
