import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaProjectDiagram, FaPenNib, FaEnvelope, FaSignOutAlt, FaSave, FaTrash, FaEdit, FaPlus, FaImage, FaTimes, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();

    // --- GLOBAL STATE'LER ---
    const [activeTab, setActiveTab] = useState('projects');
    const [projects, setProjects] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [messages, setMessages] = useState([]);
    const [status, setStatus] = useState(null);

    // --- PROJE DÜZENLEME STATE'LERİ ---
    const [isProjectEditing, setIsProjectEditing] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [projectForm, setProjectForm] = useState({
        title: '', description: '', image: '', tags: '',
        metrics: { complexity: 5, hoursSpent: 0, linesOfCode: 0 },
        links: { github: '', live: '' }
    });

    // --- BLOG DÜZENLEME STATE'LERİ ---
    const [isBlogEditing, setIsBlogEditing] = useState(false);
    const [selectedBlogId, setSelectedBlogId] = useState(null);
    const [blogForm, setBlogForm] = useState({
        title: '', excerpt: '', content: '', category: 'Teknoloji', image: '', readTime: '5 dk'
    });

    // --- VERİ ÇEKME (INITIAL LOAD) ---
    useEffect(() => {
        fetchProjects();
        fetchBlogs();
        // fetchMessages(); // Mesaj rotası hazırsa açılabilir
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/projects');
            setProjects(res.data);
        } catch (err) { console.error("Projeler yüklenemedi"); }
    };

    const fetchBlogs = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/blogs');
            setBlogs(res.data);
        } catch (err) { console.error("Bloglar yüklenemedi"); }
    };

    // --- YARDIMCI FONKSİYONLAR ---
    const showStatus = (type, msg) => {
        setStatus({ type, msg });
        setTimeout(() => setStatus(null), 3000);
    };

    const handleLogout = () => {
        if(window.confirm("Çıkış yapmak istediğine emin misin?")) {
            localStorage.removeItem('isAdmin');
            navigate('/admin/login');
        }
    };

    // ================= PROJE İŞLEMLERİ =================

    const handleDeleteProject = async (id) => {
        if (window.confirm("Bu projeyi silmek geri alınamaz. Emin misin?")) {
            try {
                await axios.delete(`http://localhost:5000/api/projects/${id}`);
                setProjects(projects.filter(p => p._id !== id));
                showStatus('success', 'Proje başarıyla silindi.');
            } catch (err) { showStatus('error', 'Silme işlemi başarısız.'); }
        }
    };

    const openProjectEdit = (project) => {
        setIsProjectEditing(true);
        setSelectedProjectId(project._id);
        setProjectForm({
            title: project.title,
            description: project.description,
            image: project.image,
            tags: Array.isArray(project.tags) ? project.tags.join(', ') : project.tags,
            metrics: project.metrics || { complexity: 5, hoursSpent: 0, linesOfCode: 0 },
            links: project.links || { github: '', live: '' }
        });
    };

    const handleProjectUpdate = async (e) => {
        e.preventDefault();
        // Tagleri string'den array'e çevir
        const payload = {
            ...projectForm,
            tags: typeof projectForm.tags === 'string' ? projectForm.tags.split(',').map(t => t.trim()).filter(t => t) : projectForm.tags,
            metrics: {
                complexity: Number(projectForm.metrics.complexity),
                hoursSpent: Number(projectForm.metrics.hoursSpent),
                linesOfCode: Number(projectForm.metrics.linesOfCode)
            }
        };

        try {
            await axios.put(`http://localhost:5000/api/projects/${selectedProjectId}`, payload);
            showStatus('success', 'Proje güncellendi!');
            fetchProjects();
            setIsProjectEditing(false); // Formu kapat/sıfırla
            setProjectForm({ title: '', description: '', image: '', tags: '', metrics: { complexity: 5, hoursSpent: 0, linesOfCode: 0 }, links: { github: '', live: '' } });
        } catch (err) { showStatus('error', 'Güncelleme hatası.'); }
    };

    const handleProjectFormChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setProjectForm(prev => ({ ...prev, [parent]: { ...prev[parent], [child]: value } }));
        } else {
            setProjectForm(prev => ({ ...prev, [name]: value }));
        }
    };

    // ================= BLOG İŞLEMLERİ =================

    const handleDeleteBlog = async (id) => {
        if (window.confirm("Bu makaleyi silmek istediğine emin misin?")) {
            try {
                await axios.delete(`http://localhost:5000/api/blogs/${id}`);
                setBlogs(blogs.filter(b => b._id !== id));
                showStatus('success', 'Makale silindi.');
            } catch (err) { showStatus('error', 'Silme hatası.'); }
        }
    };

    const openBlogEdit = (blog) => {
        setIsBlogEditing(true);
        setSelectedBlogId(blog._id);
        setBlogForm(blog);
    };

    const resetBlogForm = () => {
        setIsBlogEditing(false);
        setSelectedBlogId(null);
        setBlogForm({ title: '', excerpt: '', content: '', category: 'Teknoloji', image: '', readTime: '5 dk' });
    };

    const handleBlogFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert("Dosya 2MB'dan büyük olamaz.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setBlogForm(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleBlogSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isBlogEditing) {
                await axios.put(`http://localhost:5000/api/blogs/${selectedBlogId}`, blogForm);
                showStatus('success', 'Makale güncellendi!');
            } else {
                await axios.post('http://localhost:5000/api/blogs', blogForm);
                showStatus('success', 'Makale yayınlandı!');
            }
            fetchBlogs();
            resetBlogForm();
        } catch (error) { showStatus('error', 'İşlem başarısız.'); }
    };


    return (
        <div className="min-h-screen bg-[#0B1120] pt-24 px-4 md:px-8 flex flex-col md:flex-row gap-8">

            {/* --- SIDEBAR --- */}
            <div className="w-full md:w-64 bg-[#111827] border border-slate-800 rounded-2xl p-6 h-fit md:fixed md:left-6 md:top-24 md:h-[calc(100vh-8rem)] flex flex-col shadow-xl z-10">
                <h2 className="text-white font-bold text-xl mb-8 flex items-center gap-2">
                    <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></span> YBS Admin
                </h2>

                <nav className="space-y-2 flex-1">
                    <button onClick={() => setActiveTab('projects')} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 font-medium transition-all ${activeTab === 'projects' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-gray-400 hover:bg-slate-800 hover:text-white'}`}>
                        <FaProjectDiagram /> Projeler
                    </button>
                    <button onClick={() => setActiveTab('blogs')} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 font-medium transition-all ${activeTab === 'blogs' ? 'bg-pink-600 text-white shadow-lg shadow-pink-900/50' : 'text-gray-400 hover:bg-slate-800 hover:text-white'}`}>
                        <FaPenNib /> Blog Yönetimi
                    </button>
                    <button onClick={() => setActiveTab('messages')} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 font-medium transition-all ${activeTab === 'messages' ? 'bg-green-600 text-white shadow-lg shadow-green-900/50' : 'text-gray-400 hover:bg-slate-800 hover:text-white'}`}>
                        <FaEnvelope /> Mesajlar
                    </button>
                </nav>

                <div className="pt-6 border-t border-slate-800 mt-auto">
                    <button onClick={handleLogout} className="w-full text-left p-3 rounded-xl flex items-center gap-3 text-red-400 hover:bg-red-900/20 transition-colors font-bold">
                        <FaSignOutAlt /> Çıkış Yap
                    </button>
                </div>
            </div>

            {/* --- MAIN CONTENT --- */}
            <div className="flex-1 md:ml-[18rem] pb-20">

                {/* STATUS TOAST MESSAGE */}
                {status && (
                    <div className={`fixed top-24 right-8 px-6 py-4 rounded-xl shadow-2xl z-50 font-bold flex items-center gap-3 animate-bounce ${status.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                        {status.type === 'success' ? <FaSave/> : <FaTimes/>}
                        {status.msg}
                    </div>
                )}

                {/* --- TAB: PROJELER --- */}
                {activeTab === 'projects' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* SOL: LİSTE */}
                        <div className="lg:col-span-2">
                            <div className="flex justify-between items-center mb-6 bg-[#111827] p-4 rounded-xl border border-slate-800">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaProjectDiagram className="text-blue-500"/> Tüm Projeler</h2>
                                <button onClick={() => navigate('/admin/add-project')} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all">
                                    <FaPlus /> Yeni Ekle
                                </button>
                            </div>

                            <div className="space-y-3">
                                {projects.map((project) => (
                                    <div key={project._id} className="bg-[#111827] border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center gap-4 hover:border-blue-500/50 transition-all group">
                                        <img src={project.image || 'https://via.placeholder.com/50'} className="w-16 h-16 rounded-lg object-cover bg-slate-900" alt="cover" />
                                        <div className="flex-1">
                                            <h4 className="text-white font-bold">{project.title}</h4>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                                <span className="bg-slate-800 px-2 py-0.5 rounded text-blue-400">{project.metrics?.complexity}/10 Zorluk</span>
                                                <span>•</span>
                                                <span>{project.tags[0]}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-2 sm:mt-0">
                                            <button onClick={() => openProjectEdit(project)} className="p-2 bg-slate-800 text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"><FaEdit /></button>
                                            <button onClick={() => handleDeleteProject(project._id)} className="p-2 bg-slate-800 text-red-400 rounded-lg hover:bg-red-600 hover:text-white transition-colors"><FaTrash /></button>
                                        </div>
                                    </div>
                                ))}
                                {projects.length === 0 && <div className="text-gray-500 text-center py-12 bg-[#111827] rounded-xl border border-slate-800 border-dashed">Henüz proje eklenmemiş.</div>}
                            </div>
                        </div>

                        {/* SAĞ: HIZLI DÜZENLEME */}
                        <div className="lg:col-span-1">
                            {isProjectEditing ? (
                                <div className="bg-[#111827] border border-blue-500/50 p-6 rounded-xl sticky top-28 shadow-2xl shadow-blue-900/20">
                                    <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-2">
                                        <h3 className="text-lg font-bold text-white">Projeyi Düzenle</h3>
                                        <button onClick={() => setIsProjectEditing(false)} className="text-gray-500 hover:text-white"><FaTimes/></button>
                                    </div>
                                    <form onSubmit={handleProjectUpdate} className="space-y-4">
                                        <input name="title" value={projectForm.title} onChange={handleProjectFormChange} placeholder="Başlık" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm outline-none focus:border-blue-500" />
                                        <textarea name="description" value={projectForm.description} onChange={handleProjectFormChange} rows="3" placeholder="Kısa Açıklama" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm outline-none focus:border-blue-500"></textarea>
                                        <div className="grid grid-cols-2 gap-2">
                                            <input name="metrics.complexity" type="number" placeholder="Zorluk" value={projectForm.metrics.complexity} onChange={handleProjectFormChange} className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-xs outline-none" />
                                            <input name="metrics.hoursSpent" type="number" placeholder="Saat" value={projectForm.metrics.hoursSpent} onChange={handleProjectFormChange} className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-xs outline-none" />
                                        </div>
                                        <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg font-bold transition-colors">Değişiklikleri Kaydet</button>
                                    </form>
                                </div>
                            ) : (
                                <div className="bg-[#111827] border border-slate-800 p-6 rounded-xl text-center text-gray-500 sticky top-28 border-dashed">
                                    <FaEdit className="text-4xl mx-auto mb-2 opacity-20"/>
                                    <p className="text-sm">Düzenlemek için soldaki listeden kalem ikonuna tıkla.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* --- TAB: BLOGLAR --- */}
                {activeTab === 'blogs' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* SOL: BLOG LİSTESİ */}
                        <div className="lg:col-span-2">
                            <div className="flex justify-between items-center mb-6 bg-[#111827] p-4 rounded-xl border border-slate-800">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaPenNib className="text-pink-500"/> Blog Yazıları</h2>
                                <button onClick={resetBlogForm} className="bg-pink-600 hover:bg-pink-500 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-pink-600/20 transition-all">
                                    <FaPlus /> Yeni Yazı
                                </button>
                            </div>
                            <div className="space-y-3">
                                {blogs.map((blog) => (
                                    <div key={blog._id} className="bg-[#111827] border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center gap-4 hover:border-pink-500/50 transition-all group">
                                        {blog.image ? (
                                            <img src={blog.image} className="w-16 h-16 rounded-lg object-cover bg-slate-900" alt="cover" />
                                        ) : (
                                            <div className="w-16 h-16 rounded-lg bg-slate-800 flex items-center justify-center text-2xl">📝</div>
                                        )}
                                        <div className="flex-1">
                                            <h4 className="text-white font-bold line-clamp-1">{blog.title}</h4>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                                <span className="bg-slate-800 px-2 py-0.5 rounded text-pink-400">{blog.category}</span>
                                                <span>•</span>
                                                <span>{blog.readTime} okuma</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-2 sm:mt-0">
                                            <button onClick={() => openBlogEdit(blog)} className="p-2 bg-slate-800 text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"><FaEdit /></button>
                                            <button onClick={() => handleDeleteBlog(blog._id)} className="p-2 bg-slate-800 text-red-400 rounded-lg hover:bg-red-600 hover:text-white transition-colors"><FaTrash /></button>
                                        </div>
                                    </div>
                                ))}
                                {blogs.length === 0 && <div className="text-gray-500 text-center py-12 bg-[#111827] rounded-xl border border-slate-800 border-dashed">Henüz makale yok.</div>}
                            </div>
                        </div>

                        {/* SAĞ: BLOG FORMU */}
                        <div className="lg:col-span-1">
                            <div className={`bg-[#111827] border p-6 rounded-xl sticky top-28 ${isBlogEditing ? 'border-pink-500/50 shadow-2xl shadow-pink-900/20' : 'border-slate-700'}`}>
                                <div className="flex justify-between items-center mb-4 border-b border-slate-600 pb-2">
                                    <h3 className="text-lg font-bold text-white">
                                        {isBlogEditing ? 'Makaleyi Düzenle' : 'Yeni Makale Yaz'}
                                    </h3>
                                    {isBlogEditing && <button onClick={resetBlogForm} className="text-xs bg-slate-700 px-2 py-1 rounded hover:bg-slate-600 text-white">İptal</button>}
                                </div>

                                <form onSubmit={handleBlogSubmit} className="space-y-4">
                                    <div>
                                        <label className="text-xs text-gray-500 font-bold uppercase">Başlık</label>
                                        <input type="text" value={blogForm.title} onChange={e => setBlogForm({...blogForm, title: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm outline-none focus:border-pink-500 transition-colors" required />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="text-xs text-gray-500 font-bold uppercase">Kategori</label>
                                            <select value={blogForm.category} onChange={e => setBlogForm({...blogForm, category: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-xs outline-none focus:border-pink-500">
                                                <option>Teknoloji</option><option>Kariyer</option><option>Data</option><option>YBS</option><option>Kişisel Gelişim</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 font-bold uppercase">Süre</label>
                                            <input type="text" placeholder="5 dk" value={blogForm.readTime} onChange={e => setBlogForm({...blogForm, readTime: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-xs outline-none focus:border-pink-500" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-500 font-bold uppercase flex justify-between">Kapak Görseli <span className="text-[10px] font-normal normal-case text-blue-400 cursor-pointer hover:underline relative group">
                                            <FaImage className="inline mr-1"/>Resim Yükle
                                            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleBlogFileChange} />
                                        </span></label>
                                        <input type="text" placeholder="veya URL yapıştır..." value={blogForm.image && !blogForm.image.startsWith('data:') ? blogForm.image : ''} onChange={e => setBlogForm({...blogForm, image: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-xs outline-none focus:border-pink-500" />
                                        {blogForm.image && <div className="mt-2 h-20 w-full bg-slate-800 rounded-lg overflow-hidden"><img src={blogForm.image} className="w-full h-full object-cover opacity-50"/></div>}
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-500 font-bold uppercase">Özet</label>
                                        <textarea value={blogForm.excerpt} onChange={e => setBlogForm({...blogForm, excerpt: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm h-20 outline-none focus:border-pink-500 resize-none" required></textarea>
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-500 font-bold uppercase">İçerik (Markdown)</label>
                                        <textarea value={blogForm.content} onChange={e => setBlogForm({...blogForm, content: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm h-48 font-mono outline-none focus:border-pink-500 resize-y" required></textarea>
                                    </div>

                                    <button className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-pink-900/20">
                                        {isBlogEditing ? <><FaSave /> Değişiklikleri Kaydet</> : <><FaPlus /> Yazıyı Yayınla</>}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- TAB: MESAJLAR --- */}
                {activeTab === 'messages' && (
                    <div>
                        <div className="flex justify-between items-center mb-6 bg-[#111827] p-4 rounded-xl border border-slate-800">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaEnvelope className="text-green-500"/> Gelen Kutusu</h2>
                            <span className="bg-slate-800 text-gray-400 px-3 py-1 rounded-full text-xs font-bold">{messages.length} Mesaj</span>
                        </div>

                        <div className="grid gap-4">
                            {messages.length > 0 ? messages.map((msg) => (
                                <div key={msg.id} className="bg-[#111827] border border-slate-800 p-6 rounded-xl">
                                    <div className="flex justify-between mb-2">
                                        <h4 className="font-bold text-white">{msg.sender}</h4>
                                        <span className="text-xs text-gray-500">{msg.date}</span>
                                    </div>
                                    <p className="text-gray-400 text-sm">{msg.text}</p>
                                </div>
                            )) : (
                                <div className="bg-[#111827] border border-slate-800 p-12 rounded-xl text-center text-gray-500 flex flex-col items-center">
                                    <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-4xl opacity-50">📭</div>
                                    <p>Gelen kutusu boş.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default AdminDashboard;