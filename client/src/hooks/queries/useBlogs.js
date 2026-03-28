import { useQuery } from '@tanstack/react-query';
import api from '../../api';

export const useBlogs = () => {
    return useQuery({
        queryKey: ['blogs'],
        queryFn: async () => {
            const { data } = await api.get('/blogs');
            return data;
        }
    });
};
