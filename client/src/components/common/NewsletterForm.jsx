import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api';

// Tekrar kullanılabilir, işlevsel bülten formu.
// variant: 'compact' (dikey, dar alanlar) | 'inline' (yatay, geniş alanlar)
const NewsletterForm = ({ variant = 'compact', buttonLabel = 'Abone Ol' }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const isInline = variant === 'inline';

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) return;
        setLoading(true);
        try {
            const { data } = await api.post('/subscribers', { email });
            toast.success(data.message || 'Abone olundu!');
            setEmail('');
        } catch (err) {
            toast.error(
                err.response?.data?.errors?.map((x) => x.message).join(', ')
                || err.friendlyMessage
                || 'Abonelik başarısız.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={isInline ? 'flex flex-col sm:flex-row gap-4' : ''}
        >
            <label htmlFor={`nl-${variant}`} className="sr-only">E-posta adresi</label>
            <input
                id={`nl-${variant}`}
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-posta adresiniz"
                className={
                    isInline
                        ? 'flex-1 px-6 py-4 bg-black/30 border border-slate-600 rounded-xl text-white focus:border-blue-500 outline-none backdrop-blur-sm'
                        : 'w-full bg-black/30 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white mb-2 focus:border-blue-500 outline-none'
                }
            />
            <button
                type="submit"
                disabled={loading}
                className={
                    isInline
                        ? 'px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/25 disabled:opacity-50'
                        : 'w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-50'
                }
            >
                {loading ? '...' : buttonLabel}
            </button>
        </form>
    );
};

export default NewsletterForm;
