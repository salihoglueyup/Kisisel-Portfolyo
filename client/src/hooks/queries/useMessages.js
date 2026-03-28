import { useQuery } from '@tanstack/react-query';
import api from '../../api';

export const useMessages = () => {
    return useQuery({
        queryKey: ['messages'],
        queryFn: async () => {
            const { data } = await api.get('/messages');
            return data.data || [];
        }
    });
};
