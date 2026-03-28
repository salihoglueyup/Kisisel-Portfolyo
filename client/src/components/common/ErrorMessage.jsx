import { motion } from 'framer-motion';
import { FaExclamationTriangle, FaRedo } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const ErrorMessage = ({ message, onRetry, compact = false }) => {
    const { t } = useTranslation();

    if (compact) {
        return (
            <div className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm">
                <FaExclamationTriangle className="text-red-400 shrink-0" />
                <span className="text-red-300">{message || t('common.error')}</span>
                {onRetry && (
                    <button onClick={onRetry} className="ml-auto text-red-400 hover:text-white transition-colors">
                        <FaRedo className="text-xs" />
                    </button>
                )}
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 px-6"
        >
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                <FaExclamationTriangle className="text-2xl text-red-400" />
            </div>
            <p className="text-gray-300 font-medium mb-2">{message || t('common.error')}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="mt-4 px-6 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-gray-300 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                >
                    <FaRedo className="text-xs" /> {t('common.retry')}
                </button>
            )}
        </motion.div>
    );
};

export default ErrorMessage;
