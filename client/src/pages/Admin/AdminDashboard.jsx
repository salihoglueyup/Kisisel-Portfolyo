import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../api';
import { useQueryClient } from '@tanstack/react-query';
import { useProjects } from '../../hooks/queries/useProjects';
import { useBlogs } from '../../hooks/queries/useBlogs';
import { useMessages } from '../../hooks/queries/useMessages';
import { useProfile } from '../../hooks/queries/useProfile';
import { FaProjectDiagram, FaPenNib, FaEnvelope, FaSignOutAlt, FaSave, FaTrash, FaEdit, FaPlus, FaImage, FaTimes, FaUserCog, FaKey, FaCheckCircle, FaCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


const AdminDashboard = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // --- GLOBAL STATE'LER ---
    const [activeTab, setActiveTab] = useState('projects');
    const { data: projects = [] } = useProjects();
    const { data: blogs = [] } = useBlogs();
    const { data: messages = [] } = useMessages();
    const { data: profile, isError: isProfileError } = useProfile();

    // --- PROFİL STATE'LERİ ---
    const [profileForm, setProfileForm] = useState({ displayName: '', email: '' });
    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });

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
        title: '', excerpt: '', content: '', category: 'Teknoloji', image: '', imageFile: null, readTime: '5 dk'
    });

    // --- YETKİ KONTROLÜ VE PROFİL FORMU GÜNCELLEME ---
    useEffect(() => {
        if (isProfileError) {
            toast.error('Oturum süresi doldu veya yetkisiz erişim.');
            localStorage.removeItem('adminToken');
            localStorage.removeItem('refreshToken');
            navigate('/admin/login');
        }
    }, [isProfileError, navigate]);

    useEffect(() => {
        if (profile) {
            setProfileForm({
                displayName: profile.displayName,
                email: profile.email
            });
        }
    }, [profile]);

    // --- YARDIMCI FONKSİYONLAR ---
    const showStatus = (type, msg) => {
        if (type === 'success') toast.success(msg);
        else toast.error(msg);
    };

    const handleLogout = () => {
        if (window.confirm("Çıkış yapmak istediğine emin misin?")) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('refreshToken');
            navigate('/admin/login');
        }
    };

    // ================= PROFİL İŞLEMLERİ =================

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put('/auth/profile', profileForm);
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            showStatus('success', 'Profil güncellendi!');
        } catch (err) {
            showStatus('error', err.response?.data?.message || 'Güncelleme hatası.');
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        try {
            await api.put('/auth/password', passwordForm);
            showStatus('success', 'Şifre başarıyla değiştirildi!');
            setPasswordForm({ currentPassword: '', newPassword: '' });
        } catch (err) {
            const msg = err.response?.data?.message
                || err.response?.data?.errors?.map(e => e.message).join(', ')
                || 'Şifre değiştirme hatası.';
            showStatus('error', msg);
        }
    };

    // ================= PROJE İŞLEMLERİ =================

    const handleDeleteProject = async (id) => {
        if (window.confirm("Bu projeyi silmek geri alınamaz. Emin misin?")) {
            try {
                await api.delete(`/projects/${id}`);
                queryClient.invalidateQueries({ queryKey: ['projects'] });
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
            await api.put(`/projects/${selectedProjectId}`, payload);
            showStatus('success', 'Proje güncellendi!');
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            setIsProjectEditing(false);
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
                await api.delete(`/blogs/${id}`);
                queryClient.invalidateQueries({ queryKey: ['blogs'] });
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
        setBlogForm({ title: '', excerpt: '', content: '', category: 'Teknoloji', image: '', imageFile: null, readTime: '5 dk' });
    };

    const handleBlogFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert("Dosya 5MB'dan büyük olamaz.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setBlogForm(prev => ({ ...prev, imageFile: file, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleBlogSubmit = async (e) => {
        e.preventDefault();
        try {
            const submitData = new FormData();
            submitData.append('title', blogForm.title);
            submitData.append('excerpt', blogForm.excerpt);
            submitData.append('content', blogForm.content);
            submitData.append('category', blogForm.category);
            submitData.append('readTime', blogForm.readTime);

            if (blogForm.imageFile) {
                submitData.append('image', blogForm.imageFile);
            } else if (blogForm.image) {
                submitData.append('image', blogForm.image);
            }

            if (isBlogEditing) {
                await api.put(`/blogs/${selectedBlogId}`, submitData, { headers: { 'Content-Type': 'multipart/form-data' } });
                showStatus('success', 'Makale güncellendi!');
            } else {
                await api.post('/blogs', submitData, { headers: { 'Content-Type': 'multipart/form-data' } });
                showStatus('success', 'Makale yayınlandı!');
            }
            queryClient.invalidateQueries({ queryKey: ['blogs'] });
            resetBlogForm();
        } catch (error) { showStatus('error', 'İşlem başarısız.'); }
    };

    // ================= MESAJ İŞLEMLERİ =================

    const handleMarkAsRead = async (id) => {
        try {
            await api.put(`/messages/${id}/read`);
            queryClient.invalidateQueries({ queryKey: ['messages'] });
        } catch (err) { showStatus('error', err.friendlyMessage || 'Okundu işaretleme hatası.'); }
    };

    const handleDeleteMessage = async (id) => {
        if (window.confirm('Bu mesajı silmek istediğine emin misin?')) {
            try {
                await api.delete(`/messages/${id}`);
                queryClient.invalidateQueries({ queryKey: ['messages'] });
                showStatus('success', 'Mesaj silindi.');
            } catch (err) { showStatus('error', err.friendlyMessage || 'Silme hatası.'); }
        }
    };


    return (
        <div className="min-h-screen bg-[#0B1120] pt-24 px-4 md:px-8 flex flex-col md:flex-row gap-8">

            {/* --- SIDEBAR --- */}
            <div className="w-full md:w-64 bg-[#111827] border border-slate-800 rounded-2xl p-6 h-fit md:fixed md:left-6 md:top-24 md:h-[calc(100vh-8rem)] flex flex-col shadow-xl z-10">
                <h2 className="text-white font-bold text-xl mb-2 flex items-center gap-2">
                    <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></span> YBS Admin
                </h2>
                {profile && (
                    <p className="text-xs text-gray-500 mb-6 ml-5">
                        {profile.displayName} • <span className="text-blue-400">{profile.role}</span>
                    </p>
                )}

                <nav className="space-y-2 flex-1">
                    <button onClick={() => setActiveTab('projects')} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 font-medium transition-all ${activeTab === 'projects' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-gray-400 hover:bg-slate-800 hover:text-white'}`}>
                        <FaProjectDiagram /> Projeler
                    </button>
                    <button onClick={() => setActiveTab('blogs')} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 font-medium transition-all ${activeTab === 'blogs' ? 'bg-pink-600 text-white shadow-lg shadow-pink-900/50' : 'text-gray-400 hover:bg-slate-800 hover:text-white'}`}>
                        <FaPenNib /> Blog Yönetimi
                    </button>
                    <button onClick={() => setActiveTab('messages')} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 font-medium transition-all ${activeTab === 'messages' ? 'bg-green-600 text-white shadow-lg shadow-green-900/50' : 'text-gray-400 hover:bg-slate-800 hover:text-white'}`}>
                        <FaEnvelope /> Mesajlar
                        {messages.filter(m => !m.isRead).length > 0 && (
                            <span className="ml-auto bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                {messages.filter(m => !m.isRead).length}
                            </span>
                        )}
                    </button>
                    <button onClick={() => setActiveTab('profile')} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 font-medium transition-all ${activeTab === 'profile' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50' : 'text-gray-400 hover:bg-slate-800 hover:text-white'}`}>
                        <FaUserCog /> Profil
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

                {/* DASHBOARD STATS SUMMARY */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-[#111827] border border-slate-800 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-blue-400">{projects.length}</p>
                        <p className="text-xs text-gray-500 uppercase font-bold">Proje</p>
                    </div>
                    <div className="bg-[#111827] border border-slate-800 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-pink-400">{blogs.length}</p>
                        <p className="text-xs text-gray-500 uppercase font-bold">Blog Yazısı</p>
                    </div>
                    <div className="bg-[#111827] border border-slate-800 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-green-400">{messages.length}</p>
                        <p className="text-xs text-gray-500 uppercase font-bold">Mesaj</p>
                    </div>
                    <div className="bg-[#111827] border border-slate-800 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-yellow-400">{messages.filter(m => !m.isRead).length}</p>
                        <p className="text-xs text-gray-500 uppercase font-bold">Okunmamış</p>
                    </div>
                </div>

                {/* --- TAB: PROJELER --- */}
                {activeTab === 'projects' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* SOL: LİSTE */}
                        <div className="lg:col-span-2">
                            <div className="flex justify-between items-center mb-6 bg-[#111827] p-4 rounded-xl border border-slate-800">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaProjectDiagram className="text-blue-500" /> Tüm Projeler</h2>
                                <button onClick={() => navigate('/admin/add-project')} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all">
                                    <FaPlus /> Yeni Ekle
                                </button>
                            </div>

                            <div className="space-y-3">
                                {projects.map((project) => (
                                    <div key={project._id} className="bg-[#111827] border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center gap-4 hover:border-blue-500/50 transition-all group">
                                        <img src={project.image || '/no-image.svg'} className="w-16 h-16 rounded-lg object-cover bg-slate-900" alt="cover" onError={(e) => { e.target.style.display='none'; }} />
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
                                        <button onClick={() => setIsProjectEditing(false)} className="text-gray-500 hover:text-white"><FaTimes /></button>
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
                                    <FaEdit className="text-4xl mx-auto mb-2 opacity-20" />
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
                                <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaPenNib className="text-pink-500" /> Blog Yazıları</h2>
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
                                        <input type="text" value={blogForm.title} onChange={e => setBlogForm({ ...blogForm, title: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm outline-none focus:border-pink-500 transition-colors" required />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="text-xs text-gray-500 font-bold uppercase">Kategori</label>
                                            <select value={blogForm.category} onChange={e => setBlogForm({ ...blogForm, category: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-xs outline-none focus:border-pink-500">
                                                <option>Teknoloji</option><option>Kariyer</option><option>Data</option><option>YBS</option><option>Kişisel Gelişim</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 font-bold uppercase">Süre</label>
                                            <input type="text" placeholder="5 dk" value={blogForm.readTime} onChange={e => setBlogForm({ ...blogForm, readTime: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-xs outline-none focus:border-pink-500" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-500 font-bold uppercase flex justify-between">Kapak Görseli <span className="text-[10px] font-normal normal-case text-blue-400 cursor-pointer hover:underline relative group">
                                            <FaImage className="inline mr-1" />Resim Yükle
                                            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleBlogFileChange} />
                                        </span></label>
                                        <input type="text" placeholder="veya URL yapıştır..." value={blogForm.image && !blogForm.image.startsWith('data:') ? blogForm.image : ''} onChange={e => setBlogForm({ ...blogForm, image: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-xs outline-none focus:border-pink-500" />
                                        {blogForm.image && <div className="mt-2 h-20 w-full bg-slate-800 rounded-lg overflow-hidden"><img src={blogForm.image} className="w-full h-full object-cover opacity-50" /></div>}
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-500 font-bold uppercase">Özet</label>
                                        <textarea value={blogForm.excerpt} onChange={e => setBlogForm({ ...blogForm, excerpt: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm h-20 outline-none focus:border-pink-500 resize-none" required></textarea>
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-500 font-bold uppercase">İçerik (Markdown)</label>
                                        <textarea value={blogForm.content} onChange={e => setBlogForm({ ...blogForm, content: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm h-48 font-mono outline-none focus:border-pink-500 resize-y" required></textarea>
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
                            <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaEnvelope className="text-green-500" /> Gelen Kutusu</h2>
                            <span className="bg-slate-800 text-gray-400 px-3 py-1 rounded-full text-xs font-bold">{messages.length} Mesaj</span>
                        </div>

                        <div className="grid gap-4">
                            {messages.length > 0 ? messages.map((msg) => (
                                <div key={msg._id} className={`bg-[#111827] border p-6 rounded-xl transition-all ${msg.isRead ? 'border-slate-800 opacity-70' : 'border-green-500/30'}`}>
                                    <div className="flex justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            {!msg.isRead && <FaCircle className="text-green-500 text-[8px]" />}
                                            <h4 className="font-bold text-white">{msg.name}</h4>
                                            <span className="text-xs text-gray-500">&lt;{msg.email}&gt;</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleDateString('tr-TR')}</span>
                                            {!msg.isRead && (
                                                <button onClick={() => handleMarkAsRead(msg._id)} className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded hover:bg-green-500/40 transition-colors flex items-center gap-1">
                                                    <FaCheckCircle /> Okundu
                                                </button>
                                            )}
                                            <button onClick={() => handleDeleteMessage(msg._id)} className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded hover:bg-red-500/40 transition-colors flex items-center gap-1">
                                                <FaTrash /> Sil
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mb-2">
                                        <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded font-bold">{msg.subject}</span>
                                    </div>
                                    <p className="text-gray-400 text-sm">{msg.message}</p>
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

                {/* --- TAB: PROFİL --- */}
                {activeTab === 'profile' && profile && (
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-2 mb-8 bg-[#111827] p-4 rounded-xl border border-slate-800">
                            <FaUserCog className="text-purple-500" />
                            <h2 className="text-xl font-bold text-white">Hesap Yönetimi</h2>
                        </div>

                        <div className="grid gap-8">
                            {/* Profil Bilgileri */}
                            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-8">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                    <FaUserCog className="text-blue-400" /> Profil Bilgileri
                                </h3>
                                <form onSubmit={handleProfileUpdate} className="space-y-4">
                                    <div>
                                        <label className="text-xs text-gray-500 font-bold uppercase">Görüntülenen İsim</label>
                                        <input
                                            type="text"
                                            value={profileForm.displayName}
                                            onChange={e => setProfileForm({ ...profileForm, displayName: e.target.value })}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-blue-500 mt-1"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 font-bold uppercase">Email</label>
                                        <input
                                            type="email"
                                            value={profileForm.email}
                                            onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-blue-500 mt-1"
                                        />
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-gray-500 pt-2">
                                        <span>Rol: <strong className="text-purple-400">{profile.role}</strong></span>
                                        <span>•</span>
                                        <span>Son Giriş: {profile.lastLogin ? new Date(profile.lastLogin).toLocaleString('tr-TR') : 'İlk giriş'}</span>
                                    </div>
                                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-bold transition-colors mt-2">
                                        Profili Güncelle
                                    </button>
                                </form>
                            </div>

                            {/* Şifre Değiştirme */}
                            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-8">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                    <FaKey className="text-yellow-400" /> Şifre Değiştir
                                </h3>
                                <form onSubmit={handlePasswordChange} className="space-y-4">
                                    <div>
                                        <label className="text-xs text-gray-500 font-bold uppercase">Mevcut Şifre</label>
                                        <input
                                            type="password"
                                            value={passwordForm.currentPassword}
                                            onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-yellow-500 mt-1"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 font-bold uppercase">Yeni Şifre</label>
                                        <input
                                            type="password"
                                            value={passwordForm.newPassword}
                                            onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-yellow-500 mt-1"
                                            required
                                        />
                                        <p className="text-[10px] text-gray-600 mt-1">En az 8 karakter, büyük/küçük harf ve rakam içermelidir.</p>
                                    </div>
                                    <button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-500 text-white py-3 rounded-lg font-bold transition-colors">
                                        Şifreyi Değiştir
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default AdminDashboard;