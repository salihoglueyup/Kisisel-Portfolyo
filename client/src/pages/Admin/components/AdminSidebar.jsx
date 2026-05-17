import { FaProjectDiagram, FaPenNib, FaEnvelope, FaSignOutAlt, FaUserCog } from 'react-icons/fa';

const AdminSidebar = ({ activeTab, setActiveTab, profile, unreadCount, handleLogout }) => {
    const tabs = [
        { key: 'projects', label: 'Projeler', icon: <FaProjectDiagram />, activeClass: 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' },
        { key: 'blogs', label: 'Blog Yönetimi', icon: <FaPenNib />, activeClass: 'bg-pink-600 text-white shadow-lg shadow-pink-900/50' },
        { key: 'messages', label: 'Mesajlar', icon: <FaEnvelope />, activeClass: 'bg-green-600 text-white shadow-lg shadow-green-900/50', badge: unreadCount },
        { key: 'profile', label: 'Profil', icon: <FaUserCog />, activeClass: 'bg-purple-600 text-white shadow-lg shadow-purple-900/50' },
    ];

    return (
        <div className="w-full md:w-64 bg-[#111827] border border-slate-800 rounded-2xl p-6 h-fit md:fixed md:left-6 md:top-24 md:h-[calc(100vh-8rem)] flex flex-col shadow-xl z-10">
            <h2 className="text-white font-bold text-xl mb-2 flex items-center gap-2">
                <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></span> YBS Admin
            </h2>
            {profile && (
                <p className="text-xs text-gray-500 mb-6 ml-5">
                    {profile.displayName} • <span className="text-blue-400">{profile.role}</span>
                </p>
            )}

            <nav className="space-y-2 flex-1">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`w-full text-left p-3 rounded-xl flex items-center gap-3 font-medium transition-all ${activeTab === tab.key ? tab.activeClass : 'text-gray-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        {tab.icon} {tab.label}
                        {tab.badge > 0 && (
                            <span className="ml-auto bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                {tab.badge}
                            </span>
                        )}
                    </button>
                ))}
            </nav>

            <div className="pt-6 border-t border-slate-800 mt-auto">
                <button onClick={handleLogout} className="w-full text-left p-3 rounded-xl flex items-center gap-3 text-red-400 hover:bg-red-900/20 transition-colors font-bold">
                    <FaSignOutAlt /> Çıkış Yap
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;
