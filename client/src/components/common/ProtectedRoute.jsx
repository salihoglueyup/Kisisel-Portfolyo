import { Navigate } from 'react-router-dom';
import { useProfile } from '../../hooks/queries/useProfile';
import LoadingSpinner from './LoadingSpinner';

// Korumalı route: token varlığı YETMEZ — sunucuda /auth/profile ile
// doğrulanır. Geçersiz/süresi dolmuş token'da login'e yönlendirir.
// Böylece sarmaladığı tüm sayfalar (Dashboard, AddProject) tek noktadan
// korunur; sayfaların ayrı ayrı yetki kontrolü yapmasına gerek kalmaz.
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('adminToken');
    const { isLoading, isError } = useProfile();

    if (!token) {
        return <Navigate to="/admin/login" replace />;
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (isError) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('csrfToken');
        return <Navigate to="/admin/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
