import CountUp from 'react-countup';
import { motion } from 'framer-motion';

const stats = [
    { label: "Tamamlanan Proje", value: 12, suffix: "+" },
    { label: "Satır Kod", value: 15000, suffix: "+" },
    { label: "Kahve Tüketimi", value: 450, suffix: " Bardak" },
    { label: "Github Commit", value: 1200, suffix: "+" },
];

const StatCards = () => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-12">
            {stats.map((stat, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-colors text-center group"
                >
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                        <CountUp end={stat.value} duration={2.5} />
                        <span className="text-blue-500 text-xl">{stat.suffix}</span>
                    </h3>
                    <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
                </motion.div>
            ))}
        </div>
    );
};

export default StatCards;