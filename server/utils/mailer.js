// Genel e-posta gönderimi (nodemailer).
// SMTP env değişkenleri tanımlı değilse: hata fırlatmaz, uyarı loglar ve
// no-op olur — böylece e-posta opsiyonel kalır (mesaj/şifre akışı bozulmaz).
const nodemailer = require('nodemailer');
const logger = require('../config/logger');

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

const isConfigured = Boolean(SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS);

let transporter = null;
if (isConfigured) {
    transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: Number(SMTP_PORT) === 465, // 465 -> SSL, diğerleri STARTTLS
        auth: { user: SMTP_USER, pass: SMTP_PASS }
    });
} else {
    logger.warn('SMTP yapılandırılmadı — e-posta gönderimi devre dışı (no-op).');
}

/**
 * E-posta gönderir. SMTP yoksa sessizce false döner (hata fırlatmaz).
 * @returns {Promise<boolean>} gönderim denendi mi
 */
const sendMail = async ({ to, subject, html, text }) => {
    if (!transporter) return false;
    try {
        await transporter.sendMail({
            from: SMTP_FROM || SMTP_USER,
            to,
            subject,
            text,
            html
        });
        return true;
    } catch (err) {
        // E-posta hatası ana iş akışını ASLA bozmamalı — sadece logla
        logger.error(`E-posta gönderilemedi: ${err.message}`);
        return false;
    }
};

module.exports = { sendMail, isMailConfigured: isConfigured };
