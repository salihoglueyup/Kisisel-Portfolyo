import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaServer, FaMemory, FaMicrochip, FaWifi } from 'react-icons/fa';

const SystemMonitor = () => {
    const [cpu, setCpu] = useState(12);
    const [ram, setRam] = useState(45);
    const [ping, setPing] = useState(24);

    // Canlı veri simülasyonu
    useEffect(() => {
        const interval = setInterval(() => {
            setCpu(Math.floor(Math.random() * (30 - 10) + 10));
            setRam(Math.floor(Math.random() * (50 - 40) + 40));
            setPing(Math.floor(Math.random() * (40 - 20) + 20));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const metrics = [
        { label: 'CPU Load', value: `${cpu}%`, icon: <FaMicrochip />, color: 'text-blue-400', barColor: 'bg-blue-500' },
        { label: 'Memory', value: `${ram}%`, icon: <FaMemory />, color: 'text-purple-400', barColor: 'bg-purple-500' },
        { label: 'Latency', value: `${ping}ms`, icon: <FaWifi />, color: 'text-green-400', barColor: 'bg-green-500' },
        { label: 'Backend', value: 'Online', icon: <FaServer />, color: 'text-yellow-400', barColor: 'bg-yellow-500' },
    ];

    return (
        <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 backdrop-blur-sm w-full">
            <h3 className="text-gray-300 font-mono mb-4 text-sm uppercase tracking-wider border-b border-slate-700 pb-2">System Status</h3>

            <div className="space-y-6">
                {metrics.map((metric, index) => (
                    <div key={index}>
                        <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                                <span className={metric.color}>{metric.icon}</span>
                                {metric.label}
                            </div>
                            <span className={`font-mono font-bold ${metric.color}`}>{metric.value}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                            <motion.div
                                className={`h-full ${metric.barColor}`}
                                initial={{ width: 0 }}
                                animate={{ width: metric.label === 'Backend' ? '100%' : metric.value }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SystemMonitor;