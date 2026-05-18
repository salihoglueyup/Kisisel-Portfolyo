// Yerel-duyarlı tarih biçimlendirme — sabit 'tr-TR' yerine aktif
// i18n diline göre Intl.DateTimeFormat kullanır. useTranslation içeren
// bileşenler dil değişiminde yeniden render olduğundan değer güncellenir.
import i18n from '../i18n';

const LOCALE_MAP = { tr: 'tr-TR', en: 'en-US' };

const resolveLocale = () => {
    const base = (i18n.language || 'tr').split('-')[0];
    return LOCALE_MAP[base] || 'tr-TR';
};

// Uzun tarih (örn. 18 Mayıs 2026 / May 18, 2026)
export const formatDate = (
    value,
    options = { year: 'numeric', month: 'long', day: 'numeric' }
) => {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    return new Intl.DateTimeFormat(resolveLocale(), options).format(d);
};

// Tarih + saat (admin panelleri için)
export const formatDateTime = (value) =>
    formatDate(value, {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
    });
