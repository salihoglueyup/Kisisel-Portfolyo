import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../../api';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { FaProjectDiagram, FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';

const ProjectTab = ({ projects }) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [isEditing, setIsEditing] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [form, setForm] = useState({
        title: '', description: '', image: '', tags: '',
        metrics: { complexity: 5, hoursSpent: 0, linesOfCode: 0 },
        links: { github: '', live: '' }
    });

    const handleDelete = async (id) => {
        if (window.confirm("Bu projeyi silmek geri alınamaz. Emin misin?")) {
            try {
                await api.delete(`/projects/${id}`);
                queryClient.invalidateQueries({ queryKey: ['projects'] });
                toast.success('Proje başarıyla silindi.');
            } catch { toast.error('Silme işlemi başarısız.'); }
        }
    };

    const openEdit = (project) => {
        setIsEditing(true);
        setSelectedId(project._id);
        setForm({
            title: project.title,
            description: project.description,
            image: project.image,
            tags: Array.isArray(project.tags) ? project.tags.join(', ') : project.tags,
            metrics: project.metrics || { complexity: 5, hoursSpent: 0, linesOfCode: 0 },
            links: project.links || { github: '', live: '' }
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const payload = {
            ...form,
            tags: typeof form.tags === 'string' ? form.tags.split(',').map(t => t.trim()).filter(t => t) : form.tags,
            metrics: {
                complexity: Number(form.metrics.complexity),
                hoursSpent: Number(form.metrics.hoursSpent),
                linesOfCode: Number(form.metrics.linesOfCode)
            }
        };

        try {
            await api.put(`/projects/${selectedId}`, payload);
            toast.success('Proje güncellendi!');
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            setIsEditing(false);
            setForm({ title: '', description: '', image: '', tags: '', metrics: { complexity: 5, hoursSpent: 0, linesOfCode: 0 }, links: { github: '', live: '' } });
        } catch { toast.error('Güncelleme hatası.'); }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setForm(prev => ({ ...prev, [parent]: { ...prev[parent], [child]: value } }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };

    return (
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
                                <button onClick={() => openEdit(project)} className="p-2 bg-slate-800 text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"><FaEdit /></button>
                                <button onClick={() => handleDelete(project._id)} className="p-2 bg-slate-800 text-red-400 rounded-lg hover:bg-red-600 hover:text-white transition-colors"><FaTrash /></button>
                            </div>
                        </div>
                    ))}
                    {projects.length === 0 && <div className="text-gray-500 text-center py-12 bg-[#111827] rounded-xl border border-slate-800 border-dashed">Henüz proje eklenmemiş.</div>}
                </div>
            </div>

            {/* SAĞ: HIZLI DÜZENLEME */}
            <div className="lg:col-span-1">
                {isEditing ? (
                    <div className="bg-[#111827] border border-blue-500/50 p-6 rounded-xl sticky top-28 shadow-2xl shadow-blue-900/20">
                        <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-2">
                            <h3 className="text-lg font-bold text-white">Projeyi Düzenle</h3>
                            <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-white"><FaTimes /></button>
                        </div>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <input name="title" value={form.title} onChange={handleFormChange} placeholder="Başlık" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm outline-none focus:border-blue-500" />
                            <textarea name="description" value={form.description} onChange={handleFormChange} rows="3" placeholder="Kısa Açıklama" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm outline-none focus:border-blue-500"></textarea>
                            <div className="grid grid-cols-2 gap-2">
                                <input name="metrics.complexity" type="number" placeholder="Zorluk" value={form.metrics.complexity} onChange={handleFormChange} className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-xs outline-none" />
                                <input name="metrics.hoursSpent" type="number" placeholder="Saat" value={form.metrics.hoursSpent} onChange={handleFormChange} className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-xs outline-none" />
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
    );
};

export default ProjectTab;
