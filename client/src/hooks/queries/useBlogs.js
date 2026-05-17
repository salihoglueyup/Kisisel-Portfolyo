import { useQuery, keepPreviousData } from '@tanstack/react-query';
import api from '../../api';

// Tüm blogları dizi olarak döndürür (admin paneli vb. — geriye dönük uyumlu)
export const useBlogs = () => {
    return useQuery({
        queryKey: ['blogs'],
        queryFn: async () => {
            const { data } = await api.get('/blogs');
            return data.data || [];
        }
    });
};

// Tek blog yazısı detayı — cache + retry + anlık geri gösterim
export const useBlog = (id) => {
    return useQuery({
        queryKey: ['blog', id],
        queryFn: async () => {
            const { data } = await api.get(`/blogs/${id}`);
            return data.data;
        },
        enabled: !!id
    });
};

// Public blog sayfası — server-side arama/kategori/sayfalama
export const useBlogList = ({ search = '', category = 'all', page = 1, limit = 6 } = {}) => {
    return useQuery({
        queryKey: ['blogs', 'list', { search, category, page, limit }],
        queryFn: async () => {
            const { data } = await api.get('/blogs', {
                params: { search, category, page, limit }
            });
            return {
                posts: data.data || [],
                pagination: data.pagination || { page: 1, totalPages: 1, total: 0 }
            };
        },
        placeholderData: keepPreviousData // sayfa değişiminde içerik zıplamasın
    });
};
