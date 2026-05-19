import { useState, useEffect } from 'react';
import { FaClock } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

// Yerel saat tile'ı — kendi 60sn interval'ını izole eder; böylece
// dakikalık tik tüm Contact ağacını değil yalnız bu bileşeni render eder.
const LocalClock = () => {
    const { t } = useTranslation();
    const [currentTime, setCurrentTime] = useState(
        new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    );

    useEffect(() => {
        const timer = setInterval(
            () => setCurrentTime(new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })),
            60000
        );
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="bg-surface-raised border border-slate-700 p-4 rounded-xl flex flex-col items-center justify-center text-center">
            <FaClock className="text-blue-400 text-xl mb-2" />
            <span className="text-2xl font-bold text-white">{currentTime}</span>
            <span className="text-[10px] text-gray-400 uppercase font-bold">{t('contact.local_time')}</span>
        </div>
    );
};

export default LocalClock;
