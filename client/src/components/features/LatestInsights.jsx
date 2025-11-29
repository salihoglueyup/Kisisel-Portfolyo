import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';

const posts = [
    { title: "React ve Node.js ile Mikroservis Mimarisi", tag: "Architecture", date: "22 Nov" },
    { title: "Büyük Veri Analizinde Python'un Gücü", tag: "Data Science", date: "15 Nov" },
    { title: "YBS Öğrencileri İçin Kariyer Yolu", tag: "Career", date: "08 Nov" },
];

const LatestInsights = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {posts.map((post, index) => (
                <motion.div
                    key={index}
                    whileHover={{ y: -5 }}
                    className="p-5 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl cursor-pointer group"
                >
                    <div className="flex justify-between items-start mb-3">
            <span className="px-2 py-1 text-xs rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
              {post.tag}
            </span>
                        <span className="text-xs text-gray-500">{post.date}</span>
                    </div>
                    <h4 className="text-white font-semibold mb-3 group-hover:text-blue-400 transition-colors">
                        {post.title}
                    </h4>
                    <div className="flex items-center text-sm text-gray-400 group-hover:translate-x-2 transition-transform">
                        Oku <FaArrowRight className="ml-2 text-xs" />
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default LatestInsights;