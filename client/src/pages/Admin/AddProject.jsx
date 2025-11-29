import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaSave, FaMagic, FaTimes, FaImage, FaBriefcase, FaCalendarAlt, FaInfoCircle, FaUpload, FaServer, FaListUl } from 'react-icons/fa';
import ProjectCard from '../../components/project/ProjectCard';

const AddProject = () => {
    // --- FORM VERİLERİ (Tüm alanlar birleştirildi) ---
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: '', // Base64 veya URL
        tags: [],
        tagInput: '',
        category: 'Web Geliştirme',
        role: '',
        status: 'Tamamlandı',
        date: '',
        // Adım 2'den gelen Teknik Alanlar
        technicalArchitecture: {
            frontend: '',
            backend: '',
            database: '',
            devops: ''
        },
        // Adım 2'den gelen Özellikler (Liste için string tutuyoruz)
        featuresInput: '',
        metrics: {
            complexity: 5,
            hoursSpent: 0,
            linesOfCode: 0
        },
        links: {
            github: '',
            live: ''
        }
    });

    const [status, setStatus] = useState({ type: '', msg: '' });

    // --- INPUT HANDLER ---
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Nested (İç içe) Obje Yönetimi
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // --- DOSYA YÜKLEME (Base64) ---
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB Sınırı
                alert("Dosya çok büyük! Lütfen 2MB'dan küçük bir resim seçin.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    // --- TAG YÖNETİMİ ---
    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            if (formData.tagInput.trim()) {
                setFormData(prev => ({
                    ...prev,
                    tags: [...prev.tags, prev.tagInput.trim()],
                    tagInput: ''
                }));
            }
        }
    };

    const removeTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    // --- GÖNDERME İŞLEMİ ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: 'loading', msg: 'Veritabanına kaydediliyor...' });

        try {
            // Features stringini satır satır ayırıp array yapıyoruz
            const featuresArray = formData.featuresInput.split('\n').filter(line => line.trim() !== '');

            const payload = {
                ...formData,
                features: featuresArray, // Array olarak gönder
                metrics: {
                    complexity: Number(formData.metrics.complexity),
                    hoursSpent: Number(formData.metrics.hoursSpent),
                    linesOfCode: Number(formData.metrics.linesOfCode)
                }
            };

            await axios.post('http://localhost:5000/api/projects', payload);

            setStatus({ type: 'success', msg: 'Proje ve Detaylar Eklendi! 🎉' });

            // Formu sıfırla
            setFormData({
                title: '', description: '', image: '', tags: [], tagInput: '',
                category: 'Web Geliştirme', role: '', status: 'Tamamlandı', date: '',
                technicalArchitecture: { frontend: '', backend: '', database: '', devops: '' },
                featuresInput: '',
                metrics: { complexity: 5, hoursSpent: 0, linesOfCode: 0 },
                links: { github: '', live: '' }
            });

        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 413) {
                setStatus({ type: 'error', msg: 'Resim dosyası çok büyük!' });
            } else {
                setStatus({ type: 'error', msg: 'Hata oluştu. Backend çalışıyor mu?' });
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#0B1120] pt-28 pb-20 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* SOL: FORM ALANI */}
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                        <FaMagic className="text-purple-500" /> Gelişmiş Proje Ekle
                    </h1>
                    <p className="text-gray-400 mb-8">Teknik mimari ve detaylı verilerle proje girişi.</p>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* 1. Temel Bilgiler */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400 font-bold">Proje Başlığı</label>
                                <input
                                    type="text" name="title" required
                                    value={formData.title} onChange={handleChange}
                                    className="w-full bg-[#1f2937] border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none"
                                    placeholder="Örn: E-Ticaret Dashboard"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400 font-bold">Kategori</label>
                                <select
                                    name="category"
                                    value={formData.category} onChange={handleChange}
                                    className="w-full bg-[#1f2937] border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none"
                                >
                                    <option>Web Geliştirme</option>
                                    <option>Mobil Uygulama</option>
                                    <option>Veri Analizi</option>
                                    <option>Yapay Zeka</option>
                                    <option>Masaüstü Yazılım</option>
                                </select>
                            </div>
                        </div>

                        {/* 2. Detaylar (Rol, Durum, Tarih) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400 font-bold flex items-center gap-2"><FaBriefcase className="text-xs"/> Rolüm</label>
                                <input
                                    type="text" name="role"
                                    value={formData.role} onChange={handleChange}
                                    className="w-full bg-[#1f2937] border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 outline-none"
                                    placeholder="Full Stack Dev"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400 font-bold">Durum</label>
                                <select
                                    name="status"
                                    value={formData.status} onChange={handleChange}
                                    className="w-full bg-[#1f2937] border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 outline-none"
                                >
                                    <option>Tamamlandı</option>
                                    <option>Devam Ediyor</option>
                                    <option>Bakım Modunda</option>
                                    <option>Prototip</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400 font-bold flex items-center gap-2"><FaCalendarAlt className="text-xs"/> Tarih</label>
                                <input
                                    type="date" name="date"
                                    value={formData.date} onChange={handleChange}
                                    className="w-full bg-[#1f2937] border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 outline-none"
                                />
                            </div>
                        </div>

                        {/* 3. TEKNİK MİMARİ GİRİŞİ (Adım 2'den Eklendi) */}
                        <div className="bg-[#111827] p-6 rounded-xl border border-slate-800 space-y-4">
                            <h3 className="text-white font-bold text-sm border-b border-slate-700 pb-2 mb-4 flex items-center gap-2">
                                <FaServer className="text-green-500"/> Teknik Mimari (Teknolojiler)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" name="technicalArchitecture.frontend" placeholder="Frontend (Örn: React, Tailwind)" value={formData.technicalArchitecture.frontend} onChange={handleChange} className="bg-slate-900 border border-slate-600 rounded p-2 text-white text-sm outline-none focus:border-blue-500" />
                                <input type="text" name="technicalArchitecture.backend" placeholder="Backend (Örn: Node.js, Express)" value={formData.technicalArchitecture.backend} onChange={handleChange} className="bg-slate-900 border border-slate-600 rounded p-2 text-white text-sm outline-none focus:border-blue-500" />
                                <input type="text" name="technicalArchitecture.database" placeholder="Database (Örn: MongoDB, Redis)" value={formData.technicalArchitecture.database} onChange={handleChange} className="bg-slate-900 border border-slate-600 rounded p-2 text-white text-sm outline-none focus:border-blue-500" />
                                <input type="text" name="technicalArchitecture.devops" placeholder="DevOps (Örn: Docker, AWS)" value={formData.technicalArchitecture.devops} onChange={handleChange} className="bg-slate-900 border border-slate-600 rounded p-2 text-white text-sm outline-none focus:border-blue-500" />
                            </div>
                        </div>

                        {/* 4. ANA ÖZELLİKLER (Adım 2'den Eklendi) */}
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400 font-bold flex items-center gap-2"><FaListUl/> Ana Özellikler (Her satıra bir özellik yaz)</label>
                            <textarea
                                name="featuresInput" rows="4"
                                value={formData.featuresInput} onChange={handleChange}
                                className="w-full bg-[#1f2937] border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none"
                                placeholder="- Kullanıcı Giriş Sistemi&#10;- Admin Paneli&#10;- Gerçek Zamanlı Bildirimler"
                            ></textarea>
                        </div>

                        {/* 5. Görsel Yükleme (Dosya Seç) */}
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400 font-bold flex items-center gap-2"><FaImage/> Kapak Görseli</label>
                            <div className="flex flex-col gap-3">
                                <label className="flex items-center justify-center w-full p-4 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-slate-800/50 transition-all group">
                                    <div className="flex flex-col items-center gap-2">
                                        <FaUpload className="text-2xl text-gray-500 group-hover:text-blue-400 transition-colors" />
                                        <span className="text-sm text-gray-400 group-hover:text-white">
                                            {formData.image && formData.image.startsWith('data:')
                                                ? "Resim Seçildi (Değiştirmek için Tıkla)"
                                                : "Bilgisayardan Resim Yükle"}
                                        </span>
                                    </div>
                                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 text-xs font-bold">URL</span>
                                    <input
                                        type="text" name="image"
                                        value={formData.image && !formData.image.startsWith('data:') ? formData.image : ''}
                                        onChange={handleChange}
                                        className="w-full bg-[#1f2937] border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white text-xs focus:border-blue-500 outline-none"
                                        placeholder="veya resim bağlantısı yapıştır..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 6. Açıklama */}
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400 font-bold">Genel Açıklama (Markdown)</label>
                            <textarea
                                name="description" required rows="4"
                                value={formData.description} onChange={handleChange}
                                className="w-full bg-[#1f2937] border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none"
                                placeholder="Proje hikayesi, amacı ve sonuçları..."
                            ></textarea>
                        </div>

                        {/* 7. Metrikler */}
                        <div className="bg-[#111827] p-6 rounded-xl border border-slate-800 space-y-4">
                            <h3 className="text-white font-bold text-sm border-b border-slate-700 pb-2 mb-4 flex justify-between">
                                <span>Proje Metrikleri</span>
                                <span className="text-xs text-gray-500 font-normal">Manuel giriş.</span>
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400">Karmaşıklık (1-10)</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="range" name="metrics.complexity" min="1" max="10"
                                            value={formData.metrics.complexity} onChange={handleChange}
                                            className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                                        />
                                        <span className="text-white font-bold w-6 text-center">{formData.metrics.complexity}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400">Harcanan Saat</label>
                                    <input
                                        type="number" name="metrics.hoursSpent"
                                        value={formData.metrics.hoursSpent} onChange={handleChange}
                                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400">Satır Kod</label>
                                    <input
                                        type="number" name="metrics.linesOfCode"
                                        value={formData.metrics.linesOfCode} onChange={handleChange}
                                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 8. Linkler & Tagler */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400 font-bold">Github Link</label>
                                <input
                                    type="text" name="links.github"
                                    value={formData.links.github} onChange={handleChange}
                                    className="w-full bg-[#1f2937] border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400 font-bold">Live Demo Link</label>
                                <input
                                    type="text" name="links.live"
                                    value={formData.links.live} onChange={handleChange}
                                    className="w-full bg-[#1f2937] border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none"
                                />
                            </div>
                        </div>

                        {/* 9. Tag Input */}
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400 font-bold">Teknolojiler</label>
                            <div className="flex flex-wrap gap-2 mb-2 min-h-[30px]">
                                {formData.tags.map(tag => (
                                    <span key={tag} className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded text-xs flex items-center gap-1 border border-blue-500/30">
                                        {tag} <FaTimes className="cursor-pointer hover:text-white" onClick={() => removeTag(tag)}/>
                                    </span>
                                ))}
                            </div>
                            <input
                                type="text" name="tagInput"
                                value={formData.tagInput} onChange={(e) => setFormData({...formData, tagInput: e.target.value})}
                                onKeyDown={handleTagKeyDown}
                                placeholder="React, MongoDB yazıp Enter'a bas..."
                                className="w-full bg-[#1f2937] border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none"
                            />
                        </div>

                        {/* Mesaj Alanı */}
                        {status.msg && (
                            <div className={`p-4 rounded-lg font-bold text-center ${status.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-red-500/20 text-red-400 border border-red-500/50'}`}>
                                {status.msg}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={status.type === 'loading'}
                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                        >
                            {status.type === 'loading' ? 'Kaydediliyor...' : <><FaSave /> Projeyi Veritabanına İşle</>}
                        </button>

                    </form>
                </div>

                {/* SAĞ: CANLI ÖNİZLEME (PREVIEW) */}
                <div className="hidden lg:block sticky top-28 h-min">
                    <h2 className="text-xl font-bold text-gray-400 mb-6 uppercase tracking-wider flex items-center gap-2">
                        <FaImage className="text-blue-500"/> Canlı Önizleme
                    </h2>

                    <div className="pointer-events-none transform scale-100 origin-top">
                        <ProjectCard project={{
                            ...formData,
                            metrics: {
                                complexity: Number(formData.metrics.complexity),
                                hoursSpent: Number(formData.metrics.hoursSpent),
                                linesOfCode: Number(formData.metrics.linesOfCode)
                            }
                        }} />
                    </div>

                    <div className="mt-8 p-6 bg-blue-900/10 rounded-xl border border-blue-500/20 text-sm text-blue-200">
                        <h4 className="font-bold mb-2 flex items-center gap-2"><FaInfoCircle/> Tam Kontrol</h4>
                        <p className="mb-2">Girdiğin 'Teknik Mimari' ve 'Özellikler' bilgileri artık proje detay sayfasında özel sekmeler halinde görünecek.</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AddProject;