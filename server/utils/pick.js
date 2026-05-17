// Bir nesneden yalnız izin verilen alanları seçer (mass-assignment koruması).
// undefined alanlar atlanır — kısmi güncellemeler için güvenlidir.
const pick = (obj, allowedFields) => {
    if (!obj || typeof obj !== 'object') return {};
    return allowedFields.reduce((acc, key) => {
        if (obj[key] !== undefined) acc[key] = obj[key];
        return acc;
    }, {});
};

module.exports = pick;
