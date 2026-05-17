import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../../hooks/queries/useProjects';
import { useBlogs } from '../../hooks/queries/useBlogs';
import { useMessages } from '../../hooks/queries/useMessages';
import { useProfile } from '../../hooks/queries/useProfile';
import api from '../../api';

// Modüler Bileşenler
import AdminSidebar from './components/AdminSidebar';
import AdminStatsBar from './components/AdminStatsBar';
import ProjectTab from './components/ProjectTab';
import BlogTab from './components/BlogTab';
import MessagesTab from './components/MessagesTab';
import ProfileTab from './components/ProfileTab';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('projects');

    const { data: projects = [] } = useProjects();
    const { data: blogs = [] } = useBlogs();
    const { data: messages = [] } = useMessages();
    // Yetki kontrolü ProtectedRoute'ta tek noktadan yapılıyor;
    // burada profil yalnızca sidebar verisi için kullanılıyor.
    const { data: profile } = useProfile();

    const handleLogout = async () => {
        if (window.confirm("Çıkış yapmak istediğine emin misin?")) {
            try {
                // Backend httpOnly refresh cookie'sini temizler
                await api.post('/auth/logout');
            } catch {
                // Ağ hatası olsa bile yerel oturumu kapat
            }
            localStorage.removeItem('adminToken');
            localStorage.removeItem('csrfToken');
            navigate('/admin/login');
        }
    };

    const unreadCount = messages.filter(m => !m.isRead).length;

    return (
        <div className="min-h-screen bg-[#0B1120] pt-24 px-4 md:px-8 flex flex-col md:flex-row gap-8">
            <AdminSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                profile={profile}
                unreadCount={unreadCount}
                handleLogout={handleLogout}
            />

            <div className="flex-1 md:ml-[18rem] pb-20">
                <AdminStatsBar projects={projects} blogs={blogs} messages={messages} />

                {activeTab === 'projects' && <ProjectTab projects={projects} />}
                {activeTab === 'blogs' && <BlogTab blogs={blogs} />}
                {activeTab === 'messages' && <MessagesTab messages={messages} />}
                {activeTab === 'profile' && <ProfileTab profile={profile} />}
            </div>
        </div>
    );
};

export default AdminDashboard;