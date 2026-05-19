import { useState, useMemo } from 'react';
import { FaCalculator } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

// --- MALİYET HESAPLAYICI ---
const CostEstimator = () => {
    const { t } = useTranslation();
    const [type, setType] = useState(1);
    const [pages, setPages] = useState(5); // sayısal tutulur (range string'i Number'a çevrilir)
    const [features, setFeatures] = useState({ admin: false, seo: false, design: false });

    const cost = useMemo(() => {
        const base = type === 1 ? 500 : type === 2 ? 1200 : 2500;
        const pageCost = pages * 50;
        const featureCost = (features.admin ? 400 : 0) + (features.seo ? 200 : 0) + (features.design ? 300 : 0);
        return base + pageCost + featureCost;
    }, [type, pages, features]);

    return (
        <div className="bg-surface-raised border border-slate-700 rounded-2xl p-6 mt-6">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-700 pb-2">
                <FaCalculator className="text-green-400" />
                <h3 className="text-white font-bold">{t('contact.cost_title')}</h3>
            </div>
            <div className="space-y-4">
                <div>
                    <label className="text-xs text-gray-400 uppercase font-bold">{t('contact.est_type')}</label>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                        {[t('contact.est_landing'), t('contact.est_corporate'), t('contact.est_ecommerce')].map((label, i) => (
                            <button key={label} onClick={() => setType(i + 1)} className={`text-xs py-2 rounded border ${type === i + 1 ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-gray-400'}`}>{label}</button>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="text-xs text-gray-400 uppercase font-bold flex justify-between">{t('contact.est_pages')}: <span className="text-white">{pages}</span></label>
                    <input type="range" min="1" max="20" value={pages} onChange={(e) => setPages(Number(e.target.value))} className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer mt-1 accent-blue-500" />
                </div>
                <div className="flex flex-wrap gap-2">
                    {Object.keys(features).map(f => (
                        <button key={f} onClick={() => setFeatures({ ...features, [f]: !features[f] })} className={`text-xs px-3 py-1 rounded-full border ${features[f] ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-slate-800 border-slate-700 text-gray-500'}`}>
                            {f === 'admin' ? t('contact.est_admin') : f === 'seo' ? t('contact.est_seo') : t('contact.est_design')}
                        </button>
                    ))}
                </div>
                <div className="bg-black/30 p-4 rounded-xl text-center mt-2 border border-slate-700 border-dashed">
                    <p className="text-gray-500 text-xs mb-1">{t('contact.cost_range')}</p>
                    <p className="text-2xl font-bold text-white">${cost} - ${cost + 500}</p>
                </div>
            </div>
        </div>
    );
};

export default CostEstimator;
