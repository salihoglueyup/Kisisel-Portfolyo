// NoSQL injection koruması — req.body / req.query / req.params içindeki
// MongoDB operatör anahtarlarını ($ ile başlayan veya . içeren) temizler.
//
// Neden kendi middleware'imiz? `express-mongo-sanitize@2.x`, req.query'yi
// yeniden ATAR; Express 5'te req.query salt-okunur bir getter olduğundan
// bu her istekte TypeError fırlatır. Bu sürüm nesneleri YERİNDE temizler,
// dolayısıyla req.query referansı hiç yeniden atanmaz.

const PROHIBITED = /^\$|\./;

function sanitizeInPlace(obj, depth = 0) {
    if (!obj || typeof obj !== 'object' || depth > 10) return;

    if (Array.isArray(obj)) {
        for (const item of obj) sanitizeInPlace(item, depth + 1);
        return;
    }

    for (const key of Object.keys(obj)) {
        if (PROHIBITED.test(key)) {
            delete obj[key];
            continue;
        }
        sanitizeInPlace(obj[key], depth + 1);
    }
}

const mongoSanitize = () => (req, _res, next) => {
    // req.query Express 5'te yeniden atanamaz → yerinde temizliyoruz
    if (req.body) sanitizeInPlace(req.body);
    if (req.params) sanitizeInPlace(req.params);
    if (req.query) sanitizeInPlace(req.query);
    next();
};

module.exports = mongoSanitize;
