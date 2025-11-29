import { motion } from 'framer-motion';
import { FaDocker, FaAws, FaBrain } from 'react-icons/fa';

const learning = [
    { name: "AWS Solutions Architect", progress: 65, icon: <FaAws className="text-yellow-500" /> },
    { name: "Advanced Kubernetes", progress: 40, icon: <FaDocker className="text-blue-500" /> },
    { name: "Natural Language Proc.", progress: 25, icon: <FaBrain className="text-pink-500" /> },
];

const LearningPath = () => {
    return (
        <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-gray-300 font-mono mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
                🚀 Current Focus
            </h3>

            <div className="space-y-6">
                {learning.map((item, index) => (
                    <div key={index}>
                        <div className="flex justify-between mb-1">
              <span className="flex items-center gap-2 text-white font-medium text-sm">
                {item.icon} {item.name}
              </span>
                            <span className="text-xs text-gray-400">{item.progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${item.progress}%` }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LearningPath;