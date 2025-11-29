import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const methods = ['GET', 'POST', 'PUT', 'DELETE'];
const paths = ['/api/projects', '/login', '/blog/post-1', '/contact', '/admin/dashboard'];
const statusCodes = [200, 201, 401, 403, 404, 500];

const TrafficLogs = () => {
    const [logs, setLogs] = useState([
        { id: 1, time: '10:42:01', method: 'GET', path: '/', status: 200, ip: '192.168.1.10' },
        { id: 2, time: '10:42:05', method: 'POST', path: '/api/auth', status: 200, ip: '10.0.0.5' },
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            const newLog = {
                id: Date.now(),
                time: new Date().toLocaleTimeString(),
                method: methods[Math.floor(Math.random() * methods.length)],
                path: paths[Math.floor(Math.random() * paths.length)],
                status: statusCodes[Math.floor(Math.random() * statusCodes.length)],
                ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
            };

            setLogs(prev => [newLog, ...prev].slice(0, 6));
        }, 1500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-black/40 border border-slate-800 rounded-xl p-4 font-mono text-xs overflow-hidden">
            <div className="flex justify-between items-center mb-3 border-b border-slate-800 pb-2">
                <span className="text-gray-400 font-bold">SERVER_ACCESS_LOGS</span>
                <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
            </div>

            <div className="space-y-2">
                {logs.map((log) => (
                    <motion.div
                        key={log.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="grid grid-cols-12 gap-2 text-gray-300 border-b border-slate-800/50 pb-1"
                    >
                        <span className="col-span-2 text-gray-500">{log.time}</span>
                        <span className={`col-span-2 font-bold ${log.method === 'GET' ? 'text-blue-400' : log.method === 'POST' ? 'text-yellow-400' : 'text-red-400'}`}>{log.method}</span>
                        <span className={`col-span-2 ${log.status >= 400 ? 'text-red-500' : 'text-green-500'}`}>{log.status}</span>
                        <span className="col-span-4 truncate text-gray-400">{log.path}</span>
                        <span className="col-span-2 text-gray-600 text-right">{log.ip}</span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default TrafficLogs;