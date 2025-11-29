import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaTerminal } from "react-icons/fa";

const Preloader = ({ onComplete }) => {
    const [text, setText] = useState("");
    const fullText = [
        "> Initializing System...",
        "> Loading Modules...",
        "> Connecting to Database...",
        "> Verifying Security Protocols...",
        "> System Online. Welcome User."
    ];
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (index < fullText.length) {
            const timeout = setTimeout(() => {
                setText((prev) => prev + "\n" + fullText[index]);
                setIndex(index + 1);
            }, 500);
            return () => clearTimeout(timeout);
        } else {
            const finishTimeout = setTimeout(() => {
                onComplete();
            }, 800);
            return () => clearTimeout(finishTimeout);
        }
    }, [index, onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center font-mono text-green-500 p-8"
            initial={{ y: 0 }}
            exit={{ y: "-100%", transition: { duration: 0.8, ease: "easeInOut" } }}
        >
            <div className="w-full max-w-md">
                <div className="flex items-center gap-2 mb-4 border-b border-green-500/30 pb-2">
                    <FaTerminal className="animate-pulse" />
                    <span className="text-xs uppercase tracking-widest">YBS_PORTFOLIO_OS v1.0</span>
                </div>
                <div className="h-48 whitespace-pre-line leading-loose text-sm md:text-base">
                    {text}
                    <span className="animate-pulse">_</span>
                </div>

                <div className="w-full h-1 bg-green-900 mt-4 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-green-500"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2.5, ease: "linear" }}
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default Preloader;