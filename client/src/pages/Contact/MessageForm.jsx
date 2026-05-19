import { useState, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { FaPaperPlane, FaCheckCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import api from '../../api';

// Şema t() ile kurulur — hata mesajları aktif dile göre
const buildContactSchema = (t) => z.object({
  name: z.string().min(2, t('contact.val_name_min')),
  email: z.string().email(t('contact.val_email')),
  subject: z.string().min(1, t('contact.val_subject')),
  message: z.string().min(10, t('contact.val_message_min')),
});

// Konu seçenekleri: form state'i stabil `key` tutar (dil değişince
// seçim/karşılaştırma bozulmaz); `i18n` etiketi gösterimde çevrilir;
// `value` ise gönderimde kullanılan sabit kanonik değerdir (DB/admin
// içeriği kullanıcının diline göre değişmesin diye).
const SUBJECTS = [
  { key: 'offer',     i18n: 'contact.subject_offer',     value: 'Proje Teklifi' },
  { key: 'freelance', i18n: 'contact.subject_freelance', value: 'Freelance' },
  { key: 'job',       i18n: 'contact.subject_job',       value: 'İş Fırsatı' },
  { key: 'other',     i18n: 'contact.subject_other',     value: 'Diğer' },
];

const MessageForm = () => {
    const { t } = useTranslation();
    const [status, setStatus] = useState(null);

    const contactSchema = useMemo(() => buildContactSchema(t), [t]);

    const {
        register,
        handleSubmit,
        setValue,
        control,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            name: '',
            email: '',
            subject: 'offer',
            message: ''
        }
    });

    const watchSubject = useWatch({ control, name: 'subject' });

    const onSubmit = async (data) => {
        setStatus('loading');
        try {
            // UI state'i stabil key tutar; gönderimde sabit kanonik değere çevir
            const subject = SUBJECTS.find((s) => s.key === data.subject)?.value || data.subject;
            await api.post('/messages', { ...data, subject });
            setStatus('success');
            reset();
            setTimeout(() => setStatus(null), 5000);
        } catch (err) {
            // Önceden 'error' set ediliyordu ama hiçbir yerde render edilmiyordu
            // (sessiz başarısızlık). Modal ile tutarlı: friendlyMessage toast'ı.
            setStatus(null);
            toast.error(err?.friendlyMessage || t('contact.error'));
        }
    };

    return (
        <div className="bg-surface border border-slate-800 rounded-2xl p-8 lg:p-10 relative shadow-2xl">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-white">{t('contact.form_title')}</h3>
                <FaPaperPlane className="text-slate-700 text-2xl rotate-12" />
            </div>

            {status === 'success' ? (
                <div className="flex flex-col items-center justify-center py-24 text-center bg-slate-900/50 rounded-xl border border-slate-700 border-dashed">
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6"><FaCheckCircle className="text-4xl text-green-500 animate-bounce" /></div>
                    <h4 className="text-2xl font-bold text-white">{t('contact.success_title')}</h4>
                    <p className="text-gray-400 mt-2 max-w-xs mx-auto">{t('contact.success_desc')}</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="contact-name" className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">{t('contact.name')}</label>
                            <input id="contact-name" type="text" {...register('name')} aria-invalid={!!errors.name} className="w-full bg-surface-raised border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-slate-900 outline-none transition-all" placeholder={t('contact.name')} />
                            {errors.name && <p className="text-red-400 text-xs mt-1 ml-1">{errors.name.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="contact-email" className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">{t('contact.email')}</label>
                            <input id="contact-email" type="email" {...register('email')} aria-invalid={!!errors.email} className="w-full bg-surface-raised border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-slate-900 outline-none transition-all" placeholder="ornek@email.com" />
                            {errors.email && <p className="text-red-400 text-xs mt-1 ml-1">{errors.email.message}</p>}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <span id="contact-subject-label" className="block text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">{t('contact.subject')}</span>
                        <div role="group" aria-labelledby="contact-subject-label" className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {SUBJECTS.map((s) => (
                                <button type="button" key={s.key} aria-pressed={watchSubject === s.key} onClick={() => setValue('subject', s.key)} className={`py-2 text-xs font-bold rounded-xl border transition-all ${watchSubject === s.key ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-surface-raised border-slate-700 text-gray-400 hover:border-gray-500'}`}>{t(s.i18n)}</button>
                            ))}
                        </div>
                        {errors.subject && <p className="text-red-400 text-xs mt-1 ml-1">{errors.subject.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="contact-message" className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">{t('contact.message')}</label>
                        <textarea id="contact-message" rows="6" {...register('message')} aria-invalid={!!errors.message} className="w-full bg-surface-raised border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-slate-900 outline-none transition-all resize-none" placeholder={t('contact.form_placeholder')}></textarea>
                        {errors.message && <p className="text-red-400 text-xs mt-1 ml-1">{errors.message.message}</p>}
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-1">{isSubmitting ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div> : <><FaPaperPlane /> {t('contact.send')}</>}</button>
                </form>
            )}
        </div>
    );
};

export default MessageForm;
