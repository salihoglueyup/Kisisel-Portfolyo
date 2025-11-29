import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTerminal } from 'react-icons/fa';

const commands = {
    help: "Kullanılabilir komutlar: about, skills, contact, clear",
    about: "Ben Veri ve Kod tutkunu bir YBS öğrencisiyim.",
    skills: "Frontend: React, Tailwind | Backend: Node.js, MongoDB | Data: Python",
    contact: "Email: eyupzekisalihoglu@gmail.com | Github: @salihoglueyup",
    clear: "Temizleniyor..."
};

const Terminal = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState(['Sisteme hoşgeldiniz. Komutları görmek için "help" yazın.']);

    const scrollRef = useRef(null);

    const handleCommand = (e) => {
        if (e.key === 'Enter') {
            const cmd = input.trim().toLowerCase();
            let response = "";

            if (cmd === 'clear') {
                setOutput([]);
            } else if (commands[cmd]) {
                response = commands[cmd];
                setOutput([...output, `> ${input}`, response]);
            } else {
                response = `Komut bulunamadı: ${cmd}`;
                setOutput([...output, `> ${input}`, response]);
            }
            setInput('');
        }
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [output]);

    return (
        <motion.div
            className="w-full h-full bg-[#1e1e1e] rounded-lg overflow-hidden font-mono text-sm flex flex-col shadow-inner"
        >
            <div className="bg-[#2d2d2d] px-4 py-2 flex items-center gap-2 border-b border-gray-700 shrink-0">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-2 text-gray-400 flex items-center gap-2 text-xs"><FaTerminal /> guest@ybs-portfolio:~</span>
            </div>

            <div
                ref={scrollRef}
                className="p-4 flex-1 overflow-y-auto space-y-2 text-green-400 custom-scrollbar"
                style={{ minHeight: '200px' }}
            >
                {output.map((line, index) => (
                    <div key={index} className={line.startsWith('>') ? 'text-yellow-400' : 'text-green-400'}>
                        {line}
                    </div>
                ))}

                <div className="flex items-center gap-2">
                    <span className="text-blue-400">➜</span>
                    <span className="text-purple-400">~</span>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleCommand}
                        className="bg-transparent border-none outline-none text-gray-100 w-full focus:ring-0"
                        placeholder="Komut yaz..."
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default Terminal;