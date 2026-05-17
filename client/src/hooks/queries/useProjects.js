import { useQuery } from '@tanstack/react-query';
import api from '../../api';

export const useProjects = () => {
    return useQuery({
        queryKey: ['projects'],
        queryFn: async () => {
            const { data } = await api.get('/projects');
            return data.data || [];
        }
    });
};

// Tek proje detayı — cache + retry + anlık geri gösterim
export const useProject = (id) => {
    return useQuery({
        queryKey: ['project', id],
        queryFn: async () => {
            const { data } = await api.get(`/projects/${id}`);
            return data.data;
        },
        enabled: !!id
    });
};
