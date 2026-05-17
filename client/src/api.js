import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    timeout: 15000,
    withCredentials: true, // httpOnly refresh cookie'sinin gönderilmesi için
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor — access token + CSRF token header'larını ekle
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        const csrfToken = localStorage.getItem('csrfToken');
        if (csrfToken) {
            config.headers['X-CSRF-Token'] = csrfToken;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor — hata yönetimi
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Ağ hatası (sunucu kapalı, timeout vb.)
        if (!error.response) {
            error.friendlyMessage = 'Sunucuya bağlanılamıyor. İnternet bağlantınızı kontrol edin.';
            return Promise.reject(error);
        }

        const { status, data } = error.response;

        switch (status) {
            case 401:
                // Access token süresi dolmuş — refresh cookie ile yenilemeyi dene.
                // Refresh endpoint'inin kendisi 401 dönerse tekrar deneme (sonsuz döngü olmasın).
                if (!error.config._retry && !error.config.url?.includes('/auth/refresh')) {
                    error.config._retry = true;
                    return handleTokenRefresh(error.config);
                }
                // Refresh de başarısız — oturumu kapat
                localStorage.removeItem('adminToken');
                localStorage.removeItem('csrfToken');
                if (window.location.pathname.startsWith('/admin')) {
                    window.location.href = '/admin/login';
                }
                break;

            case 403:
                error.friendlyMessage = 'Bu işlem için yetkiniz yok.';
                break;

            case 404:
                error.friendlyMessage = 'İstenen kaynak bulunamadı.';
                break;

            case 413:
                error.friendlyMessage = 'Dosya boyutu çok büyük.';
                break;

            case 429:
                error.friendlyMessage = 'Çok fazla istek gönderdiniz. Lütfen biraz bekleyin.';
                break;

            case 500:
                error.friendlyMessage = 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.';
                break;

            default:
                error.friendlyMessage = data?.message || 'Beklenmeyen bir hata oluştu.';
        }

        // Global Toast Notification for all API errors
        if (error.friendlyMessage) {
            toast.error(error.friendlyMessage);
        }

        return Promise.reject(error);
    }
);

// Token yenileme — refresh token httpOnly cookie'de, gövdeye gerek yok
const handleTokenRefresh = async (failedConfig) => {
    try {
        const res = await axios.post(
            `${api.defaults.baseURL}/auth/refresh`,
            {},
            {
                withCredentials: true,
                headers: { 'X-CSRF-Token': localStorage.getItem('csrfToken') || '' }
            }
        );
        const { accessToken } = res.data.data;
        localStorage.setItem('adminToken', accessToken);
        failedConfig.headers.Authorization = `Bearer ${accessToken}`;
        return api(failedConfig);
    } catch (refreshError) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('csrfToken');
        if (window.location.pathname.startsWith('/admin')) {
            window.location.href = '/admin/login';
        }
        return Promise.reject(refreshError);
    }
};

export default api;
