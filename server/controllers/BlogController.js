const Blog = require('../models/Blog');
const asyncHandler = require('express-async-handler');

const getBlogs = asyncHandler(async (req, res) => {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
});

const getBlogById = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
        res.status(404);
        throw new Error('Yazı bulunamadı');
    }
    blog.views += 1;
    await blog.save();
    res.json(blog);
});

const createBlog = asyncHandler(async (req, res) => {
    const newBlog = await Blog.create(req.body);
    res.status(201).json(newBlog);
});

const updateBlog = asyncHandler(async (req, res) => {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!updatedBlog) {
        res.status(404);
        throw new Error('Yazı bulunamadı');
    }
    res.json(updatedBlog);
});

const deleteBlog = asyncHandler(async (req, res) => {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
        res.status(404);
        throw new Error('Yazı bulunamadı');
    }
    res.json({ message: 'Yazı silindi' });
});

module.exports = { getBlogs, getBlogById, createBlog, updateBlog, deleteBlog };