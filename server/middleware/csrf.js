// CSRF koruması — double-submit cookie deseni.
//
// Cookie ile kimlik doğrulanan endpoint'ler (/auth/refresh, /auth/logout)
// CSRF'e açıktır. Çözüm: login'de set edilen `csrfToken` cookie'sinin değeri,
// istemci tarafından `X-CSRF-Token` header'ı ile de gönderilmeli ve eşleşmeli.
// Cross-site saldırgan kurbanın cookie değerini okuyamaz (SOP) ve özel
// header'ı cross-origin set edemez — bu yüzden istek reddedilir.

const crypto = require('crypto');

const safeEqual = (a, b) => {
    if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) {
        return false;
    }
    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
};

const verifyCsrf = (req, res, next) => {
    const cookieToken = req.cookies?.csrfToken;
    const headerToken = req.get('X-CSRF-Token');

    if (!cookieToken || !headerToken || !safeEqual(cookieToken, headerToken)) {
        return res.status(403).json({
            success: false,
            message: 'CSRF doğrulaması başarısız. Lütfen tekrar giriş yapın.'
        });
    }
    next();
};

module.exports = { verifyCsrf };
