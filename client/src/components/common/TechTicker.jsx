import { motion } from "framer-motion";

const techs = [
    {
        name: "HTML5",
        img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg"
    },
    {
        name: "CSS3",
        img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg"
    },
    {
        name: "JavaScript",
        img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"
    },
    {
        name: "React",
        img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
    },
    {
        name: "Tailwind",
        img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg"
    },
    {
        name: "Vite",
        img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg"
    },
    {
        name: "Node.js",
        img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg"
    },
    {
        name: "Python",
        img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg"
    },
    {
        name: "Django",
        img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg",
        className: "invert"
    },
    {
        name: "TensorFlow",
        img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg"
    },
    {
        name: "Scikit-learn",
        img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg"
    },
    {
        name: "MongoDB",
        img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg"
    },
    {
        name: "PostgreSQL",
        img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg"
    },
    {
        name: "SQLite",
        img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg"
    },
    {
        name: "Linux",
        img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg"
    },
    {
        name: "Kali Linux",
        img: "https://upload.wikimedia.org/wikipedia/commons/2/29/Kali-dragon-icon.svg"
    },
    {
        name: "Bash",
        img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg",
        className: "invert"
    },
    {
        name: "Arduino",
        img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/arduino/arduino-original.svg"
    },
    {
        name: "Docker",
        img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg"
    },
    {
        name: "Git",
        img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg"
    },
    {
        name: "GitHub",
        img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
        className: "invert"
    },
];

const TechTicker = () => {
    return (
        <div className="w-full bg-slate-800/50 border-y border-slate-700 py-6 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-[#0B1120] to-transparent z-10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-[#0B1120] to-transparent z-10 pointer-events-none" />

            <motion.div
                className="flex space-x-16 whitespace-nowrap"
                animate={{ x: [0, -2500] }}
                transition={{
                    repeat: Infinity,
                    ease: "linear",
                    duration: 60,
                }}
            >
                {[...techs, ...techs].map((tech, index) => (
                    <div key={index} className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors cursor-default group grayscale hover:grayscale-0">
                        <img
                            src={tech.img}
                            alt={tech.name}
                            className={`w-8 h-8 object-contain transition-transform group-hover:scale-110 ${tech.className || ''}`}
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                        <span className="font-mono font-bold text-sm tracking-wide">{tech.name}</span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export default TechTicker;