const Blog = require('../models/Blog');
const asyncHandler = require('express-async-handler');
const pick = require('../utils/pick');

// 'views' kasıtlı dışarıda — istemci görüntülenme sayısını set/manipüle edemesin
const BLOG_FIELDS = ['title', 'excerpt', 'content', 'category', 'image', 'readTime', 'featured'];

// Query: ?search=&category=&page=&limit=  (hepsi opsiyonel, geriye dönük uyumlu)
const getBlogs = asyncHandler(async (req, res) => {
    const { search, category } = req.query;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 50));

    const filter = {};
    if (category && category !== 'all') {
        filter.category = category;
    }
    if (search) {
        // Regex enjeksiyonunu önlemek için özel karakterleri escape et
        const safe = String(search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const rx = new RegExp(safe, 'i');
        filter.$or = [{ title: rx }, { excerpt: rx }];
    }

    const total = await Blog.countDocuments(filter);
    const blogs = await Blog.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    res.json({
        success: true,
        data: blogs, // dizi — mevcut tüketiciler bozulmaz
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.max(1, Math.ceil(total / limit))
        }
    });
});

const getBlogById = asyncHandler(async (req, res) => {
    // Atomik artış — eşzamanlı isteklerde sayım kaybı olmaz (yarış koşulu yok)
    const blog = await Blog.findByIdAndUpdate(
        req.params.id,
        { $inc: { views: 1 } },
        { new: true }
    );
    if (!blog) {
        res.status(404);
        throw new Error('Yazı bulunamadı');
    }
    res.json({ success: true, data: blog });
});

const createBlog = asyncHandler(async (req, res) => {
    const newBlog = await Blog.create(pick(req.body, BLOG_FIELDS));
    res.status(201).json({ success: true, data: newBlog, message: 'Blog yazısı oluşturuldu.' });
});

const updateBlog = asyncHandler(async (req, res) => {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, pick(req.body, BLOG_FIELDS), {
        new: true,
        runValidators: true
    });
    if (!updatedBlog) {
        res.status(404);
        throw new Error('Yazı bulunamadı');
    }
    res.json({ success: true, data: updatedBlog, message: 'Blog yazısı güncellendi.' });
});

const deleteBlog = asyncHandler(async (req, res) => {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
        res.status(404);
        throw new Error('Yazı bulunamadı');
    }
    res.json({ success: true, message: 'Yazı silindi' });
});

module.exports = { getBlogs, getBlogById, createBlog, updateBlog, deleteBlog };
