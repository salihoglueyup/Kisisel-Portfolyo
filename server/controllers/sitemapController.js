const asyncHandler = require('express-async-handler');
const Project = require('../models/Project');
const Blog = require('../models/Blog');

const escapeXml = (s = '') =>
    String(s).replace(/[<>&'"]/g, (c) =>
        ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]));

// @desc    Dinamik sitemap.xml — statik sayfalar + projeler + bloglar
// @route   GET /sitemap.xml
const getSitemap = asyncHandler(async (req, res) => {
    const base = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');

    const staticPaths = ['', '/about', '/projects', '/blog', '/contact'];

    const [projects, blogs] = await Promise.all([
        Project.find().select('_id updatedAt').lean(),
        Blog.find().select('_id updatedAt').lean()
    ]);

    const urls = [
        ...staticPaths.map((p) => ({ loc: `${base}${p}`, lastmod: null })),
        ...projects.map((p) => ({
            loc: `${base}/projects/${p._id}`,
            lastmod: p.updatedAt ? new Date(p.updatedAt).toISOString() : null
        })),
        ...blogs.map((b) => ({
            loc: `${base}/blog/${b._id}`,
            lastmod: b.updatedAt ? new Date(b.updatedAt).toISOString() : null
        }))
    ];

    const body =
        `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        urls
            .map(
                (u) =>
                    `  <url><loc>${escapeXml(u.loc)}</loc>` +
                    (u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : '') +
                    `</url>`
            )
            .join('\n') +
        `\n</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(body);
});

module.exports = { getSitemap };
