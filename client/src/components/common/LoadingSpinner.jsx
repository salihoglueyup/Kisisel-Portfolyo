import { motion } from 'framer-motion';

const LoadingSpinner = ({ text, size = 'md', fullScreen = false }) => {
    const sizes = {
        sm: { spinner: 'w-6 h-6 border-2', text: 'text-xs' },
        md: { spinner: 'w-10 h-10 border-3', text: 'text-sm' },
        lg: { spinner: 'w-16 h-16 border-4', text: 'text-base' }
    };

    const s = sizes[size] || sizes.md;

    const content = (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center gap-4"
        >
            <div className={`${s.spinner} border-slate-700 border-t-blue-500 rounded-full animate-spin`} />
            {text && (
                <p className={`${s.text} text-gray-400 font-medium animate-pulse`}>{text}</p>
            )}
        </motion.div>
    );

    if (fullScreen) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                {content}
            </div>
        );
    }

    return content;
};

export default LoadingSpinner;
