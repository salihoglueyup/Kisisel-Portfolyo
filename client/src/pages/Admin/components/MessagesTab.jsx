import toast from 'react-hot-toast';
import api from '../../../api';
import { useQueryClient } from '@tanstack/react-query';
import { FaEnvelope, FaTrash, FaCheckCircle, FaCircle } from 'react-icons/fa';

const MessagesTab = ({ messages }) => {
    const queryClient = useQueryClient();

    const handleMarkAsRead = async (id) => {
        try {
            await api.put(`/messages/${id}/read`);
            queryClient.invalidateQueries({ queryKey: ['messages'] });
        } catch (err) { toast.error(err.friendlyMessage || 'Okundu işaretleme hatası.'); }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bu mesajı silmek istediğine emin misin?')) {
            try {
                await api.delete(`/messages/${id}`);
                queryClient.invalidateQueries({ queryKey: ['messages'] });
                toast.success('Mesaj silindi.');
            } catch (err) { toast.error(err.friendlyMessage || 'Silme hatası.'); }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6 bg-surface p-4 rounded-xl border border-slate-800">
                <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaEnvelope className="text-green-500" /> Gelen Kutusu</h2>
                <span className="bg-slate-800 text-gray-400 px-3 py-1 rounded-full text-xs font-bold">{messages.length} Mesaj</span>
            </div>
            <div className="grid gap-4">
                {messages.length > 0 ? messages.map((msg) => (
                    <div key={msg._id} className={`bg-surface border p-6 rounded-xl transition-all ${msg.isRead ? 'border-slate-800 opacity-70' : 'border-green-500/30'}`}>
                        <div className="flex justify-between mb-2">
                            <div className="flex items-center gap-2">
                                {!msg.isRead && <FaCircle className="text-green-500 text-[8px]" />}
                                <h4 className="font-bold text-white">{msg.name}</h4>
                                <span className="text-xs text-gray-500">&lt;{msg.email}&gt;</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleDateString('tr-TR')}</span>
                                {!msg.isRead && (
                                    <button onClick={() => handleMarkAsRead(msg._id)} className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded hover:bg-green-500/40 transition-colors flex items-center gap-1">
                                        <FaCheckCircle /> Okundu
                                    </button>
                                )}
                                <button onClick={() => handleDelete(msg._id)} className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded hover:bg-red-500/40 transition-colors flex items-center gap-1">
                                    <FaTrash /> Sil
                                </button>
                            </div>
                        </div>
                        <div className="mb-2">
                            <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded font-bold">{msg.subject}</span>
                        </div>
                        <p className="text-gray-400 text-sm">{msg.message}</p>
                    </div>
                )) : (
                    <div className="bg-surface border border-slate-800 p-12 rounded-xl text-center text-gray-500 flex flex-col items-center">
                        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-4xl opacity-50">📭</div>
                        <p>Gelen kutusu boş.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessagesTab;
