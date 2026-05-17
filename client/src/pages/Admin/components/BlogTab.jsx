import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../../api';
import { useQueryClient } from '@tanstack/react-query';
import { FaPenNib, FaEdit, FaTrash, FaPlus, FaSave, FaImage } from 'react-icons/fa';

const BlogTab = ({ blogs }) => {
    const queryClient = useQueryClient();

    const [isEditing, setIsEditing] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [form, setForm] = useState({
        title: '', excerpt: '', content: '', category: 'Teknoloji', image: '', imageFile: null, readTime: '5 dk'
    });

    const handleDelete = async (id) => {
        if (window.confirm("Bu makaleyi silmek istediğine emin misin?")) {
            try {
                await api.delete(`/blogs/${id}`);
                queryClient.invalidateQueries({ queryKey: ['blogs'] });
                toast.success('Makale silindi.');
            } catch { toast.error('Silme hatası.'); }
        }
    };

    const openEdit = (blog) => {
        setIsEditing(true);
        setSelectedId(blog._id);
        setForm(blog);
    };

    const resetForm = () => {
        setIsEditing(false);
        setSelectedId(null);
        setForm({ title: '', excerpt: '', content: '', category: 'Teknoloji', image: '', imageFile: null, readTime: '5 dk' });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert("Dosya 5MB'dan büyük olamaz.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setForm(prev => ({ ...prev, imageFile: file, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const submitData = new FormData();
            submitData.append('title', form.title);
            submitData.append('excerpt', form.excerpt);
            submitData.append('content', form.content);
            submitData.append('category', form.category);
            submitData.append('readTime', form.readTime);

            if (form.imageFile) {
                submitData.append('image', form.imageFile);
            } else if (form.image) {
                submitData.append('image', form.image);
            }

            if (isEditing) {
                await api.put(`/blogs/${selectedId}`, submitData, { headers: { 'Content-Type': 'multipart/form-data' } });
                toast.success('Makale güncellendi!');
            } else {
                await api.post('/blogs', submitData, { headers: { 'Content-Type': 'multipart/form-data' } });
                toast.success('Makale yayınlandı!');
            }
            queryClient.invalidateQueries({ queryKey: ['blogs'] });
            resetForm();
        } catch { toast.error('İşlem başarısız.'); }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* SOL: BLOG LİSTESİ */}
            <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-6 bg-[#111827] p-4 rounded-xl border border-slate-800">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaPenNib className="text-pink-500" /> Blog Yazıları</h2>
                    <button onClick={resetForm} className="bg-pink-600 hover:bg-pink-500 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-pink-600/20 transition-all">
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
                                <button onClick={() => openEdit(blog)} className="p-2 bg-slate-800 text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"><FaEdit /></button>
                                <button onClick={() => handleDelete(blog._id)} className="p-2 bg-slate-800 text-red-400 rounded-lg hover:bg-red-600 hover:text-white transition-colors"><FaTrash /></button>
                            </div>
                        </div>
                    ))}
                    {blogs.length === 0 && <div className="text-gray-500 text-center py-12 bg-[#111827] rounded-xl border border-slate-800 border-dashed">Henüz makale yok.</div>}
                </div>
            </div>

            {/* SAĞ: BLOG FORMU */}
            <div className="lg:col-span-1">
                <div className={`bg-[#111827] border p-6 rounded-xl sticky top-28 ${isEditing ? 'border-pink-500/50 shadow-2xl shadow-pink-900/20' : 'border-slate-700'}`}>
                    <div className="flex justify-between items-center mb-4 border-b border-slate-600 pb-2">
                        <h3 className="text-lg font-bold text-white">
                            {isEditing ? 'Makaleyi Düzenle' : 'Yeni Makale Yaz'}
                        </h3>
                        {isEditing && <button onClick={resetForm} className="text-xs bg-slate-700 px-2 py-1 rounded hover:bg-slate-600 text-white">İptal</button>}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-xs text-gray-500 font-bold uppercase">Başlık</label>
                            <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm outline-none focus:border-pink-500 transition-colors" required />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-xs text-gray-500 font-bold uppercase">Kategori</label>
                                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-xs outline-none focus:border-pink-500">
                                    <option>Teknoloji</option><option>Kariyer</option><option>Data</option><option>YBS</option><option>Kişisel Gelişim</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 font-bold uppercase">Süre</label>
                                <input type="text" placeholder="5 dk" value={form.readTime} onChange={e => setForm({ ...form, readTime: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-xs outline-none focus:border-pink-500" />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-gray-500 font-bold uppercase flex justify-between">Kapak Görseli <span className="text-[10px] font-normal normal-case text-blue-400 cursor-pointer hover:underline relative group">
                                <FaImage className="inline mr-1" />Resim Yükle
                                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                            </span></label>
                            <input type="text" placeholder="veya URL yapıştır..." value={form.image && !form.image.startsWith('data:') ? form.image : ''} onChange={e => setForm({ ...form, image: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-xs outline-none focus:border-pink-500" />
                            {form.image && <div className="mt-2 h-20 w-full bg-slate-800 rounded-lg overflow-hidden"><img src={form.image} className="w-full h-full object-cover opacity-50" /></div>}
                        </div>

                        <div>
                            <label className="text-xs text-gray-500 font-bold uppercase">Özet</label>
                            <textarea value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm h-20 outline-none focus:border-pink-500 resize-none" required></textarea>
                        </div>

                        <div>
                            <label className="text-xs text-gray-500 font-bold uppercase">İçerik (Markdown)</label>
                            <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm h-48 font-mono outline-none focus:border-pink-500 resize-y" required></textarea>
                        </div>

                        <button className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-pink-900/20">
                            {isEditing ? <><FaSave /> Değişiklikleri Kaydet</> : <><FaPlus /> Yazıyı Yayınla</>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BlogTab;
