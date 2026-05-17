const AdminStatsBar = ({ projects, blogs, messages }) => {
    const stats = [
        { label: 'Proje', value: projects.length, color: 'text-blue-400' },
        { label: 'Blog Yazısı', value: blogs.length, color: 'text-pink-400' },
        { label: 'Mesaj', value: messages.length, color: 'text-green-400' },
        { label: 'Okunmamış', value: messages.filter(m => !m.isRead).length, color: 'text-yellow-400' },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, idx) => (
                <div key={idx} className="bg-[#111827] border border-slate-800 rounded-xl p-4 text-center">
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-xs text-gray-500 uppercase font-bold">{stat.label}</p>
                </div>
            ))}
        </div>
    );
};

export default AdminStatsBar;
