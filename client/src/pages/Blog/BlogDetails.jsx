// client/src/pages/Blog/BlogDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaClock, FaCalendarAlt, FaUserCircle } from 'react-icons/fa';

const BlogDetails = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/blogs/${id}`);
                setBlog(res.data);
            } catch(err) { console.log(err); }
        };
        fetchBlog();
    }, [id]);

    if (!blog) return <div className="min-h-screen bg-[#0B1120] pt-32 text-center text-white">Yükleniyor...</div>;

    return (
        <div className="min-h-screen bg-[#0B1120] pt-28 pb-20 px-6">
            <div className="max-w-3xl mx-auto">

                <Link to="/blog" className="text-gray-400 hover:text-white flex items-center gap-2 mb-8 transition-colors">
                    <FaArrowLeft /> Tüm Yazılara Dön
                </Link>

                {/* Meta Veriler */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-pink-400 font-mono font-bold mb-6">
                    <span className="bg-pink-500/10 px-3 py-1 rounded-full">{blog.category}</span>
                    <span className="text-gray-500 flex items-center gap-2"><FaClock /> {blog.readTime}</span>
                    <span className="text-gray-500 flex items-center gap-2"><FaCalendarAlt /> {new Date(blog.createdAt).toLocaleDateString()}</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">{blog.title}</h1>

                {blog.image && (
                    <div className="w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-10 border border-slate-800">
                        <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                    </div>
                )}

                {/* İçerik Alanı (Basit Markdown Desteği gibi satır boşluklarını korur) */}
                <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-loose whitespace-pre-wrap">
                    {blog.content}
                </div>

                {/* Yazar Kutusu */}
                <div className="mt-16 pt-8 border-t border-slate-800 flex items-center gap-4">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-3xl">👨‍💻</div>
                    <div>
                        <h4 className="text-white font-bold">YBS Geliştirici</h4>
                        <p className="text-sm text-gray-500">Teknoloji ve iş dünyası üzerine notlar.</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default BlogDetails;