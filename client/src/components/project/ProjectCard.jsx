import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaGithub, FaExternalLinkAlt, FaClock, FaCode, FaStar } from 'react-icons/fa';

const ProjectCard = ({ project }) => {
    const getComplexityColor = (score) => {
        if (score >= 8) return 'bg-red-500';
        if (score >= 5) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -5 }}
            className="bg-[#111827] border border-slate-800 rounded-xl overflow-hidden flex flex-col h-full hover:border-blue-500/50 transition-all group relative shadow-lg shadow-black/20"
        >
            <Link to={`/projects/${project._id}`} className="absolute inset-0 z-10" />

            <div className="h-48 bg-slate-800 relative overflow-hidden">
                {project.image && project.image !== 'no-image.jpg' ? (
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-900/40 to-slate-900 flex items-center justify-center">
                        <FaCode className="text-6xl text-slate-700/50" />
                    </div>
                )}

                <div className="absolute top-3 left-3 z-20">
           <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-xs font-bold text-white rounded-full border border-white/10 shadow-lg">
             {project.tags[0]}
           </span>
                </div>

                {project.metrics?.complexity >= 8 && (
                    <div className="absolute top-3 right-3 z-20 text-yellow-500 bg-black/50 p-1 rounded-full border border-yellow-500/30">
                        <FaStar />
                    </div>
                )}
            </div>

            <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {project.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
                    {project.description}
                </p>

                <div className="bg-slate-900/50 rounded-lg p-3 mb-4 border border-slate-800/50">
                    <div className="mb-2">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Complexity</span>
                            <span>{project.metrics?.complexity || 5}/10</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${getComplexityColor(project.metrics?.complexity)}`}
                                style={{ width: `${(project.metrics?.complexity || 5) * 10}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="flex justify-between text-xs text-gray-400 font-mono mt-2">
                        <span className="flex items-center gap-1"><FaClock className="text-blue-400"/> {project.metrics?.hoursSpent || 0}h</span>
                        <span className="flex items-center gap-1"><FaCode className="text-purple-400"/> {project.metrics?.linesOfCode || 0} lines</span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="text-[10px] text-gray-400 bg-slate-800/80 px-2 py-1 rounded border border-slate-700">
              #{tag}
            </span>
                    ))}
                </div>
            </div>

            <div className="flex gap-3 mt-auto px-6 pb-6 pt-0 relative z-20">
                {project.links?.github && (
                    <a href={project.links.github} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold uppercase tracking-wider transition-colors border border-slate-700">
                        <FaGithub /> Kod
                    </a>
                )}
                {project.links?.live && (
                    <a href={project.links.live} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-blue-900/20">
                        <FaExternalLinkAlt /> Demo
                    </a>
                )}
            </div>
        </motion.div>
    );
};

export default ProjectCard;